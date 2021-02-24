import { BaseController, UserController } from "./init";
import {Tags} from "../index";

describe("Summary", () => {
  it(` BaseController's index summary should be equal "BaseController[index]"`, () => {

    expect(BaseController[Tags.tagSummary].get("index")).toBe("BaseController[index]");

  });

  it(` BaseController's doGet summary should be equal undefined`, () => {

    expect(BaseController[Tags.tagSummary].get("doGet")).toBe(undefined);

  });

  it(` UserController's doPost summary should be equal "UserController[doPost]"`, () => {

    expect(UserController[Tags.tagSummary].get("doPost")).toBe("UserController[doPost]");

  });

  it(` UserController's doPut summary should be equal undefined`, () => {

    expect(UserController[Tags.tagSummary].get("doPut")).toBe(undefined);

  });

});
