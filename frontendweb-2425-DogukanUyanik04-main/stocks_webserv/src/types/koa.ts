import type { ParameterizedContext } from 'koa';
import type Application from 'koa';
import type Router from '@koa/router';
import { SessionInfo } from './auth';

export interface StockAppState {
  session: SessionInfo
}

export interface StockAppContext<
  Params = unknown,
  RequestBody = unknown,
  Query = unknown,
> {
  request: {
    body: RequestBody;
    query: Query;
  };
  params: Params;
}

export type KoaContext<
  ResponseBody = unknown,
  Params = unknown, 
  RequestBody = unknown,
  Query = unknown,
> = ParameterizedContext<
  StockAppState,
  StockAppContext<Params, RequestBody, Query>,
  ResponseBody
>;

export interface KoaApplication
  extends Application<StockAppState, StockAppContext> {}

export interface KoaRouter extends Router<StockAppState, StockAppContext> {}
