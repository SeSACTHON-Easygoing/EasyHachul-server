import { subwayDB } from './config/mongodb.config';

export async function getStationInfo () {
  return await subwayDB.collection('stations').find().toArray();
}

export async function searchStationName (query: string) {
  return subwayDB.collection('stations').aggregate([
    {
      '$search' : {
        'index' : 'searchStation',
        'text' : {
          'query' : query,
          'path' : {
            'wildcard' : '*',
          },
          'fuzzy': {
            'maxEdits': 1,
            'prefixLength' : 1,
          },
        },
      },
    },
    {
      '$limit' : 5,
    },
    {
      '$project' : {
        '_id' : 1,
        'stationName' : 1,
        'line' : 1,
      },
    },
  ]);
}