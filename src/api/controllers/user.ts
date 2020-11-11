import {Request, Response, NextFunction} from 'express';

import UserService from '@ms/api/services/user';
import {writeJsonResponse} from '@ms/utils/express'

export function auth(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization!

    UserService.auth(token)
        .then(authResponse => {
            if (!(authResponse as any).error) {
                res.locals.auth = {
                    userId: (authResponse as {userId: string}).userId
                }
                next();
            } else {
                writeJsonResponse(res, 401, authResponse);
            }
        })
        .catch(err => {
            writeJsonResponse(res, 500, {
                error: {
                    type: 'internal_server_error',
                    message: 'Internal Server Error'
                }
            });
        });
}