/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import { Request, Response, NextFunction } from 'express';
import { authorize } from './auth';


/**
 * Authorization middleware with priority -1 runs as the first global middleware.
 * If user is authorized, the User object will be available as request.user attribute
 * in any further middleware or request body.
 *
 * @param req
 * @param res
 * @param next
 */
const authorization = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    req['user'] = await authorize(req);
    next();
};


export default [
    { priority: -1, middleware: authorization }
];