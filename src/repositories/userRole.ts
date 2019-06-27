/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

import { Token, Service } from "typedi";
import { FindOptions } from "sequelize";
import { UserRole, UserRoleStatic } from '../models/userRole';
import { UserRole as UserRoleTypes } from '../utils/types';


export const UserRoleRepositoryInterfaceImpl = new Token<UserRoleTypes.RepositoryInterface>();


@Service(UserRoleRepositoryInterfaceImpl)
class UserRoleRepository implements UserRoleTypes.RepositoryInterface {

    model: UserRoleStatic = UserRole;

    getAll(options: FindOptions): Promise<UserRole[]> {
        return this.model.findAll(options);
    }

}


export default UserRoleRepository;