import { registerMethod } from './utils';
import { IPath, Tags } from './index';

const DESCRIPTIONS: Map<Function, Map<string, string>> = new Map();

export const description = (descriptionString: string): MethodDecorator => (
  target: {},
  key: string
): void => {
  if (!DESCRIPTIONS.has(target.constructor)) {
    DESCRIPTIONS.set(target.constructor, new Map());
  }
  registerMethod(target, key, (router: IPath): void => {
    router.description = descriptionString;
  });
  DESCRIPTIONS.get(target.constructor).set(key, descriptionString);
  target[Tags.tagDescription] = target.constructor[
    Tags.tagDescription
  ] = DESCRIPTIONS.get(target.constructor);
};
