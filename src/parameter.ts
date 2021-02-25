import { ISchema, toJoi, toSwagger } from './ischema';
import { registerMethod, registerMiddleware } from './utils';
import { HTTPStatusCodes, IPath, Tags } from './index';
import { Request, Response } from 'express';
import * as joi from 'joi';
import * as _ from 'lodash';

const PARAMETERS: Map<
  Function,
  Map<string, Map<string, IParameter>>
> = new Map();

export interface IParameter {
  in: ENUM_PARAM_IN;
  schema: joi.Schema | ISchema;
}

export enum ENUM_PARAM_IN {
  query,
  body,
  header,
  path,
  formData
}

export const parameter = (
  name: string,
  schema?: ISchema | joi.Schema,
  paramIn?: ENUM_PARAM_IN
): MethodDecorator => (target: {}, key: string): void => {
  if (!paramIn) {
    paramIn = ENUM_PARAM_IN.query;
  }
  if (!PARAMETERS.has(target.constructor)) {
    PARAMETERS.set(target.constructor, new Map());
  }
  if (!PARAMETERS.get(target.constructor).has(key)) {
    PARAMETERS.get(target.constructor).set(key, new Map());
  }
  registerMethod(target, key, (router: IPath) => {
    if (!router.parameters) {
      router.parameters = [];
    }
    schema = toSwagger(schema);
    let description = '';
    if (schema['description']) {
      description = schema['description'];
      delete schema['description'];
    }
    router.parameters.push(
      Object.assign(
        {
          description,
          in: ENUM_PARAM_IN[paramIn],
          name
        },
        { required: paramIn === ENUM_PARAM_IN.path && true },
        ENUM_PARAM_IN.body === paramIn ? { schema } : schema
      )
    );
  });

  registerMiddleware(
    target,
    key,
    async (req: Request, res: Response, next: Function) => {
      const schemas = PARAMETERS.get(target.constructor).get(key);
      const tempSchema = { params: {}, body: {}, query: {}, formData: {} };
      let body = req.body;
      for (const [schemaName, schemaObject] of schemas) {
        switch (schemaObject.in) {
          case ENUM_PARAM_IN.query:
            tempSchema.query[schemaName] = schemaObject.schema;
            break;
          case ENUM_PARAM_IN.path:
            tempSchema.params[schemaName] = schemaObject.schema;
            break;
          case ENUM_PARAM_IN.body:
            tempSchema.body = schemaObject.schema;
            break;
          case ENUM_PARAM_IN.formData:
            tempSchema.formData[schemaName] = schemaObject.schema;
            if (req.params && req.params[schemaName]) {
              body = Object.assign(body, {
                [schemaName]: req.params[schemaName]
              });
            }
            break;
        }
      }

      let formData = {};
      if (req.is(['multipart/form-data'])) {
        formData = body;
        body = {};
      }
      const { error, value } = joi.validate(
        {
          body,
          formData,
          params: req.params,
          query: req.query
        },
        tempSchema
      );
      if (error) {
        return res.status(_.toNumber(HTTPStatusCodes.badRequest)).json(
          JSON.stringify({
            code: HTTPStatusCodes.badRequest,
            message: error.message
          })
        );
      }
      req.params = value.params;
      req.body =
        (req.is(['multipart/form-data']) && value.formData) || value.body;
      req.query = value.query;
      return await next();
    }
  );

  PARAMETERS.get(target.constructor)
    .get(key)
    .set(name, { in: paramIn, schema: toJoi(schema) });
  target[Tags.tagParameter] = target.constructor[
    Tags.tagParameter
  ] = PARAMETERS.get(target.constructor);
};
