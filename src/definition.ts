import { registerGlobal } from './utils';
import { toSchema } from './ischema';
import { Tags } from './index';

export const definition = (
  name?: string,
  description?: string
): ClassDecorator => (Definition: Function): void => {
  if (!name) {
    name = Definition.name;
  }
  registerGlobal(Definition, (swagger): void => {
    swagger.definitions[name] = toSchema(Definition);
  });
  Definition[Tags.tagDefinitionName] = name;
  Definition[Tags.tagDefinitionDescription] = description || name;
};
