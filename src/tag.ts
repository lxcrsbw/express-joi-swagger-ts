import { registerMethod } from './utils';
import { IPath, Tags } from './index';

const TAGS: Map<Function, Map<string, Set<string>>> = new Map();

export const tag = (tagString: string): MethodDecorator => (
  target: {},
  key: string
) => {
  if (!TAGS.has(target.constructor)) {
    TAGS.set(target.constructor, new Map());
  }
  if (!TAGS.get(target.constructor).has(key)) {
    TAGS.get(target.constructor).set(key, new Set());
  }
  registerMethod(target, key, (router: IPath): void => {
    if (!router.tags) {
      router.tags = [];
    }
    router.tags.push(tagString);
  });
  TAGS.get(target.constructor).get(key).add(tagString);
  target[Tags.tagTag] = target.constructor[Tags.tagTag] = TAGS.get(
    target.constructor
  );
};
