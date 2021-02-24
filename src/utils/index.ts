import { Tags } from '../index';

const MIDDLE_METHODS: Map<Function, Map<string, Function[]>> = new Map();

const MIDDLE_WARES: Map<Function, Map<string, Set<Function>>> = new Map();

export const registerMethod = (
  target: {},
  key: string,
  deal: Function
): void => {
  if (!MIDDLE_METHODS.has(target.constructor)) {
    MIDDLE_METHODS.set(target.constructor, new Map());
  }
  if (!MIDDLE_METHODS.get(target.constructor).has(key)) {
    MIDDLE_METHODS.get(target.constructor).set(key, []);
  }
  MIDDLE_METHODS.get(target.constructor).get(key).push(deal);
  target[Tags.tagMiddleMethod] = target.constructor[
    Tags.tagMiddleMethod
  ] = MIDDLE_METHODS.get(target.constructor);
};

export const registerGlobal = (target: {}, deal: Function): void => {
  if (!target[Tags.tagGlobalMethod]) {
    target[Tags.tagGlobalMethod] = [];
  }
  target[Tags.tagGlobalMethod].push(deal);
};

export const registerMiddleware = (
  target: {},
  key: string,
  deal: Function
): void => {
  if (!MIDDLE_WARES.has(target.constructor)) {
    MIDDLE_WARES.set(target.constructor, new Map());
  }
  if (!MIDDLE_WARES.get(target.constructor).has(key)) {
    MIDDLE_WARES.get(target.constructor).set(key, new Set());
  }
  MIDDLE_WARES.get(target.constructor).get(key).add(deal);
  target[Tags.tagMiddleWare] = target.constructor[
    Tags.tagMiddleWare
  ] = MIDDLE_WARES.get(target.constructor);
};
