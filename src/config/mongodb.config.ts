import { MongoClient } from 'mongodb';

const { MONGODB_URI } = process.env;

const client = new MongoClient(`${MONGODB_URI}`);

export default async function mongodbRun () {
  try {
    await client.connect();
    console.log('mongodb  Connected.');
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.stack);
    }
  }
}

export const subwayDB = client.db('subway');