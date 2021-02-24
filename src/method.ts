import { Tags } from './index';

export interface IMethod {
  key: string;
  handle: Function;
}

/**
 *  If it is a class method annotation,
 *  typescript is implemented by prototype,
 *  btw,
 *  class User extends BaseController {
 *      @get("/")
 *      index(){
 *
 *      }
 *  }
 *
 *  will cause the parent controller annotation pollution
 */

/**
 * Prevent inheritance pollution
 * @template map of methods {Map<any, any>}
 */
const METHODS: Map<Function, Map<string, Map<string, IMethod>>> = new Map();

/**
 * Method
 * @param methodString decorated method
 * @param path relative path
 * @returns filled METHODS map {(target:Object, key:string)=>undefined}
 */
export const method = (
  methodString?: string,
  path?: string
): MethodDecorator => (target: {}, key: string): void => {
  if (!METHODS.has(target.constructor)) {
    METHODS.set(target.constructor, new Map());
  }
  if (!METHODS.get(target.constructor).has(path)) {
    METHODS.get(target.constructor).set(path, new Map());
  }
  METHODS.get(target.constructor)
    .get(path)
    .set(methodString, { key, handle: target[key] });
  target[Tags.tagMethod] = target.constructor[Tags.tagMethod] = METHODS.get(
    target.constructor
  );
};

export const get = (path?: string) => method('get', path);
export const put = (path?: string) => method('put', path);
export const del = (path?: string) => method('delete', path);
export const post = (path?: string) => method('post', path);
export const patch = (path?: string) => method('patch', path);
