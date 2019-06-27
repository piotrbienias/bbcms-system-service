/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import { Request, Response, NextFunction } from 'express';
import ApiResponse from '@utils/lib/api/response';

import { ADMIN } from './constants';


/**
 * Check if currently logged in user is administrator by checking his user role label.
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
export const IsAdmin = (req: Request, res: Response, next: NextFunction): Response => {

    if ( req['user'] && req['user'].userRole && req['user'].userRole.label === ADMIN ) {
        next();
    } else {
        return ApiResponse.unauthorized(res);
    }

};


/**
 * Check if user is logged in.
 *
 * @param req
 * @param res
 * @param next
 * @constructor
 */
export const IsLoggedIn = (req: Request, res: Response, next: NextFunction): Response | void => {

    if ( req['user'] ) next();
    else return ApiResponse.unauthorized(res);

};