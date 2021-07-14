import 'module-alias/register';
import dotenv from "dotenv";
import express, { Response, Request } from "express";
import glob from 'glob';
import bodyParser from 'body-parser';
import logger from '@config/logger';
import appUse from '@config/app.use';
import winston from 'winston';
import expressWinston from 'express-winston';
import ValidationError from '@core/validation.error';
import PolicyError from '@core/policy.error';
import GuardError from '@core/guard.error';
import IError from '@error-handling/error.interface';
import { isEmpty } from 'lodash';
import { StatusCodes } from "http-status-codes";
import { checkSchema, validationResult } from "express-validator";
import { exit } from 'shelljs';

dotenv.config();

const port = process.env.PORT || 4000;
const app: any = express();
const endpoints: any = [];
const apiLocations = `${__dirname}/api/**/*.routes{.js,.ts}`;

function startServer() {
  app.listen( port, () => {
      // tslint:disable-next-line:no-console
      console.log( `server started at http://localhost:${ port }` );
  } );
}

const asyncHandler = (fn: typeof Function) => (req: any, res: any, next: any) => {
  return Promise.resolve(fn(req, res, next))
    .catch(next)
}

function setErrorHandler() {
  app.use(( req: Request, res: Response, next: typeof Function) => {
    res.status(404).json({
      message: "Requested Url Not Found"
    })
  })

  app.use((err: Error, req: Request, res: Response, next: typeof Function) => {
    const SERVER_ERROR = StatusCodes.INTERNAL_SERVER_ERROR;

    // Error handling is divided into if's with same implementation. If you wish to do customoziation, feel free to edit the code
    if (err instanceof ValidationError) {
      const { message, errors } = err.errorParams;
      const { statusCode, name } = err;

      return res.status(statusCode).json({
        message,
        errors,
        statusCode,
      })
    } else if (err instanceof PolicyError) {
      const { message } = err.errorParams;
      const { statusCode, name } = err;

      return res.status(statusCode).json({
        message,
        policy: `${name}: ${message}`,
        statusCode,
        name
      });
    } else if (err instanceof GuardError) {
      const { message, errors = "" } = err.errorParams;
      const { statusCode, name } = err;

      return res.status(statusCode).json({
        message,
        info: errors,
        statusCode,
        name
      });
    }

    logger.error(`Error in Base Code Server: ${err.message}`);

    res.status(SERVER_ERROR).json({
      message: 'Internal Server Error, Please Email SmurfJs for more details...!',
      statusCode: SERVER_ERROR
    })
  })
}

function setLogger() {
  app.use(expressWinston.logger({
    transports: [
      new winston.transports.Console()
    ],
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.json()
    ),
    meta: false, // optional: control whether you want to log the meta data about the request (default to true)
    msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
    expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
    colorize: true, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
    ignoreRoute (req, res) { return false; } // optional: allows to skip some log messages based on request and/or response
  }));
}

// Reads api directory and gets files with action.ts
const ReadDirectories = async (file: any) => {
  const component = require(file);
  const classFn = Object.keys(component);
  const readFiles = classFn.map(fn => {
    const fetchComponent = component[fn];
    const apiComponent = new fetchComponent();

    const { method, action, validation, policies, guards } = apiComponent;
    endpoints.push({ method, action, apiComponent: fetchComponent, validation, policies, guards });
  })
  await Promise.all(readFiles);
}

// Function for reading the directories
const ReadApi = async (err: any, files: string[]) => {
  if (err) {
    // tslint:disable-next-line:no-console
    console.log(err);
    throw new Error('Error in Reading Files');
  }

  app.get( "/api", ( req: Request, res: Response ) => {
    res.send("Hello World");
  });

  const getRoutes = files.map( ReadDirectories );

  await Promise.all(getRoutes);
  await Promise.all(endpoints.map((api: any) => {
    const { method, action, apiComponent, validation = null, policies = [], guards = [] } = api;
    const setValidation = validation === null ? (req: Request, res: Response, next: typeof Function) => next() : checkSchema(validation);
    const validationMiddleware = (req: Request, res: Response, next: any) => {
      const errors = validationResult(req).array();

      if (!isEmpty(errors)) {
        const payload: IError = {
          message: "Error in Validating Request",
          errors
        };
        const errValidateFn = new ValidationError(payload);

        return next(errValidateFn);
      }
      next();
    }

    app[method](action, ...guards.map((row: typeof Function) => asyncHandler(row)), setValidation, validationMiddleware, ...policies.map((row: typeof Function) => asyncHandler(row)),  async (req: Request, res: Response, next: any) => {
      try {
        const Component = new apiComponent();
        await Component.run(req, res);
        return Component.response(req, res);
      } catch(err) {
        next(err);
      }
    });
  }));
  setErrorHandler();
  startServer();
}

function setAppUse() {
  // start the express server
  app.use(bodyParser.urlencoded({ extended: false }));

  // parse application/json
  app.use(bodyParser.json());
  appUse.map(row => row.use(app))
}

const MainApp = () => {
  setLogger();
  setAppUse()
  glob(apiLocations, ReadApi);
}

MainApp();