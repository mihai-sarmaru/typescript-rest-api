import express from 'express';
import {Express} from 'express-serve-static-core';
import * as OpenApiValidator from 'express-openapi-validator';
import {connector, summarise} from 'swagger-routes-express';
import YAML from 'yamljs';

import * as api from '../api/controllers';

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
        coerceTypes: true,
        apiSpec: yamlSpecFile,
        validateRequests: true,
        validateResponses: true
    };
    server.use(OpenApiValidator.middleware(validatorOptions));

    // connect server with api definition
    const connect = connector(api, apiDefinition, {
        onCreateRoute: (method: string, descriptor: any[]) => {
            console.log(`${method}: ${descriptor[0]} : ${(descriptor[1] as any).name}`);
        }
    });
    connect(server);

    return server;
}