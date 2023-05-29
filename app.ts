import dotenv from 'dotenv';
import path from 'path';

// NODE_ENV 에 맞게 env 파일 설정.
if (process.env.NODE_ENV === 'production') {
  console.log(process.env.NODE_ENV);
  dotenv.config({ path : path.join(__dirname, '/.env.production') });
} else if (process.env.NODE_ENV === 'development') {
  console.log(process.env.NODE_ENV);
  dotenv.config({ path : path.join(__dirname, '/.env.local') });
} else {
  console.error('Not defined process.env.NODE_ENV');
  throw new Error('Not defined process.env.NODE_ENV');
}

import Koa from 'koa';
import MongodbConnect from './src/config/mongodb.config';
import { koaBody } from 'koa-body';
import { allRouter } from './src/routes';

const app = new Koa();

// mongodb connection.
(async () => await MongodbConnect())();

app.use(koaBody());

app.use(allRouter.routes()).use(allRouter.prefix('/').allowedMethods());

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
