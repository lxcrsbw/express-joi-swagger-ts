import { UserSchema } from "./init";
import {Tags} from "../index";

describe("Definition", () => {

  it(` UserSchema's name should be equal "User"`, () => {
    expect(UserSchema[Tags.tagDefinitionName]).toBe("User");
  });

  it(` UserSchema's description should be equal "User Entity"`, () => {
    expect(UserSchema[Tags.tagDefinitionDescription]).toBe("User Entity");
  });

});
