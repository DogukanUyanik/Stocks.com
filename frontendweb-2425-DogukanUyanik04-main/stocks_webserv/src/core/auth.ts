// src/core/auth.ts
import type { Next } from 'koa'; // 👈 1
import type { KoaContext } from '../types/koa'; // 👈 1
import * as userService from '../service/gebruiker'; // 👈 1

import config from 'config';
const AUTH_MAX_DELAY = config.get<number>('auth.maxDelay');


// 👇 1
export const requireAuthentication = async (ctx: KoaContext, next: Next) => {
  const { authorization } = ctx.headers; // 👈 3

  //  👇 4
  ctx.state.session = await userService.checkAndParseSession(authorization);

  return next(); // 👈 5
};

// 👇 6
export const makeRequireRole =
  (role: string) => async (ctx: KoaContext, next: Next) => {
    const { roles = [] } = ctx.state.session; // 👈 7

    userService.checkRole(role, roles); // 👈 8

    return next(); // 👈 9
  };


// 👇 2
export const authDelay = async (_: KoaContext, next: Next) => {
  // 👇 3
  await new Promise((resolve) => {
    const delay = Math.round(Math.random() * AUTH_MAX_DELAY);
    setTimeout(resolve, delay);
  });
  // 👇 4
  return next();
};
