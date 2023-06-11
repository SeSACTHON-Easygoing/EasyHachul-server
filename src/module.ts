import { subwayDB } from './config/mongodb.config';

export async function getStationInfo () {
  return await subwayDB.collection('stations').find().toArray();
}

export async function searchStationName (query: string) {
  return subwayDB.collection('seoulOp').aggregate([
    {
      '$search' : {
        'index' : 'stNm',
        'autocomplete' : {
          'query' : query,
          'path' : 'stNm',
          'fuzzy': {
            'maxEdits': 1,
          },
        },
      },
    },
    {
      '$project' : {
        '_id' : 1,
        'stNm' : 1,
        'line' : 1,
        'code': 1,
        'tel': 1,
        'stCode': 1,
      },
    },
  ]);
}