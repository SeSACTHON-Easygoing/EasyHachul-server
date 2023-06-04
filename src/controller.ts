import { Context, Next } from 'koa';
import { getStationInfo, searchStationName } from './module';

export async function getStationInfoCtr (ctx: Context, next: Next) {
  const allData = await getStationInfo();

  ctx.response.body = {
    result : { success : true, message : '' },
    data : allData,
  };
  await next();
}

export async function searchStationNameCtr (ctx: Context, next: Next) {
  const { query } = ctx.query;

  const searchResult = await searchStationName(query as string);
  const searchList: any = [];
  await searchResult.forEach(doc => searchList.push(doc));

  ctx.response.body = {
    result : { success : true, message : '' },
    data : searchList,
  };
  await next();
}