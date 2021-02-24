import { BaseController, UserController } from "./init";
import {HTTPStatusCodes, Tags} from "../index";

describe("Response", () => {

  it(` BaseController's index have [ 200 ] response`, () => {

    expect(BaseController[Tags.tagResponse].get("index").get(HTTPStatusCodes.success)).not.toBe(undefined);

  });

  it(` BaseController's index haven't [ 500 ] response`, () => {

    expect(BaseController[Tags.tagResponse].get("index").get(HTTPStatusCodes.internalServerError)).toBe(undefined);

  });

  it(` UserController's doGet have [ 200 ] response`, () => {

    expect(UserController[Tags.tagResponse].get("doGet").get(HTTPStatusCodes.success)).not.toBe(undefined);

  });

  it(` UserController's doGet have [ 201 ] response`, () => {

    expect(UserController[Tags.tagResponse].get("doGet").get(HTTPStatusCodes.created)).not.toBe(undefined);

  });

  it(` UserController's doGet haven't [ 303 ] response`, () => {

    expect(UserController[Tags.tagResponse].get("doGet").get(HTTPStatusCodes.other)).toBe(undefined);

  });

  it(` UserController's doPost have [ 303 ] response`, () => {

    expect(UserController[Tags.tagResponse].get("doPost").get(HTTPStatusCodes.other)).not.toBe(undefined);

  });

});
