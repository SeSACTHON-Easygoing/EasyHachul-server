import Router from '@koa/router';
import { getStationInfoCtr, searchStationNameCtr } from './controller';
import { Context, Next } from 'koa';

const router = new Router();

export const allRouter = router
  .get('전체 지하철역 정보 가져오기', '/', getStationInfoCtr)
  .get('역 이름 검색하기', '/search', searchStationNameCtr);

export const healthRouter = router.get('/', async (ctx: Context, next: Next) => {
  ctx.status = 200;
  await next();
});