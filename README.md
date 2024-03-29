# express-joi-swagger-ts [![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/express-joi-swagger-ts.svg
[npm-url]: https://npmjs.org/package/express-joi-swagger-ts

## How to use

    npm install express-joi-swagger-ts --save

## Documentation

### Methods

Each controller can use 5 predefined rest methods `GET, PUT, POST, PATCH, DELETE`

### Example of using

    @controller("/user")
    class UserController extends BaseController {
        @put("/{userId}")
        @parameter("userId", joi.string().min(2).description("userId"), ENUM_PARAM_IN.path)
        addSomeUser(req, res) {
            res.send("cant add user");
        }

        @del("/{userId}")
        @parameter("userId", joi.string().min(2).description("userId"), ENUM_PARAM_IN.path)
        deleteSomeUser(req, res) {
            res.send("user not found");
        }
    }

### Resolvers

We have 3 type of resolvers (aka middlewares, but without next() functions) - functions which can be called before (or after) your controller method:

- **safe** - this resolver can wrap on method by try-catch
- **before** - call function (or list of functions) before our target controller method
- **after** - call function (or list of functions) after our target method

#### @safe(fn?: ErrorHandlerFunction, throwNext?: boolean)

This decorator can wrap on your method into try-catch, and if something wrong - call function which specifiyed into parameter **fn** with Error argument

Parameters:

- **fn** - function (optional) - call if throwed error
- **throwNext** - boolean (optional) - if true, will throw error to upper level

##### Example of using @safe() resolver

    import {safe, parameter, del, controller, ENUM_PARAM_IN} from "express-joi-swagger-ts";

    // ...somecodehere...

    @controller("/user")
    class UserController extends BaseController {
        @del("/{userId}")
        @parameter("userId", joi.string().min(2).description("userId"), ENUM_PARAM_IN.path)
        @safe( (err) => { console.log(err) } )
        deleteSomeUser() {
            throw Error("Some bad error");
        }
    }

#### @before(...fn: MiddlewareFunction[])

This decorator can add additional functions which will called before your controller method.

Parameters:

- **fn** - function - functions which will be called

##### Example of using @before() resolver

    import {before, parameter, del, controller, ENUM_PARAM_IN} from "express-joi-swagger-ts";

    // ...somecodehere...

    @controller("/user")
    class UserController extends BaseController {
        @del("/{userId}")
        @parameter("userId", joi.string().min(2).description("userId"), ENUM_PARAM_IN.path)
        @before( (req) => { console.log("first resolver") } )
        @before( (req) => { console.log("second resolver") }, (req) => { console.log("third resolver") } )
        deleteSomeUser(req, res) {
            res.send("user not found");
        }
    }

#### @after(...fn: MiddlewareFunction[])

This decorator can add additional functions which will called after your controller method.

**ATTENTION!**
Specific of decorators calling - is reversed order of calls, thats why, if you use few @after decorators - last after will be called as first, and first as last, thats why I recommend to use list of functions as multiple arguments if order matters something for your logic

Parameters:

- **fn** - function - functions which will be called

##### Example of using @after() resolver

    import {after, parameter, del, controller, ENUM_PARAM_IN} from "express-joi-swagger-ts";

    // ...somecodehere...

    @controller("/user")
    class UserController extends BaseController {
        @del("/{userId}")
        @parameter("userId", joi.string().min(2).description("userId"), ENUM_PARAM_IN.path)
        @after( (req) => { console.log("called THIRD afetr method") } )
        @after( (req) => { console.log("called FIRST after method") }, (req) => { console.log("called SECOND after method") } )
        deleteSomeUser(req, res) {
            res.send("user not found");
        }
    }

## Example (_TypeScript_)

    import {parameter, get, post, del, controller, definition, ExpressSwaggerRouter, summary, response, tag, ENUM_PARAM_IN} from "express-joi-swagger-ts";
    import * as joi from "joi";
    import * as fs from "fs";
    import {array, string} from "joi";
    import * as express from 'express';

    @definition("User", "User Entity")
    class UserSchema {
        userName = joi.string().min(6).description("username").required();
        userPass = joi.string().min(6).description("password").required();
    }

    @controller("/v3/api")
    class BaseController {
        @get("/")
        index() {
        }
    }

    /**
     * This method will be called by middleware instead of controller
     */
    const baseControllerFunction = async (controller, req, next, summary): Promise<void> => {
        console.log(`${req.method} ${req.url}`);
        try {
            await controller(req);
        } catch (e) {
            console.log(e, `Error while executing "${summary}"`);
        }
    };

    @controller("/user")
    class UserController extends BaseController {

        @del("/{userId}")
        @parameter("userId", joi.string().min(2).description("userId"), ENUM_PARAM_IN.path)
        index() {

        }

        @get("/")
        @parameter("userId", joi.string().required(), ENUM_PARAM_IN.query)
        doGet(req, res) {
            res.send(Date.now());
        }

        @get("/{userId}")
        @parameter("userId", joi.number().min(2).description("userId"), ENUM_PARAM_IN.path)
        @response(200, {$ref: UserSchema})
        getUser(req, res) {
            res.send({userName: req.params.userId.toString(), userPass: Date.now().toString()});
        }

        @post("/upload")
        @parameter("file1", {type: "file"}, ENUM_PARAM_IN.formData)
        doUpload(req, res) {
            res.send({ fileObj: req.body.file1});
        }

        @post("/")
        doPost() {
        }

        @get("s")
        @response(200, {type: "array", items: {$ref: UserSchema}})
        getUsers() {
        }
    }

    @definition("Admin", "Admin Entity")
    class AdminSchema {
        userName = joi.string().required().min(6).uppercase();
        userPass = joi.string();
    }

    @controller("/admin")
    class AdminController extends UserController {

        @post("/login")
        @parameter("name", joi.string().description("name"))
        @parameter("list", array().items(string()).required(), ENUM_PARAM_IN.query)
        @summary("AdminController.index")
        @response(200, {$ref: AdminSchema})
        @response(202, joi.string().description("aaa"))
        @tag("Admin")
        @tag("User")
        index() {
        }
    }

    const router = new ExpressSwaggerRouter({
      swagger: '2.0',
      info: {
        description:
          'This is a sample server Express server.  You can find out more about     Swagger at [http://swagger.io](http://swagger.io) or on [irc.freenode.net, #swagger](http://swagger.io/irc/).      For this sample, you can use the api key `special-key` to test the authorization     filters.',
        title: 'Express TypeScript Swagger',
        version: '1.0.0',
        concat: {
          email: 'xxx@outlook.com'
        },
        // 开源协议
        license: {
          name: 'Apache 2.0',
          url: 'http://www.apache.org/licenses/LICENSE-2.0.html'
        }
      },
      // host: '',
      basePath: '',
      schemes: ['http', 'https'],
      paths: {},
      definitions: {},
      securityDefinitions: {
        JWT: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization'
        }
      }
    });

    router.loadDefinition(UserSchema);
    router.loadDefinition(AdminSchema);
    // Or you can:
    // router.loadDefinition([UserSchema, AdminSchema]);
    router.loadController(BaseController);
    // Process controller through pattern Decorator
    router.loadController(UserController, baseControllerFunction);
    router.loadController(AdminController);

    router.setSwaggerFile("swagger.json");
    router.loadSwaggerUI("/");
    fs.writeFileSync("./swagger.json", JSON.stringify(router.swagger));
    // console.log(router.getRouter());

    const app = express();
    app.use(router.getRouter());
    app.listen(3002);

## Project example

You can quickly test express-joi-swagger-ts with the project example [express-base-ts](https://github.com/Lxsbw/express-base-ts).

## Remarks

提供一个简洁的Express Swagger TS版本，像中间件一样使用，少干扰Express
