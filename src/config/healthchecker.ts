import { Context, Next } from 'koa';
import Router from '@koa/router';

const router = new Router();

export const healthRouter = router.get('/', async (ctx: Context, next: Next) => {
  ctx.status = 200;
  ctx.response.body = 'Ok.';
  await next();
});