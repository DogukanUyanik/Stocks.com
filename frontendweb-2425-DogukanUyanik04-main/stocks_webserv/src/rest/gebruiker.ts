import Router from '@koa/router';
import * as gebruikerService from '../service/gebruiker';
import * as transactieService from '../service/transactie';
import type { IdParams } from '../types/common';
import Joi from 'joi';
import type {
  RegisterGebruikerRequest,
  RegisterGebruikerResponse,
  GetAllGebruikerResponse,
  GetGebruikerByIdResponse,
  UpdateGebruikerRequest,
  UpdateGebruikerResponse,
  GetGebruikerRequest
} from '../types/gebruiker';
import { KoaContext, KoaRouter, StockAppContext, StockAppState } from '../types/koa';
import validate from '../core/validation';
import { requireAuthentication, makeRequireRole, authDelay } from '../core/auth';
import Role from '../core/roles';
import type { Next } from 'koa';


/**
 * @swagger
 * tags:
 *   name: Gebruikers
 *   description: Represents users (gebruikers) in the system
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Gebruiker:
 *       type: object
 *       required:
 *         - naam
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *         naam:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         balance:
 *           type: number
 *       example:
 *         id: 1
 *         naam: "Jan Janssens"
 *         email: "jan.janssens@example.com"
 *         balance: 1200
 *     GebruikersList:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Gebruiker"
 */

const checkUserId = (ctx: KoaContext<unknown, GetGebruikerRequest>, next: Next) => {
  const { userId, roles } = ctx.state.session;
  const { id } = ctx.params;

  if (id !== 'me' && id !== userId && !roles.includes(Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      { code: 'FORBIDDEN' },
    );
  }
  return next();
}; 


/**
 * @swagger
 * /api/gebruikers:
 *   get:
 *     summary: Get all gebruikers
 *     description: Fetch all users (gebruikers), accessible only for admins
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all gebruikers
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GebruikersList"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden for non-admins
 */
const getAllGebruikers = async (ctx: KoaContext<GetAllGebruikerResponse>) => {
  const gebruikers = await gebruikerService.getAll();
  ctx.body = {
    items: gebruikers,
  };
};
getAllGebruikers.validationScheme = null;

/**
 * @swagger
 * /api/gebruikers:
 *   post:
 *     summary: Register a new gebruiker
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       description: User registration payload
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - naam
 *               - email
 *               - wachtwoord
 *             properties:
 *               naam:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               wachtwoord:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: The newly created gebruiker object
 *       400:
 *         description: Validation error
 */
const registerGebruiker = async (ctx: KoaContext<RegisterGebruikerResponse, void, RegisterGebruikerRequest>) => {
  const nieuwGebruiker = await gebruikerService.register(ctx.request.body);
  ctx.status = 200;
  ctx.body = nieuwGebruiker
};
registerGebruiker.validationScheme = {
  body: {
    naam: Joi.string().min(1).max(255).required(),
    email: Joi.string().email().required(),
    wachtwoord: Joi.string().min(8).required(),
  },
};



/**
 * @swagger
 * /api/gebruikers/{id}:
 *   get:
 *     summary: Get gebruiker by ID
 *     description: Fetch details of a gebruiker by ID. Use "me" to fetch your own details.
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the gebruiker or "me"
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Gebruiker details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Gebruiker"
 *       403:
 *         description: Forbidden if accessing other users' details
 *       404:
 *         description: Gebruiker not found
 */
const getById = async (ctx: KoaContext<GetGebruikerByIdResponse, GetGebruikerRequest>) => {
  const gebruiker = await gebruikerService.getById(ctx.params.id === "me" ? ctx.state.session.userId : ctx.params.id,);
  ctx.status = 200;
  ctx.body = gebruiker;
};
getById.validationScheme = {
  params: {
    id: Joi.alternatives().try(
      Joi.number().integer().positive(),
      Joi.string().valid('me'),
    ),
  },
};

/**
 * @swagger
 * /api/gebruikers/{id}/balance:
 *   get:
 *     summary: Get gebruiker balance
 *     description: Fetch the account balance of a gebruiker
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the gebruiker
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gebruiker balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 balance:
 *                   type: number
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gebruiker not found
 */
const getBalanceByIdRoute = async (
  ctx: KoaContext<{ balance: number }, IdParams>
) => {
  const { id } = ctx.params;
  const balance = await gebruikerService.getBalanceById(Number(id));
  ctx.body = { balance };
  ctx.status = 200;
};
getBalanceByIdRoute.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};

/**
 * @swagger
 * /api/gebruikers/{id}/transacties:
 *   get:
 *     summary: Get transactions by gebruiker ID
 *     description: Retrieve all transactions for a specific gebruiker
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Gebruiker ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 transacties:
 *                   type: array
 *                   items:
 *                     type: object
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gebruiker or transactions not found
 */
const getTransactieByGebruikerId = async (
  ctx: KoaContext<{ transacties: any[] }, IdParams>
) => {
  const { id } = ctx.params;
  const transacties = await gebruikerService.getTransactieByGebruikerId(Number(id));
  ctx.status = 200;
  ctx.body = { transacties };
};
getTransactieByGebruikerId.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};


/**
 * @swagger
 * /api/gebruikers/{id}/portfolio:
 *   get:
 *     summary: Get gebruiker portfolio
 *     description: Retrieve the portfolio (stocks held) of a specific gebruiker
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Gebruiker ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gebruiker portfolio
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 portfolio:
 *                   type: object
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gebruiker portfolio not found
 */
const getGebruikerPortfolio = async (
  ctx: KoaContext<{ portfolio: any }, IdParams>
) => {
  const { id } = ctx.params;
  const portfolio = await gebruikerService.getGebruikerPortfolio(Number(id));
  ctx.body = { portfolio };
  ctx.status = 200;
};
getGebruikerPortfolio.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(),
  },
};


/**
 * @swagger
 * /api/gebruikers/user/stocks:
 *   get:
 *     summary: Get user's stocks
 *     description: Retrieve the stocks owned by the currently authenticated gebruiker.
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of stocks owned by the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   aandeelId:
 *                     type: integer
 *                   hoeveelheid:
 *                     type: integer
 *                   totaalWaarde:
 *                     type: number
 *       401:
 *         description: Unauthorized - Missing or invalid authentication.
 */
const getUserStocks = async (ctx: KoaContext) => {
  const userId = ctx.state.session.userId; 
  const stocks = await transactieService.getUserStocks(userId); 
  ctx.body = stocks; 
};
getUserStocks.validationScheme = null;


/**
 * @swagger
 * /api/gebruikers/leaderboardpagina:
 *   get:
 *     summary: Get all gebruikers for leaderboard
 *     description: Retrieve public information of all gebruikers for leaderboard purposes. This endpoint does not require authentication.
 *     tags: [Gebruikers]
 *     responses:
 *       200:
 *         description: List of gebruikers for leaderboard.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/GebruikersList"
 */
const getAllGebruikersVoorLeaderboardGeenAuthenticatie = async (ctx: KoaContext<GetAllGebruikerResponse>) => {
  const gebruikers = await gebruikerService.getAllPublic();
  ctx.body = {
    items: gebruikers,
  };
};
getAllGebruikersVoorLeaderboardGeenAuthenticatie.validationScheme = null;


/**
 * @swagger
 * /api/gebruikers/{id}:
 *   put:
 *     summary: Update gebruiker by ID
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Gebruiker ID
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               naam:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Updated gebruiker object
 *       400:
 *         description: Validation error
 *       403:
 *         description: Forbidden
 */
const updateById = async (ctx: KoaContext<UpdateGebruikerResponse, IdParams, UpdateGebruikerRequest>) => {
  const id = Number(ctx.params.id);
  const data = ctx.request.body;
    const updatedGebruiker = await gebruikerService.updateById(id, data);
    ctx.status = 200;
    ctx.body = updatedGebruiker;
};
updateById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(), 
  },
  body: {
    naam: Joi.string().optional(), 
    email: Joi.string().email().optional(),
  }, 
};

/**
 * @swagger
 * /api/gebruikers/{id}:
 *   delete:
 *     summary: Delete gebruiker by ID
 *     tags: [Gebruikers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Gebruiker ID
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Gebruiker deleted successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Gebruiker not found
 */
const deleteById = async (ctx: KoaContext<void, IdParams>) => {
  const {id} = ctx.params;
  const deletedGebruiker = await gebruikerService.deleteById(Number(id));
  ctx.status = 200;
  ctx.body = deletedGebruiker;
};
deleteById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(), 
  },
};


export default (parent: KoaRouter) => {
  const router = new Router<StockAppState, StockAppContext>({
    prefix : '/gebruikers',
  });


  router.post(
    '/',
    authDelay,
    validate(registerGebruiker.validationScheme),
    registerGebruiker,
  );

  const requireAdmin = makeRequireRole(Role.ADMIN);



  //getAll enkel toegankelijk voor admins
  router.get(
    '/',
    requireAuthentication,
    requireAdmin,
    validate(getAllGebruikers.validationScheme),
     getAllGebruikers,
    );


    router.get(
      '/:id/balance',
      requireAuthentication,
      validate(getBalanceByIdRoute.validationScheme),
      checkUserId,
      getBalanceByIdRoute,
    );

    router.get(
      '/user/stocks',
      requireAuthentication,
      validate(getUserStocks.validationScheme),
       getUserStocks,
      ); 

   



  router.get(
    '/leaderboardpagina',
    getAllGebruikersVoorLeaderboardGeenAuthenticatie,
    validate(getAllGebruikersVoorLeaderboardGeenAuthenticatie.validationScheme)
  )

 


  router.get(
    '/:id',
    requireAuthentication,
    validate(getById.validationScheme),
    checkUserId,
    getById,
  );


  router.get(
    '/:id/transacties',
    requireAuthentication,
    validate(getTransactieByGebruikerId.validationScheme),
    checkUserId,
     getTransactieByGebruikerId,
    );


  router.get(
    '/:id/portfolio',
    requireAuthentication,
     validate(getGebruikerPortfolio.validationScheme),
     checkUserId,
     getGebruikerPortfolio);



  router.put(
    '/:id',
    requireAuthentication,
    validate(updateById.validationScheme),
    checkUserId,
     updateById,
    );


  router.delete(
    '/:id', 
    requireAuthentication,
    validate(deleteById.validationScheme),
    checkUserId,
    deleteById,
  );



  parent.use(router.routes()).use(router.allowedMethods());
};

