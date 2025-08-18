import { Elysia } from 'elysia';
import pino from 'pino';
import pretty from 'pino-pretty';
import { nanoid } from 'nanoid';

export const logger = pino(pretty())

export const globalLogger = new Elysia()
  .derive({ as: "global" }, () => ({ start: Date.now(), requestId: nanoid() }))
  .onBeforeHandle({ as: "global" }, (ctx) => {
    logger.info({
      requestId: ctx.requestId,
      method: ctx.request.method,
      path: ctx.path,
      query: ctx.query,
      body: ctx.body,
      params: ctx.params,
    });
  })
  .onAfterHandle({ as: "global" }, (ctx) => {
    logger.info({
      requestId: ctx.requestId,
      method: ctx.request.method,
      path: ctx.path,
      query: ctx.query,
      body: ctx.body,
      params: ctx.params,
      status: ctx.set.status ?? Number.NaN,
      "duration": Date.now() - ctx.start,
    });
  })
  .onError({ as: "global" }, (ctx) => {
    logger.info({
      requestId: ctx.requestId,
      method: ctx.request.method,
      path: ctx.path,
      query: ctx.query,
      body: ctx.body,
      status: ctx.set.status,
      "duration": ctx.start ? Date.now() - ctx.start : Number.NaN,
    });
  })