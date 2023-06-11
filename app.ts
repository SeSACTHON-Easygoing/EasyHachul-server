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

import Koa, { Context, Next } from 'koa';
import cors from '@koa/cors';
import MongodbConnect from './src/config/mongodb.config';
import { koaBody } from 'koa-body';
import { allRouter } from './src/routes';
import { healthRouter } from './src/config/healthchecker';

const app = new Koa();

// mongodb connection.
(async () => await MongodbConnect())();

app.use(cors());

app.use(koaBody());
app.use(async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof Error) {
      ctx.status = 200;
      ctx.response.body = {
        result : {
          success : false,
          message : err.message,
        },
        data : {},
      };
      ctx.app.emit('error', err, ctx);
    }
  }
});

app.use(healthRouter.routes()).use(healthRouter.allowedMethods());
app.use(allRouter.routes()).use(allRouter.prefix('/api/subway').allowedMethods());

app.on('error', (err: any, ctx: Context) => {
  console.log(ctx.request.path);
  console.error(err);
});

app.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
