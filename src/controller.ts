import { Tags } from './index';

/**
 * Controller
 * @param path relative path
 * @returns ClassDecorator {(Controller:Function)=>undefined}
 */
export const controller = (path?: string): ClassDecorator => (
  Controller: Function
): void => {
  if (!path) {
    path = Controller.name;
  }
  const parent = Object.getPrototypeOf(Controller);
  if (parent[Tags.tagController]) {
    path = parent[Tags.tagController] + path;
  }
  Controller[Tags.tagController] = path;
};
