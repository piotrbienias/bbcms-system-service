/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

import { User, UserStatic, UserInterface } from '../models/user';
import { UserRole, UserRoleStatic } from "../models/userRole";
import { BelongsToCreateAssociationMixinOptions, FindOptions } from "sequelize";
import { Permission, PermissionStatic } from "../models/permission";


/**
 * Authentication/authorization related types
 */
export namespace Auth {

    /**
     * Auth Repository Interface
     */
    export interface RepositoryInterface {
        verifyUserPassword(email: string, password: string): Promise<User>;
    }
}


/**
 * Permission Sequelize Model related types
 */
export namespace Permission {

    /**
     * Permission Model Repository Interface
     */
    export interface RepositoryInterface {
        model: PermissionStatic;

        getAll(options?: FindOptions): Promise<Permission[]>;

        checkIfPermissionsExist(permissions: string[], options?: FindOptions): Promise<boolean>;
    }
}


/**
 * UserRole Sequelize Model related types
 */
export namespace UserRole {

    /**
     * User Role Model Repository Interface
     */
    export interface RepositoryInterface {
        model: UserRoleStatic;

        getAll(options: FindOptions): Promise<UserRole[]>;
    }
}


/**
 * User Sequelize Model related types
 */
export namespace User {

    /**
     * User update data
     */
    export type UpdateData = {
        email: string;
        name: string;
        lastName: string;
        userRole: string;
        isActive: boolean;
        permissions: string[];
    }

    /**
     * User create data
     */
    export type CreateData = {
        email: string;
        name?: string;
        lastName?: string;
        userRole: string;
        isActive?: boolean;
        permissions?: string[];
    }

    /**
     * User Model Repository Interface
     */
    export interface RepositoryInterface {
        model: UserStatic;
        permissionRepository: Permission.RepositoryInterface;

        getAllUsers(paranoid?: boolean): Promise<Array<UserInterface>>;

        getUserById(id: number): Promise<User>;

        createUser(data: CreateData): Promise<User>;

        updateUser(user: User, data: Partial<UpdateData>): Promise<User>;

        deleteUser(user: User): Promise<void>;

        restoreUser(user: User): Promise<void>;

        getDeletedUserById(id: number): Promise<User>;

        blockUser(user: User): Promise<void>;

        activateUser(user: User): Promise<void>;

        changeUserPassword(user: User, password: string): Promise<void>;

        setPermissions(user: User, permissions: string[], options: BelongsToCreateAssociationMixinOptions): Promise<void>;
    }
}