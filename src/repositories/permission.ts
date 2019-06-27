/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

import { FindOptions, Op } from "sequelize";
import { Service, Token } from 'typedi';
import { Permission as PermissionTypes } from '../utils/types';
import { Permission, PermissionStatic } from "../models/permission";


export const PermissionRepositoryImpl = new Token<PermissionTypes.RepositoryInterface>();


@Service(PermissionRepositoryImpl)
class PermissionRepository implements PermissionTypes.RepositoryInterface {

    model: PermissionStatic = Permission;

    /**
     * Return all permissions.
     *
     * @param options
     */
    getAll(options: FindOptions = {}): Promise<Permission[]> {
        return this.model.findAll(options);
    }

    /**
     * Verify if specified permissions exist.
     *
     * @param permissions Array of permission labels
     * @param options
     */
    async checkIfPermissionsExist(permissions: string[], options: FindOptions = {}): Promise<boolean> {
        options.where = { label: { [Op.in]: permissions } };
        let permissionsCount = await this.model.count(options);

        return permissionsCount === permissions.length;
    }

}


export default PermissionRepository;