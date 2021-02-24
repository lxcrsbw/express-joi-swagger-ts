import {definition} from "../..";
import * as joi from "joi";

const STRING_TRIM = 6;

@definition("User", "User Entity")
export class UserSchema {
    public userName = joi.string().min(STRING_TRIM).description("username").required();
//    userPass = joi.string().min(6).description("password").required();
}
