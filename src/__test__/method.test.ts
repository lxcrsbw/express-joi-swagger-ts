import { BaseController, UserController } from "./init";
import {Tags} from "../index";

describe("Method", () => {

  it(`BaseController should be have   [ GET /             ]`, () => {

    expect(BaseController[Tags.tagMethod].get("/").get("get")).not.toBe(null);

  });

  it(`BaseController should be haven't [ POST /            ]`, () => {

    expect(BaseController[Tags.tagMethod].get("/").get("post")).toBe(undefined);

  });

  it(`BaseController should be haven't [ DELETE /{uid}     ]`, () => {

    expect(BaseController[Tags.tagMethod].get("/{uid}")).toBe(undefined);

  });

  it(`BaseController should be haven't [ PUT /             ]`, () => {

    expect(BaseController[Tags.tagMethod].get("/").get("put")).toBe(undefined);

  });

  it(`UserController should be have   [ GET /             ]`, () => {

    expect(UserController[Tags.tagMethod].get("/").get("get")).not.toBe(null);

  });

  it(`UserController should be have   [ POST /            ]`, () => {

    expect(UserController[Tags.tagMethod].get("/").get("get")).not.toBe(null);

  });

  it(`UserController should be have   [ DELETE /{uid}     ]`, () => {

    expect(UserController[Tags.tagMethod].get("/{uid}").get("delete")).not.toBe(null);

  });

  it(`UserController should be have   [ PUT /             ]`, () => {

    expect(UserController[Tags.tagMethod].get("/").get("put")).not.toBe(null);

  });

});
