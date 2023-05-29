import { ObjectId } from 'bson';

export interface Station {
  _id: ObjectId;
  stationName: string;
  line: string;
  globalName: {
    jpn: string;
    eng: string;
    chn: string;
  };
  stationCode: string;
  foreignCode: string;
}