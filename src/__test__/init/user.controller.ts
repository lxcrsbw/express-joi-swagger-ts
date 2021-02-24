import {controller, del, get, post, put, ENUM_PARAM_IN, parameter, response, description, HTTPStatusCodes, summary, tag} from "../..";
import * as joi from "joi";
import {UserSchema} from "./user.schema";
import {BaseController} from "./base.controller";

@controller("/user")
export class UserController extends BaseController {
    @get("/")
    @parameter("userName", joi.string().description("username"))
    @response(HTTPStatusCodes.success, {$ref: UserSchema})
    @response(HTTPStatusCodes.created)
    @tag("User")
    public doGet(): void {

    }

    @post("/")
    @parameter("user", joi.string().description("user"), ENUM_PARAM_IN.body)
    @summary("UserController[doPost]")
    @response(HTTPStatusCodes.other)
    public doPost(): void {

    }

    @del("/{uid}")
    @parameter("uid", joi.string().required().description("userID"), ENUM_PARAM_IN.path)
    @description("Delete User")
    public doDelete(): void {

    }

    @put("/")
    @parameter("token", joi.string().description("token"), ENUM_PARAM_IN.header)
    public doPut(): void {

    }
}
