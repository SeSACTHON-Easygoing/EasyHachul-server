import Router from '@koa/router';
import { getRouteInfoCtr, getStationInfoCtr, searchStationNameCtr } from './controller';
import { Context, Next } from 'koa';
import { subwayDB } from './config/mongodb.config';
import axios from 'axios';

const router = new Router();

export const allRouter = router
  .get('전체 지하철역 정보 가져오기', '/', getStationInfoCtr)
  .get('역 이름 검색하기', '/search', searchStationNameCtr)
  .post('지하철 경로 정보 가져오기', '/route', getRouteInfoCtr);
  // .get('/test', async (ctx: Context, next: Next) => {
  //   const d = await subwayDB.collection('seoulOp').find().toArray();
  //   for (const doc of d) {
  //     const code = doc.stCode.split('')[0] ? doc.stCode.slice(1) : doc.stCode;
  //     const res = await axios.get(
  //       'https://openapi.kric.go.kr/openapi/convenientInfo/stationTimetable?serviceKey=' +
  //       '%242a%2410%24ErLN7XdFCA0lOWjCWHpsYOl6l97Y%2FJd.jgAKsUvYYSS84Wcgs9FW6&format=json&railOprIsttCd=S1&' +
  //       `lnCd=${doc.code.slice(0, 1)}&stinCd=${code}&dayCd=8`
  //     );
  //     await subwayDB.collection('seoulTimeline').insertOne({
  //       code : doc.code,
  //       timeline : res.data.body,
  //     });
  //   }
  // });
