// src/rest/session.ts
import Router from '@koa/router';
import Joi from 'joi';
import validate from '../core/validation';
import * as userService from '../service/gebruiker';
import type {
  KoaContext,
  KoaRouter,
  StockAppState,
  StockAppContext,
} from '../types/koa';
import type { LoginResponse, LoginRequest } from '../types/gebruiker';
import { authDelay } from '../core/auth';


/**
 * @swagger
 * tags:
 *   name: Sessions
 *   description: User session management
 */

/**
 * @swagger
 * /api/sessions:
 *   post:
 *     summary: Try to login
 *     tags:
 *      - Sessions
 *     requestBody:
 *       description: The credentials of the user to login
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com  # Example email for Swagger UI
 *               wachtwoord:
 *                 type: string
 *                 example: 12345678           # Example password for Swagger UI
 *     responses:
 *       200:
 *         description: A JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       401:
 *         $ref: '#/components/responses/401Unauthorized'
 */


const login = async (ctx: KoaContext<LoginResponse, void, LoginRequest>) => {
  const { email, wachtwoord } = ctx.request.body;
  const gebruiker = await userService.login(email, wachtwoord);  

  ctx.status = 200;
  ctx.body = {
    token: gebruiker.token,
    user: {
      id: gebruiker.id,
    },
  };
};
login.validationScheme = {
  body: {
    email: Joi.string().email().required(),
    wachtwoord: Joi.string().required(),
  },
};


export default function installSessionRouter(parent: KoaRouter) {
  const router = new Router<StockAppState, StockAppContext>({
    prefix: '/sessions',
  });

  router.post(
    '/',
    authDelay,
     validate(login.validationScheme), 
     login,
    );

  parent.use(router.routes()).use(router.allowedMethods());
}


