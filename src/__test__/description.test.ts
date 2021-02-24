import { BaseController, UserController } from "./init";
import {Tags} from "../index";

describe("Description", () => {
  it(` BaseController's index description should be equal "BaseController[index]"`, () => {

    expect(BaseController[Tags.tagDescription].get("index")).toBe("home");

  });

  it(` BaseController's doGet description should be equal undefined`, () => {

    expect(BaseController[Tags.tagDescription].get("doGet")).toBe(undefined);

  });

  it(` UserController's doDelete description should be equal "Delete User"`, () => {

    expect(UserController[Tags.tagDescription].get("doDelete")).toBe("Delete User");

  });

  it(` UserController's doPut description should be equal undefined`, () => {

    expect(UserController[Tags.tagDescription].get("doPut")).toBe(undefined);

  });

});
