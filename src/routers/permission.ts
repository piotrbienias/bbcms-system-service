/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

import { Service, Inject } from 'typedi';
import { Request, Response } from 'express';
import BaseRouter from '@utils/lib/api/baseRouter';
import ApiResponse from '@utils/lib/api/response';

import { Permission as PermissionTypes } from '../utils/types';
import { PermissionRepositoryImpl } from '../repositories/permission';
import { Permission } from '../models/permission';
import { IsLoggedIn } from "../utils/permissions";


@Service()
class PermissionRouter extends BaseRouter {

    @Inject(PermissionRepositoryImpl)
    repository: PermissionTypes.RepositoryInterface;

    constructor() {
        super();

        this.router.get('/', IsLoggedIn, this.getAllPermissions);
    }

    getAllPermissions = async (req: Request, res: Response): Promise<Response> => {
        let permissions: Permission[] = await this.repository.getAll();
        let mappedPermissions = permissions.map((permission: Permission) => {
            return permission.serialize();
        });

        return ApiResponse.data(res, mappedPermissions);
    }
}


export default PermissionRouter;