import { BaseController, UserController } from "./init";
import {ENUM_PARAM_IN, Tags} from "..";

describe("Parameter", () => {

  it(` BaseController's index method should have [ parameter {version} ] `, () => {

    expect(BaseController[Tags.tagParameter].get("index").get("version")).not.toBe(undefined);

  });

  it(` BaseController's index method [ parameter {version} ]'s description should be "version"`, () => {

    expect(BaseController[Tags.tagParameter].get("index").get("version").schema._description).toBe("version");

  });

  it(` BaseController's index method [ parameter {version} ]'s in should be "ENUM_PARAM_IN.query"`, () => {

    expect(BaseController[Tags.tagParameter].get("index").get("version").in).toBe(ENUM_PARAM_IN.query);

  });

  it(` UserController's doPost method should have [ parameter {user} ] `, () => {

    expect(UserController[Tags.tagParameter].get("doPost").get("user")).not.toBe(undefined);

  });

  it(` UserController's doPost method [ parameter {user} ]'s description should be "user"`, () => {

    expect(UserController[Tags.tagParameter].get("doPost").get("user").schema._description).toBe("user");

  });

  it(` UserController's doPost method [ parameter {user}]'s in should be "ENUM_PARAM_IN.body"`, () => {

    expect(UserController[Tags.tagParameter].get("doPost").get("user").in).toBe(ENUM_PARAM_IN.body);

  });

  it(` UserController's doDelete method [ parameter {uid}]'s in should be "ENUM_PARAM_IN.path"`, () => {

    expect(UserController[Tags.tagParameter].get("doDelete").get("uid").in).toBe(ENUM_PARAM_IN.path);

  });

  it(` UserController's doDelete method [ parameter {uid} ]'s description should be "userID"`, () => {

    expect(UserController[Tags.tagParameter].get("doDelete").get("uid").schema._description).toBe("userID");

  });

  it(` UserController's doPost method should haven't [ parameter {adminId} ]`, () => {

    expect(UserController[Tags.tagParameter].get("doDelete").get("adminId")).toBe(undefined);

  });
  
  it(` UserController's doPut method [ parameter {token}]'s in should be "ENUM_PARAM_IN.header"`, () => {

    expect(UserController[Tags.tagParameter].get("doPut").get("token").in).toBe(ENUM_PARAM_IN.header);

  });

  it(` UserController's doPut method [ parameter {token} ]'s description should be "token"`, () => {

    expect(UserController[Tags.tagParameter].get("doPut").get("token").schema._description).toBe("token");

  });

});
