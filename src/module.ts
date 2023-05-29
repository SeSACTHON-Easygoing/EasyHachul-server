import { subwayDB } from './config/mongodb.config';

export async function getStationInfo () {
  return await subwayDB.collection('stations').find().toArray();
}