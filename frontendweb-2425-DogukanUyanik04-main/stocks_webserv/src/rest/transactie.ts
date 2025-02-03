import Router from '@koa/router';
import * as transactieService from '../service/transactie';
import { KoaContext, KoaRouter, StockAppContext, StockAppState } from '../types/koa';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import type {
  CreateTransactieRequest,
  CreateTransactieResponse,
  GetAllTransactieResponse,
  GetTransactieByIdResponse,
} from '../types/transactie';
import validate from '../core/validation';
import { requireAuthentication } from '../core/auth';

/**
 * @swagger
 * tags:
 *   name: Transacties
 *   description: Operations related to stock transactions (buy and sell)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transactie:
 *       type: object
 *       required:
 *         - aandeelId
 *         - hoeveelheid
 *         - soorttransactie
 *         - gebruikerId
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         aandeelId:
 *           type: integer
 *           description: ID of the stock
 *           example: 101
 *         hoeveelheid:
 *           type: integer
 *           description: Quantity of stocks
 *           example: 10
 *         soorttransactie:
 *           type: string
 *           enum: [buy, sell]
 *           description: Type of transaction
 *           example: buy
 *         gebruikerId:
 *           type: integer
 *           description: ID of the user initiating the transaction
 *           example: 5
 *     TransactieList:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Transactie"
 *
 *   requestBodies:
 *     CreateTransactie:
 *       description: The transaction details for buy or sell
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               aandeelId:
 *                 type: integer
 *                 example: 1
 *               hoeveelheid:
 *                 type: integer
 *                 example: 5
 *               gebruikerId:
 *                 type: integer
 *                 example: 5
 */

/**
 * @swagger
 * /api/transacties:
 *   get:
 *     summary: Retrieve all transactions for the logged-in user
 *     tags:
 *       - Transacties
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of transactions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TransactieList"
 *       401:
 *         description: Unauthorized access
 */
const getAllTransacties = async (ctx: KoaContext<GetAllTransactieResponse>) => {
  ctx.body = {
    items: await transactieService.getAllTransacties(
      ctx.state.session.userId,
      ctx.state.session.roles,
    ),
  };
};
getAllTransacties.validationScheme = null;

/**
 * @swagger
 * /api/transacties/{id}:
 *   get:
 *     summary: Retrieve a specific transaction by ID
 *     tags:
 *       - Transacties
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the transaction
 *     responses:
 *       200:
 *         description: The requested transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Transactie"
 *       404:
 *         description: Transaction not found
 *       401:
 *         description: Unauthorized access
 */
const getTransactieById = async (ctx: KoaContext<GetTransactieByIdResponse, IdParams>) => {
  ctx.body = await transactieService.getTransactieById(
    ctx.params.id,
    ctx.state.session.userId,
    ctx.state.session.roles,
  );
};
getTransactieById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * @swagger
 * /api/transacties/buy:
 *   post:
 *     summary: Create a 'buy' transaction
 *     tags:
 *       - Transacties
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateTransactie"
 *     responses:
 *       201:
 *         description: The created 'buy' transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Transactie"
 *       400:
 *         description: Bad request (validation failed)
 *       401:
 *         description: Unauthorized access
 */
const buyTransaction = async (ctx: KoaContext<CreateTransactieResponse, IdParams, CreateTransactieRequest>) => {
  const { aandeelId, hoeveelheid } = ctx.request.body;
  const gebruikerId = ctx.state.session.userId || ctx.request.body.gebruikerId;
  const transactieData = {
    gebruikerId,
    aandeelId,
    hoeveelheid,
    soorttransactie: 'buy',
  };
  const nieuwTransactie = await transactieService.buyTransaction(transactieData);
  ctx.status = 201;
  ctx.body = nieuwTransactie;
};
buyTransaction.validationScheme = {
  body: {
    aandeelId: Joi.number().integer().positive().required(),
    hoeveelheid: Joi.number().integer().positive().required(),
    gebruikerId: Joi.number().integer().optional(),
  },
};

/**
 * @swagger
 * /api/transacties/sell:
 *   post:
 *     summary: Create a 'sell' transaction
 *     tags:
 *       - Transacties
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       $ref: "#/components/requestBodies/CreateTransactie"
 *     responses:
 *       201:
 *         description: The created 'sell' transaction
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Transactie"
 *       400:
 *         description: Bad request (validation failed)
 *       401:
 *         description: Unauthorized access
 */
const sellTransaction = async (ctx: KoaContext<CreateTransactieResponse, IdParams, CreateTransactieRequest>) => {
  const { aandeelId, hoeveelheid } = ctx.request.body;
  const gebruikerId = ctx.state.session.userId;
  const transactieData = {
    gebruikerId,
    aandeelId,
    hoeveelheid,
    soorttransactie: 'sell',
  };
  const nieuwTransactie = await transactieService.sellTransaction(transactieData);
  ctx.status = 201;
  ctx.body = nieuwTransactie;
};
sellTransaction.validationScheme = {
  body: {
    aandeelId: Joi.number().integer().positive().required(),
    hoeveelheid: Joi.number().integer().positive().required(),
    gebruikerId: Joi.number().integer().positive().required(),
  },
};

export default (parent: KoaRouter) => {
  const router = new Router<StockAppState, StockAppContext>({
    prefix: '/transacties',
  });

  router.use(requireAuthentication);

  router.get('/', validate(getAllTransacties.validationScheme), getAllTransacties);
  router.get('/:id', validate(getTransactieById.validationScheme), getTransactieById);
  router.post('/buy', validate(buyTransaction.validationScheme), buyTransaction);
  router.post('/sell', validate(sellTransaction.validationScheme), sellTransaction);

  parent.use(router.routes()).use(router.allowedMethods());
};
