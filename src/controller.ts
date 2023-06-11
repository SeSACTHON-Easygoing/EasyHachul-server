import { Context, Next } from 'koa';
import { getStationInfo, searchStationName } from './module';
import axios from 'axios';
import { RouteAPI } from './types';
import { subwayDB } from './config/mongodb.config';
import { getRouteInfo, getTotalMovement, getTrainDistances, stStaionInfo } from './openapiLogic';

const { OPENAPI_ROUTE, OPENAPI_MOVEMENT } = process.env;

export async function getStationInfoCtr (ctx: Context, next: Next) {
  const allData = await getStationInfo();

  ctx.response.body = {
    result : { success : true, message : '' },
    data : allData,
  };
  await next();
}

export async function searchStationNameCtr (ctx: Context, next: Next) {
  const query = ctx.query.query as string;

  let searchResult;
  const searchList: any = [];

  if (query!.length > 1 && query!.split('').pop() === '역') {
    const conv = query!.split('');
    conv.pop();
    const newQeury = conv!.join('');
    searchResult = await searchStationName(newQeury as string);

    await searchResult.forEach(doc => {
      if (doc.stNm.includes(newQeury) && doc.stNm.split('')[0] === newQeury.split('')[0]) {
        searchList.push(doc);
      }
    });
  } else if (query) {
    searchResult = await searchStationName(query as string);

    await searchResult.forEach(doc => {
      if (doc.stNm.includes(query) && doc.stNm.split('')[0] === query.split('')[0]) {
        searchList.push(doc);
      }
    });
  } else {
    ctx.response.body = {
      result : { success : true, message : '' },
      data : [],
    };
    return next();
  }

  ctx.response.body = {
    result : { success : true, message : '' },
    data : searchList,
  };
  await next();
}

export async function getRouteInfoCtr (ctx: Context, next: Next) {
  const { stStation, endStation } = ctx.request.body;

  const routeInfo = await getRouteInfo(stStation, endStation);
  if (!routeInfo) {
    ctx.response.body = {
      result : { success : true, message : 'Route info not found' },
      data : {},
    };
  }
  const stStationInfo = await stStaionInfo(routeInfo);
  let trStation;
  if (!routeInfo?.exChangeInfoSet) {
    trStation = [];
  } else {
  }

  ctx.response.body = {
    result : { success : true, message : '' },
    data : {
      stStation : {
        stPath : {
          exit : stStationInfo.movement.stMovePath,
          route : stStationInfo.movement.edMovePath,
          detail : stStationInfo.movement.pathList,
        },
        onInfo : {
          stationName : stStation.name,
          onLine : stStation.line,
          route : stStationInfo.movement.edMovePath,
          toWay : routeInfo.driveInfoSet.driveInfo[0].wayName,
          arrived : '',
          etc : {
            wheelchair : '',
            shtDistance : stStationInfo.distance?.shtDistance.join(' '),
            lngDistance : stStationInfo.distance?.lngDistance.join(' '),
          },
          mvTime : stStationInfo.mvTime.reduce((acc: any, curr: any) => acc + curr.travelTime, 0),
          mvPathCnt : stStationInfo.mvPathNm.length,
          mvPathNm : stStationInfo.mvPathNm.map((doc: any) => doc.startName),
        },
      },
      trStation : trStation,
      endStation : {
        offInfo : {
          stationName : endStation.name,
          offLine : endStation.line,
          door : '',
          arrived : '',
        },
        etc : {
          shtOnLift : '',
          shtDistance : '',
          lngDistance : '',
        },
        endPath : {
          exit : '',
          route : '',
          detail : [],
        },
      },
    },
  };

  await next();
}