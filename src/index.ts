import * as _ from 'lodash';
import { Router } from 'express';
const koaSwagger = require('koa2-swagger-ui');

export * from './controller';

export * from './definition';

export * from './description';

export * from './ischema';

export * from './method';

export * from './parameter';

export * from './resolvers';

export * from './response';

export * from './summary';

export * from './tag';

export interface ISwagger {
  swagger: string;
  info: {
    description?: string;
    version: string;
    title: string;
    termsOfService?: string;
    concat?: {
      email: string;
    };
    license?: {
      name: string;
      url: string;
    };
  };
  host?: string;
  basePath?: string;
  tags?: Array<{
    name: string;
    description?: string;
    externalDocs?: {
      description: string;
      url: string;
    };
  }>;
  schemes: string[];
  paths: {};
  definitions: {};
  /**
   * Define security definitions list.
   * Optional.
   */
  securityDefinitions?: {
    [key: string]: ISwaggerSecurityDefinition;
  };
}

export interface IPath {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  consumes: string[];
  produces: string[];
  parameters?: Array<{}>;
  responses: {};
  security: Array<{}>;
}

export const DEFAULT_SWAGGER: ISwagger = {
  basePath: '/v1/api',
  definitions: {},
  host: 'localhost:3002',
  info: {
    title: 'Koa-Joi-Swagger-TS server',
    version: '1.0.0'
  },
  paths: {},
  schemes: ['http'],
  swagger: '2.0',
  securityDefinitions: {
    JWT: {
      type: 'apiKey',
      in: 'header',
      name: 'Authorization'
      // description: ''
    }
  }
};

export enum HTTPStatusCodes {
  success = 200,
  internalServerError = 500,
  created = 201,
  other = 303,
  badRequest = 400
}

export enum Tags {
  tagController = 'Controller',
  tagDefinitionDescription = 'DefinitionDescription',
  tagDefinitionName = 'DefinitionName',
  tagDescription = 'Description',
  tagGlobalMethod = 'GlobalMethod',
  tagMethod = 'Method',
  tagMiddleMethod = 'MiddleMethod',
  tagMiddleWare = 'MiddleWare',
  tagParameter = 'Parameter',
  tagResponse = 'Response',
  tagSummary = 'Summary',
  tagTag = 'Tag'
}

export interface ISwaggerSecurityDefinition {
  /**
   * Define type of security.
   */
  type: string;
  /**
   * Define where security set.
   * Optional.
   */
  in?: string;
  /**
   * Define name of security.
   * Optional.
   */
  name?: string;
}

export const DEFAULT_PATH: IPath = {
  consumes: [
    'application/json',
    'multipart/form-data',
    'application/x-www-form-urlencoded'
  ],
  description: '',
  operationId: undefined,
  produces: [
    'application/json',
    'multipart/form-data',
    'application/x-www-form-urlencoded'
  ],
  responses: { [HTTPStatusCodes.success]: { description: 'Success' } },
  security: [],
  summary: '',
  tags: []
};

const FIRST_SCHEMA = 0;

export class KJSRouter {
  private readonly _swagger: ISwagger;

  public _router: Router = Router();

  private _swaggerFileName: string;

  constructor(swagger: ISwagger = DEFAULT_SWAGGER) {
    this._swagger = swagger;
  }

  public loadController(Controller: any, decorator: Function = null): void {
    if (Controller[Tags.tagController]) {
      const allMethods = Controller[Tags.tagMethod] || new Map();
      const paths = [...allMethods.keys()];
      const middleMethods = Controller[Tags.tagMiddleMethod] || new Map();
      const middleWares = Controller[Tags.tagMiddleWare] || new Map();
      paths.forEach((path) => {
        const temp = {};
        const fullPath = (Controller[Tags.tagController] + path).replace(
          this._swagger.basePath,
          ''
        );
        const methods = allMethods.get(path);
        for (const [k, v] of methods) {
          const router = _.cloneDeep(DEFAULT_PATH);
          const mMethods = middleMethods.get(v.key);
          const wares = middleWares.has(v.key)
            ? [...middleWares.get(v.key)]
            : [];
          if (mMethods) {
            for (let i = 0, len = mMethods.length; i < len; i++) {
              mMethods[i](router, this._swagger);
            }
          }
          temp[k] = router;
          if (this._router[k]) {
            this._router[k](
              (Controller[Tags.tagController] + path).replace(
                /{(\w+)}/g,
                ':$1'
              ),
              ...wares.concat(
                decorator
                  ? async (ctx, next) => {
                      await decorator(v.handle, ctx, next, router.summary);
                    }
                  : v.handle
              )
            );
          }
        }
        this._swagger.paths[fullPath] = temp;
      });
    }
  }

  public loadDefinition(Definition: any | []): void {
    const processDefinition = (definition: any) => {
      if (definition[Tags.tagDefinitionName]) {
        const globalMethods = definition[Tags.tagGlobalMethod] || [];
        globalMethods.forEach((deal) => {
          deal(this._swagger);
        });
      }
    };

    if (Array.isArray(Definition)) {
      Definition.forEach((item) => {
        processDefinition(item);
      });
    } else {
      processDefinition(Definition);
    }
  }

  public setSwaggerFile(fileName: string): void {
    this._swaggerFileName = this._swagger.basePath + '/' + fileName;
    this._router.get(this._swaggerFileName, (ctx, next) => {
      ctx.body = JSON.stringify(this._swagger);
    });
  }

  public getSwaggerFile(): string {
    return this._swaggerFileName;
  }

  public loadSwaggerUI(url: string): void {
    this._router.get(
      url,
      koaSwagger({
        routePrefix: false,
        swaggerOptions: {
          url: this._swaggerFileName
        }
      })
    );
    // const swaggerDocument = require(this.getSwaggerFile());
    // this._router.use(
    //   url,
    //   swaggerUi.serve,
    //   swaggerUi.setup(swaggerDocument, {
    //     swaggerOptions: {
    //       url: this._swaggerFileName
    //     }
    //   })
    // );
  }

  public getRouter(): Router {
    return this._router;
  }
}
