import {controller, get, parameter, summary, response, description, HTTPStatusCodes} from "../..";
import * as joi from "joi";

@controller("/v3/api")
export class BaseController {

    @get("/")
    @parameter("version", joi.string().description("version"))
    @summary("BaseController[index]")
    @response(HTTPStatusCodes.success)
    @description("home")
    public index(): void {

    }

}
