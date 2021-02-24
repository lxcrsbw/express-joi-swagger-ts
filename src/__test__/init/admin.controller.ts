import {controller, del, parameter, ENUM_PARAM_IN} from "../..";
import * as joi from "joi";
import {UserController} from "./user.controller";

@controller("/admin")
export class AdminController extends UserController {

    @del("/{adminId}")
    @parameter("adminId", joi.string().required().description("admin id"), ENUM_PARAM_IN.path)
    public doDelete(): void {

    }

}
