import Router from "@koa/router";
import * as aandeelService from '../service/aandelen';
import { KoaContext, KoaRouter, StockAppContext, StockAppState } from "../types/koa";
import Joi from "joi";

import type {
  GetAllAandeelResponse,
  GetAandeelByIdResponse,
  GetAandeelByNameResponse
} from '../types/aandeel'

import { IdParams } from "../types/common";
import { NameParams } from "../types/common";
import validate from "../core/validation";

/**
 * @swagger
 * tags:
 *   name: Aandelen
 *   description: Endpoints for managing aandelen (stocks)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Aandeel:
 *       type: object
 *       required:
 *         - id
 *         - naam
 *         - afkorting
 *         - prijs
 *         - marktId
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         naam:
 *           type: string
 *           example: "Tech Corp"
 *         afkorting:
 *           type: string
 *           example: "TCH"
 *         prijs:
 *           type: number
 *           format: float
 *           example: 120.5
 *         marktId:
 *           type: integer
 *           example: 1
 *     AandelenList:
 *       type: object
 *       required:
 *         - items
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Aandeel"
 *       example:
 *         items:
 *           - id: 1
 *             naam: "Tech Corp"
 *             afkorting: "TCH"
 *             prijs: 120.5
 *             marktId: 1
 *           - id: 2
 *             naam: "Finance Inc"
 *             afkorting: "FIN"
 *             prijs: 80.25
 *             marktId: 1
 */



/**
 * @swagger
 * /api/aandelen:
 *   get:
 *     summary: Get all aandelen
 *     tags:
 *       - Aandelen
 *     responses:
 *       200:
 *         description: List of all aandelen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AandelenList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 */
const getAllAandelen = async (ctx: KoaContext<GetAllAandeelResponse> ) => {
  const aandelen = await aandeelService.getAll();
  ctx.status = 200;
  ctx.body = {
    items: aandelen,
  };
};
getAllAandelen.validationScheme = null;

/**
 * @swagger
 * /api/aandelen/{id}:
 *   get:
 *     summary: Get an aandeel by ID
 *     tags:
 *       - Aandelen
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the aandeel
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: A single aandeel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Aandeel"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const getAandeelById = async (ctx: KoaContext<GetAandeelByIdResponse, IdParams>) => {
  const {id} = ctx.params;
  const aandeel = await aandeelService.getById(Number(id));
  ctx.status = 200;
  ctx.body = aandeel;
};
getAandeelById.validationScheme = {
  params: {
    id: Joi.number().integer().positive().required(), 
  },
};


/**
 * @swagger
 * /api/aandelen/name/{name}:
 *   get:
 *     summary: Get aandelen by name
 *     tags:
 *       - Aandelen
 *     parameters:
 *       - name: name
 *         in: path
 *         required: true
 *         description: Name of the aandeel
 *         schema:
 *           type: string
 *           example: "Apple"
 *     responses:
 *       200:
 *         description: List of aandelen matching the name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AandelenList"
 *       400:
 *         $ref: '#/components/responses/400BadRequest'
 *       404:
 *         $ref: '#/components/responses/404NotFound'
 */
const getAandeelByName = async (ctx: KoaContext<GetAandeelByNameResponse, NameParams>) => {
  const { name } = ctx.params;
  const aandelen = await aandeelService.getByName(name);
  ctx.status = 200;
  ctx.body = {
    items: aandelen,
  };
};
getAandeelByName.validationScheme = {
  params: {
    name: Joi.string().min(1).required(), 
  },
};




export default (parent: KoaRouter) => {
  const router = new Router<StockAppState, StockAppContext>({
    prefix: '/aandelen',
  });


  
  router.get(
    '/',
    validate(getAllAandelen.validationScheme),
     getAllAandelen,
    );


  router.get(
    '/:id',
    validate(getAandeelById.validationScheme),
     getAandeelById,
    );


  router.get(
    '/name/:name',
    validate(getAandeelByName.validationScheme),
     getAandeelByName,
    );
  
  parent.use(router.routes()).use(router.allowedMethods());
}
