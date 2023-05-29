import Router from '@koa/router';
import { getStationInfoCtr } from './controller';

const router = new Router();

export const allRouter = router
  .get('전체 지하철역 정보 가져오기', '/', getStationInfoCtr);