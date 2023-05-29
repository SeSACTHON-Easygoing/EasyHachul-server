import { Context, Next } from 'koa';
import { getStationInfo } from './module';

export async function getStationInfoCtr (ctx: Context, next: Next) {
  const allData = await getStationInfo();

  ctx.response.body = {
    result : { success : true, message : '' },
    data : allData,
  };
}