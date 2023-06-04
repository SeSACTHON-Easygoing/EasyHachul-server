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
  const query = ctx.query.query as string;

  let searchResult;
  const searchList: any = [];

  if (query!.length > 1 && query!.split('').pop() === '역') {
    const conv = query!.split('');
    conv.pop();
    const newQeury = conv!.join('');
    searchResult = await searchStationName(newQeury as string);

    await searchResult.forEach(doc => {
      if (doc.stationName.includes(newQeury)) {
        searchList.push(doc);
      }
    });
  } else {
    searchResult = await searchStationName(query as string);

    await searchResult.forEach(doc => {
      if (doc.stationName.includes(query)) {
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