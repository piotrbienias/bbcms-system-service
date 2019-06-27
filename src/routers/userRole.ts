/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

import { Service, Inject } from 'typedi';
import { Request, Response } from 'express';
import BaseRouter from '@utils/lib/api/baseRouter';
import ApiResponse from '@utils/lib/api/response';

import { UserRole as UserRoleTypes } from '../utils/types';
import { UserRoleRepositoryInterfaceImpl } from '../repositories/userRole';
import { UserRole } from "../models/userRole";
import { IsLoggedIn } from "../utils/permissions";


@Service()
class UserRoleRouter extends BaseRouter {

    @Inject(UserRoleRepositoryInterfaceImpl)
    repository: UserRoleTypes.RepositoryInterface;

    constructor() {
        super();

        this.router.get('/', IsLoggedIn, this.getAll);
    }

    getAll = (req: Request, res: Response): Promise<Response> => {
        return this.repository.getAll({ paranoid: true }).then((userRoles: UserRole[]) => {
            let mappedUserRoles = userRoles.map((userRole: UserRole) => {
                return userRole.serialize();
            });

            return ApiResponse.data(res, mappedUserRoles);
        });
    }
}


export default UserRoleRouter;