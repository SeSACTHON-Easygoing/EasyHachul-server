import axios from 'axios';
import { RouteAPI } from './types';

const { OPENAPI_MOVEMENT, OPENAPI_DISTANCE, OPENAPI_ROUTE } = process.env;

export async function getTrainDistances (routeInfo: RouteAPI) {
  const { driveInfoSet : { driveInfo }, stationSet : { stations } } = routeInfo;
  const plfNo = stations[1].startID - stations[0].startID === 1 ? 1 : 2;
  const response = await axios.get(
    `${OPENAPI_DISTANCE}&lnCd=${driveInfo[0].laneID}&stinCd=${stations[0].startID}&plfNo=${plfNo}`
  );

  // if (response.data.header.resultCode === '03') {
  //   return;
  // }

  const list = response.data.body;
  list.sort((a: any, b: any) => a.sfDst - b.sfDst);
  const shtDistance = list.slice(0, 3).map((doc: any) => {
    return `${doc.carOrdr}-${doc.carEtrcNo}`;
  });
  const lngDistance = list.slice(-4, -1).map((doc: any) => {
    return `${doc.carOrdr}-${doc.carEtrcNo}`;
  });

  return {
    shtDistance,
    lngDistance,
  };
}

export async function getTotalMovement (routeInfo: RouteAPI) {
  const { driveInfoSet : { driveInfo }, stationSet : { stations } } = routeInfo;
  const response = await axios.get(
    `${OPENAPI_MOVEMENT}&lnCd=${driveInfo[0].laneID}&stinCd=${stations[0].startID}&nextStinCd=${stations[1].startID}`
  );
  const align = response.data.body[0].mvPathMgNo;
  const path = response.data.body.filter((doc: any) => doc.mvPathMgNo === align);
  const pathList = path.map((doc: any) => doc.mvContDtl);

  return {
    stMovePath : response.data.body[0].stMovePath,
    edMovePath : response.data.body[0].edMovePath,
    pathList,
  };
}

export async function getRouteInfo (stStation: any, endStation: any) {
  const { data } = await axios.get(`${OPENAPI_ROUTE}&SID=${stStation.code.slice(1)}&EID=${endStation.code.slice(1)}`);
  console.log(data);
  if (!data?.result) {
    return null;
  }
  return data.result;
}

export async function stStaionInfo (routeInfo: RouteAPI) {
  const movement = await getTotalMovement(routeInfo);
  const distance = await getTrainDistances(routeInfo);

  const mvTime = routeInfo.stationSet.stations.slice(0, (routeInfo.driveInfoSet.driveInfo[0].stationCount) - 1);
  const mvPathNm = routeInfo.stationSet.stations.slice(0, (routeInfo.driveInfoSet.driveInfo[0].stationCount));
  return {
    movement,
    distance,
    mvTime,
    mvPathNm,
  };
}

export async function endStationInfo (routeInfo: RouteAPI) {
  const movement = await getTotalMovement(routeInfo);
  const distance = await getTrainDistances(routeInfo);

  return {
    movement,
    distance,
  };
}