/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import { Request, Response } from 'express';
import { Service, Inject } from 'typedi';
import ApiResponse from '@utils/lib/api/response';
import BaseRouter from '@utils/lib/api/baseRouter';

import { Auth as AuthTypes } from '../utils/types';
import { AuthRepositoryImpl } from '../repositories/auth';
import { AUTHORIZATION_TOKEN_NAME, AUTHORIZATION_TOKEN_EXPIRATION } from '../utils/constants';
import { createToken } from '../utils/auth';
import { IsLoggedIn } from '../utils/permissions';


@Service()
class AuthRouter extends BaseRouter {

    @Inject(AuthRepositoryImpl)
    private readonly repository: AuthTypes.RepositoryInterface;

    constructor() {
        super();

        this.router.post('/login', this.login);
        this.router.post('/logout', IsLoggedIn, this.logout);
        this.router.get('/me', IsLoggedIn, this.me);
    }

    /**
     * Login to the application by passing email and password.
     * If password matches with email, request cookie is set, otherwise
     * response with 401 status is returned.
     *
     * @param req
     * @param res
     */
    login = async (req: Request, res: Response): Promise<any> => {
        try {
            let user = await this.repository.verifyUserPassword(req.body['email'], req.body['password']);
            let authToken = createToken({ id: user.get('id') });

            res.cookie(
                AUTHORIZATION_TOKEN_NAME,
                authToken,
                {
                    httpOnly: true,
                    expires: new Date(Date.now() + AUTHORIZATION_TOKEN_EXPIRATION * 1000)
                }
            );

            return ApiResponse.data(res, user.serialize(), 'Login successful');
        } catch (e) {
            return ApiResponse.unauthorized(res, e.message);
        }

    };

    /**
     * Logout from the application by clearing the authorization request cookie.
     *
     * @param req
     * @param res
     */
    logout = (req: Request, res: Response) => {
        res.clearCookie(AUTHORIZATION_TOKEN_NAME, { httpOnly: true });
        return ApiResponse.data(res, null, 'Logout successful');
    };

    /**
     * Return currently logged in user data.
     *
     * @param req
     * @param res
     */
    me = async (req: Request, res: Response) => {
        return ApiResponse.data(res, req['user']);
    };

}


export default AuthRouter;