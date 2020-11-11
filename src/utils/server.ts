import express from 'express';
import {Express} from 'express-serve-static-core';
import * as OpenApiValidator from 'express-openapi-validator';
import {connector, summarise} from 'swagger-routes-express';
import YAML from 'yamljs';

import * as api from '@ms/api/controllers';

export async function createServer(): Promise<Express> {
    // load openapi yaml file
    const yamlSpecFile = './config/openapi.yml';
    const apiDefinition = YAML.load(yamlSpecFile);
    const apiSummary = summarise(apiDefinition);
    console.info(apiSummary);

    // init express server
    const server = express();

    // API validator
    const validatorOptions = {
        apiSpec: yamlSpecFile,
        validateRequests: true,
        validateResponses: true
    };
    server.use(OpenApiValidator.middleware(validatorOptions));

    // error handler middleware
    server.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(err.status).json({
            error: {
                type: 'request_validation',
                message: err.message,
                errors: err.errors
            }
        });
    });

    // connect server with api definition
    const connect = connector(api, apiDefinition, {
        onCreateRoute: (method: string, descriptor: any[]) => {
            descriptor.shift();
            console.log(`${method}: ${descriptor.map((d: any) => d.name).join(', ')}`);
        },
        security: {
            bearerAuth: api.auth
        }
    });
    connect(server);

    return server;
}