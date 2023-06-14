import { default as axios } from 'axios';
import { RouteAPI } from './types';
import { subwayDB } from './config/mongodb.config';

const { OPENAPI_MOVEMENT, OPENAPI_DISTANCE, OPENAPI_ROUTE, OPENAPI_TRFMOVEMENT } = process.env;

export async function getTrainDistances (routeInfo: RouteAPI, stIndex: number, trIndex: number, tr: boolean) {
  const { driveInfoSet : { driveInfo }, stationSet : { stations } } = routeInfo;
  const plfNo = stations[stIndex].startID - stations[stIndex].endSID === 1 ? 1 : 2;
  if (tr) {
    const lane = driveInfo[trIndex].wayCode;
    const response = await axios.get(
      `${OPENAPI_DISTANCE}&lnCd=${lane}&stinCd=${stations[stIndex].startID}&plfNo=${plfNo}`
    );

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
  } else {
    const lane = driveInfo[trIndex].laneID;
    const response = await axios.get(
      `${OPENAPI_DISTANCE}&lnCd=${lane}&stinCd=${stations[stIndex].startID}&plfNo=${plfNo}`
    );

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

export async function getTransferMovement (routeInfo: RouteAPI, index: number) {
  const { driveInfoSet : { driveInfo }, stationSet : { stations } } = routeInfo;
  const response = await axios.get(
    `${OPENAPI_TRFMOVEMENT}&lnCd=${driveInfo[index].laneID}` +
    `&stinCd=${stations[driveInfo[index].stationCount - 1].endSID}&chthTgtLn=${driveInfo[index].wayCode}`
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
  if (!data?.result) {
    return null;
  }
  return data.result;
}

export async function getStStationInfo (routeInfo: RouteAPI, stStation: any) {
  const movement = await getTotalMovement(routeInfo);
  console.log('111111');
  const distance = await getTrainDistances(routeInfo, 0, 0, false);
  const mvPathNm = routeInfo.stationSet.stations.slice(0, (routeInfo.driveInfoSet.driveInfo[0].stationCount));
  return {
    stPath : {
      exit : movement.stMovePath,
      route : movement.edMovePath,
      detail : movement.pathList,
    },
    onInfo : {
      stationName : stStation.stNm,
      onLine : routeInfo.driveInfoSet.driveInfo[0].laneName,
      route : `${routeInfo.stationSet.stations[0].endName} 방면`,
      toWay : routeInfo.driveInfoSet.driveInfo[0].wayName,
      arrived : '',
      etc : {
        wheelchair : '',
        shtDistance : distance?.shtDistance.join(' '),
        lngDistance : distance?.lngDistance.join(' '),
      },
      mvTime : mvPathNm[mvPathNm.length - 1].travelTime,
      mvPathCnt : mvPathNm.length,
      mvPathNm : mvPathNm.map((doc: any) => doc.startName),
    },
  };
}

export async function getTrStationInfo (routeInfo: RouteAPI) {
  if (!routeInfo?.exChangeInfoSet) {
    return [];
  } else {
    const distance = await Promise.all(
      routeInfo.exChangeInfoSet.exChangeInfo.map(async (doc: any, index: number) => {
        console.log('인덱스~');
        const distance = await getTrainDistances(
          routeInfo, routeInfo.driveInfoSet.driveInfo[index].stationCount + 1, index, true
        );
        const trInfo = await getTransferMovement(routeInfo, index);
        const mvPath = routeInfo.stationSet.stations.filter(
          (st: any) => String(doc.exSID).slice(0, 1) === String(st.endSID).slice(0, 1)
        );
        return {
          offInfo : {
            stationName : doc.exName,
            offLine : doc.laneName,
            onLine : `${String(doc.exSID).slice(0, 1)}호선`,
            door : '',
            etc : {
              shtOnLift : '',
              shtDistance : distance?.shtDistance.join(' '),
              lngDistance : distance?.lngDistance.join(' '),
            },
          },
          trInfo : {
            route : trInfo.edMovePath,
            detail : trInfo.pathList,
          },
          onInfo : {
            stationName : doc.exName,
            line : `${String(doc.exSID).slice(0, 1)}호선`,
            route : `${doc.exName} 방면`,
            toWay : routeInfo.driveInfoSet.driveInfo[index + 1].wayName === '내선순환' ?
              '내선순환' : `${routeInfo.driveInfoSet.driveInfo[index + 1].wayName} 행`,
            arrived : '',
            etc : {
              wheelchair : '',
              shtDistance : distance?.shtDistance.join(' '),
              lngDistance : distance?.lngDistance.join(' '),
            },
            mvTime : mvPath[mvPath.length - 1].travelTime,
            mvPathCnt : mvPath.length,
            mvPathNm : mvPath.map((doc: any) => doc.startName),
          },
        };
      })
    );
    return distance;
  }
}

export async function getEndStationInfo (routeInfo: RouteAPI, endStation: any) {
  console.log('33333333');
  const movement = await getTotalMovement(routeInfo);
  const { driveInfoSet : { driveInfo }, stationSet : { stations } } = routeInfo;
  const plfNo = stations[stations.length - 1].startID - stations[stations.length - 1].endSID === 1 ? 1 : 2;
  // const lastSt = await subwayDB.collection('seoulOp').findOne({ code : endStation.code });
  const lastCode = endStation.stCode.split('')[0] === '0' ? endStation.stCode.slice(1) : endStation.stCode;
  const response = await axios.get(
    `${OPENAPI_DISTANCE}&lnCd=${endStation.line.slice(0, 1)}&stinCd=${lastCode}&plfNo=${plfNo}`
  );

  const { body } = response.data;
  body.sort((a: any, b: any) => a.sfDst - b.sfDst);
  const shtDistance = body.slice(0, 3).map((doc: any) => {
    return `${doc.carOrdr}-${doc.carEtrcNo}`;
  });
  const lngDistance = body.slice(-4, -1).map((doc: any) => {
    return `${doc.carOrdr}-${doc.carEtrcNo}`;
  });

  const distance = {
    shtDistance,
    lngDistance,
  };

  return {
    offInfo : {
      stationName : endStation.stNm,
      offLine : endStation.line,
      door : '',
      etc : {
        shtOnLift : '',
        shtDistance : distance?.shtDistance.join(' '),
        lngDistance : distance?.lngDistance.join(' '),
      },
    },
    endPath : {
      exit : '',
      route : '',
      detail : [],
    },
  };
}
