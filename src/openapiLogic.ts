import axios from 'axios';

const { OPENAPI_ROUTE, OPENAPI_DISTANCE } = process.env;

export async function getTrainDistances (line: string, stationCode: string, wayCode: number) {
  const response = await axios.get(`${OPENAPI_DISTANCE}&lnCd=${line}&stinCd=${stationCode}&plfNo=${wayCode}`);

  if (response.data.header.resultCode === '03') {
    return;
  }

  const list = response.data.body;
  list.sort((a: any, b: any) => a.sfDst - b.sfDst);
}

export async function getTotalMovement (stCode: string, endCode: string) {
  const response = await axios.get(`${OPENAPI_ROUTE}&SID=${stCode}&EID=${endCode}`);

  return {
    driveInfo : response.data.result.driveInfoSet.driveInfo,
  };
}