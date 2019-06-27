/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import { sign, verify } from 'jsonwebtoken';
import { Request } from 'express';

import { AUTHORIZATION_TOKEN_NAME, AUTHORIZATION_TOKEN_EXPIRATION } from './constants';
import models from '@system/config/models';
import { User, UserInterface } from '@system/models/user';


/**
 * Create new token with encoded data.
 *
 * @param {Object} data Data to be encoded in token
 */
export const createToken = (data: any): string => {

    return sign(
        data,
        process.env.AUTH_SECRET_KEY,
        {
            expiresIn: AUTHORIZATION_TOKEN_EXPIRATION
        }
    );

};


/**
 * Verify given authorization token agains project Secret Key.
 *
 * @param {String} token Authorization token
 */
export const verifyToken = (token: string): object | string => {

    return verify(
        token,
        process.env.AUTH_SECRET_KEY
    );

};


/**
 * Authorizes current user by verifying the authorization token.
 * If token is valid we return the User object, otherwise null.
 *
 * @param request
 */
export const authorize = async (request: Request): Promise<UserInterface> => {

    try {
        let authorizationData = verifyToken(request.cookies[AUTHORIZATION_TOKEN_NAME]);
        let user: User = await models.User.scope([ 'withUserRole', 'withPermissions' ]).findByPk(authorizationData['id']);

        return user ? user.serialize() : null;
    } catch (e) {
        return null;
    }

};