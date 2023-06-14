import { Context, Next } from 'koa';
import { getStationInfo, searchStationName } from './module';
import {
  getEndStationInfo,
  getRouteInfo,
  getStStationInfo,
  getTrStationInfo,
} from './openapiLogic';

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
    data : searchList.sort((a: any, b: any) => a.code - b.code),
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
  const stStationInfo = await getStStationInfo(routeInfo, stStation);
  const endStationInfo = await getEndStationInfo(routeInfo, endStation);
  const trStation = await getTrStationInfo(routeInfo);

  ctx.response.body = {
    result : { success : true, message : '' },
    data : {
      stStation : stStationInfo,
      trStation : trStation,
      endStation : endStationInfo,
    },
  };

  await next();
}
