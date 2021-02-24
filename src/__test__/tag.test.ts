import { BaseController, UserController } from "./init";
import {Tags} from "../index";

describe("Tag", () => {
  it(` BaseController's tags should be equal "undefined"`, () => {

    expect(BaseController[Tags.tagTag]).toBe(undefined);

  });

  it(` UserController's doGet tag should be equal "User"`, () => {

    expect([...UserController[Tags.tagTag].get("doGet")]).toEqual(["User"]);

  });

  it(` UserController's doPut tag should be equal undefined`, () => {

    expect(UserController[Tags.tagTag].get("doPut")).toBe(undefined);

  });

});
