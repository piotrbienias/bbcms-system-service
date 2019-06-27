/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import 'reflect-metadata';
import { Inject, Service } from 'typedi';
import BaseRouter from '@utils/lib/api/baseRouter';
import ApiResponse from '@utils/lib/api/response';
import SequelizeError from '@utils/lib/errors/sequelizeError';
import { Request, Response } from 'express';

import { UserInterface, User } from '../models/user';
import { IsAdmin } from '../utils/permissions';
import { UserRepositoryImpl } from '../repositories/user';
import { User as UserTypes } from '../utils/types';


@Service()
class UserRouter extends BaseRouter {

    @Inject(UserRepositoryImpl)
    private userRepository: UserTypes.RepositoryInterface;

    constructor() {
        super();

        this.router.get('/', this.getAllUsers);
        this.router.get('/:id', IsAdmin, this.getUserById);
        this.router.post('/', IsAdmin, this.createUser);
        this.router.put('/:id', IsAdmin, this.updateUser);
        this.router.delete('/:id', IsAdmin, this.deleteUser);

        this.router.put('/:id/restore', IsAdmin, this.restoreUser);
        this.router.put('/:id/block', IsAdmin, this.blockUser);
        this.router.put('/:id/activate', IsAdmin, this.activateUser);
        this.router.put('/:id/change-password', IsAdmin, this.changeUserPassword);
    }

    /**
     * Return all users.
     *
     * @param req
     * @param res
     */
    getAllUsers = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.getAllUsers(false).then((users: Array<UserInterface>) => {
            return ApiResponse.data(res, users);
        });
    };

    /**
     * Return single user by ID.
     *
     * @param req
     * @param res
     */
    getUserById = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.getUserById(parseInt(req.params['id'])).then((user: User) => {
            if ( !user ) return ApiResponse.notFound(res, req.params, 'User does not exist');

            return ApiResponse.data(res, user.serialize());
        });
    };

    /**
     * Create new user.
     *
     * @param req
     * @param res
     */
    createUser = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.createUser(req.body).then((user: User) => {
            return ApiResponse.data(res, user.serialize(), 'User was created');
        }).catch((e: SequelizeError) => {
            return res.status(e.getStatus()).send(e.getErrorData());
        });
    };

    /**
     * Update user with new data by his ID.
     *
     * @param req
     * @param res
     */
    updateUser = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.getUserById(req.params['id']).then((user: User) => {
            if ( !user ) return ApiResponse.notFound(res, req.params, 'User does not exist');

            this.userRepository.updateUser(user, req.body).then((updatedUser: User) => {
                return ApiResponse.data(res, updatedUser.serialize(), 'User was updated');
            }).catch((e: SequelizeError) => {
                return res.status(e.getStatus()).send(e.getErrorData());
            });
        });
    };

    /**
     * Delete single user by ID.
     *
     * @param req
     * @param res
     */
    deleteUser = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.getUserById(req.params['id']).then((user: User) => {
            if ( !user ) return ApiResponse.notFound(res, req.params, 'User does not exist');

            this.userRepository.deleteUser(user).then(() => {
                return ApiResponse.data(res, null, 'User was deleted');
            }).catch(e => {
                return ApiResponse.error(res, e);
            });
        });
    };

    /**
     * Restore single user by ID.
     *
     * @param req
     * @param res
     */
    restoreUser = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.getDeletedUserById(req.params['id']).then((user: User) => {
            if ( !user ) return ApiResponse.notFound(res, req.params, 'User does not exist');

            this.userRepository.restoreUser(user).then(() => {
                return ApiResponse.data(res, null, 'User has been restored');
            }).catch(e => {
                return ApiResponse.error(res, e);
            });
        });
    };

    /**
     * Block user's account. Blocked user can't login.
     *
     * @param req
     * @param res
     */
    blockUser = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.getUserById(req.params['id']).then((user: User) => {
            if ( !user ) return ApiResponse.notFound(res, req.params, 'User does not exist');

            this.userRepository.blockUser(user).then(() => {
                return ApiResponse.data(res, null, 'User has been blocked');
            }).catch(e => {
                return ApiResponse.error(res, e);
            });
        });
    };

    /**
     * Activate user's account. Active user can login to the system.
     *
     * @param req
     * @param res
     */
    activateUser = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.getUserById(req.params['id']).then((user: User) => {
            if ( !user ) return ApiResponse.notFound(res, req.params, 'User does not exist');

            this.userRepository.activateUser(user).then(() => {
                return ApiResponse.data(res, null, 'User has been activated');
            }).catch(e => {
                return ApiResponse.error(res, e);
            });
        });
    };

    /**
     * Change given user password.
     *
     * @param req
     * @param res
     */
    changeUserPassword = (req: Request, res: Response): Promise<Response> => {
        return this.userRepository.getUserById(req.params['id']).then((user: User) => {
            if ( !user ) return ApiResponse.notFound(res, req.params, 'User does not exist');

            this.userRepository.changeUserPassword(user, req.body['password']).then(() => {
                return ApiResponse.data(res, null, 'Password has been changed');
            }).catch(e => {
                return ApiResponse.error(res, e);
            });
        });
    }
}


export default UserRouter;