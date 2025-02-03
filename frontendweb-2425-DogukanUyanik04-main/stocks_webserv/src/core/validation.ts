// src/core/validation.ts
import type { Schema, SchemaLike } from 'joi'; // 👈 10
import Joi from 'joi'; // 👈 1
import type { KoaContext } from '../types/koa'; // 👈 4
import type { Next } from 'koa'; // 👈 4

// 👇 8
const JOI_OPTIONS: Joi.ValidationOptions = {
  abortEarly: true, // stop when first error occured
  allowUnknown: false, // disallow unknown fields
  convert: true, // convert values to their types (number, Date, ...)
  presence: 'required', // default require all fields
};

// 👇 10
type RequestValidationSchemeInput = Partial<
  Record<'params' | 'body' | 'query', SchemaLike>
>;
type RequestValidationScheme = Record<'params' | 'body' | 'query', Schema>;


const cleanupJoiError = (error: Joi.ValidationError) => {
  const errorDetails = error.details.reduce(
    (resultObj, { message, path, type }) => {
      const joinedPath = path.join('.') || 'value';
      if (!resultObj.has(joinedPath)) {
        resultObj.set(joinedPath, []);
      }

      resultObj.get(joinedPath).push({
        type,
        message,
      });

      return resultObj;
    },
    new Map(),
  );

  return Object.fromEntries(errorDetails);
};

// 👇 2
// code om createGebruiker te kunnen laten werken want het wou maar niet valideren
const validate = <
  ParamsType = unknown,
  BodyType = unknown,
  QueryType = unknown
>(
  scheme: RequestValidationSchemeInput | null
) => {
  const parsedSchema: RequestValidationScheme = {
    body: Joi.object(scheme?.body || {}),
    params: Joi.object(scheme?.params || {}),
    query: Joi.object(scheme?.query || {}),
  };

  return async (ctx: KoaContext<ParamsType, BodyType, QueryType>, next: Next) => {
    const errors = new Map();

    const { error: paramsErrors, value: paramsValue } = parsedSchema.params.validate(ctx.params, JOI_OPTIONS);
    if (paramsErrors) {
      errors.set('params', cleanupJoiError(paramsErrors));
    } else {
      ctx.params = paramsValue;
    }

    const { error: bodyErrors, value: bodyValue } = parsedSchema.body.validate(ctx.request.body, JOI_OPTIONS);
    if (bodyErrors) {
      errors.set('body', cleanupJoiError(bodyErrors));
    } else {
      ctx.request.body = bodyValue;
    }

    const { error: queryErrors, value: queryValue } = parsedSchema.query.validate(ctx.query, JOI_OPTIONS);
    if (queryErrors) {
      errors.set('query', cleanupJoiError(queryErrors));
    } else {
      ctx.query = queryValue;
    }

    if (errors.size > 0) {
      ctx.throw(400, 'Validation failed, check details for more information', {
        code: 'VALIDATION_FAILED',
        details: Object.fromEntries(errors),
      });
    }

    await next();
  };
};


export default validate; // 👈 2
