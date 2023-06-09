import { Context, Next } from 'koa';
import { getStationInfo, searchStationName } from './module';
import axios from 'axios';
import { RouteAPI } from './types';
import { subwayDB } from './config/mongodb.config';
import { getTotalMovement, getTrainDistances } from './openapiLogic';

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
  } else {
    searchResult = await searchStationName(query as string);

    await searchResult.forEach(doc => {
      if (doc.stNm.includes(query) && doc.stNm.split('')[0] === query.split('')[0]) {
        searchList.push(doc);
      }
    });
  }

  ctx.response.body = {
    result : { success : true, message : '' },
    data : searchList,
  };
  await next();
}

export async function getRouteInfoCtr (ctx: Context, next: Next) {
  const { stStation, endStation } = ctx.request.body;

  const routeInfo = await getTotalMovement(stStation.foreignCode, endStation.foreignCode);
  const stStationDistances = await getTrainDistances(
    routeInfo.driveInfo[0].laneID, stStation.stationCode, routeInfo.driveInfo[0].wayCode
  );

  await next();
}