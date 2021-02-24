import { ISchema, toJoi, toSwagger } from './ischema';
import { registerMethod, registerMiddleware } from './utils';
import { HTTPStatusCodes, IPath, Tags } from './index';
import { Request, Response } from 'express';
import * as joi from 'joi';
import * as _ from 'lodash';

const RESPONSES: Map<
  Function,
  Map<string, Map<number, ISchema | joi.Schema>>
> = new Map();

export const DEFAULT_RESPONSE: joi.Schema = joi.string().default('');

export const response = (
  code: number,
  schema?: ISchema | joi.Schema
): MethodDecorator => (target: {}, key: string): void => {
  if (!schema) {
    schema = DEFAULT_RESPONSE;
  }
  if (!RESPONSES.has(target.constructor)) {
    RESPONSES.set(target.constructor, new Map());
  }
  if (!RESPONSES.get(target.constructor).has(key)) {
    RESPONSES.get(target.constructor).set(key, new Map());
  }
  registerMethod(target, key, (router: IPath): void => {
    if (!router.responses) {
      router.responses = {};
    }
    schema = toSwagger(schema);
    let description = '';
    if (schema['description']) {
      description = schema['description'];
      delete schema['description'];
    }
    router.responses[code] = Object.assign({ description }, { schema });
  });

  registerMiddleware(
    target,
    key,
    async (ctx: Request, res: Response, next: Function): Promise<void> => {
      await next();
      if (RESPONSES.get(target.constructor).get(key).has(res.statusCode)) {
        const { error, value } = joi.validate(
          ctx.body,
          RESPONSES.get(target.constructor).get(key).get(res.statusCode)
        );
        if (error) {
          // ctx.body = {
          // code: HTTPStatusCodes.internalServerError,
          // message: error.message
          // };
          res.send({
            code: HTTPStatusCodes.internalServerError,
            message: error.message
          });
          // res.status = HTTPStatusCodes.internalServerError;
          res.status(_.toNumber(HTTPStatusCodes.internalServerError)).end();
          return;
        }
        // ctx.body = value;
        res.send(value);
      }
    }
  );

  RESPONSES.get(target.constructor).get(key).set(code, toJoi(schema));
  target[Tags.tagResponse] = target.constructor[
    Tags.tagResponse
  ] = RESPONSES.get(target.constructor);
};
