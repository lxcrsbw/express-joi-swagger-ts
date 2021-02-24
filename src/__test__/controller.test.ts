import { BaseController, UserController } from "./init";
import {Tags} from "../index";

describe("Controller", () => {

  it(` BaseController's path should be equal "/v3/api"`, () => {

    expect(BaseController[Tags.tagController]).toBe("/v3/api");

  });

  it(` UserController's path should be equal "/v3/api/user"`, () => {

    expect(UserController[Tags.tagController]).toBe("/v3/api/user");

  });

});
