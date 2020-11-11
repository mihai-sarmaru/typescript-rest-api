import {Request, Response} from 'express';
import {writeJsonResponse} from '@ms/utils/express'

export function hello(req: Request, res: Response): void {
    const name = req.query.name || 'stranger';
    writeJsonResponse(res, 200, {
        message: `Hello ${name}!`
    });
}

export function goodbye(req: Request, res: Response): void {
    const userId = res.locals.auth.userId;
    writeJsonResponse(res, 200, {
        message: `Goodbye, ${userId}!`
    });
}