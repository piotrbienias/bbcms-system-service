/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import { Inject, Service, Token } from 'typedi';
import { BelongsToCreateAssociationMixinOptions, Transaction, ValidationError, ValidationErrorItem } from 'sequelize';
import SequelizeError from '@utils/lib/errors/sequelizeError';

import { UserInterface, UserStatic, User } from '../models/user';
import models from '@system/config/models';
import { User as UserTypes, Permission as PermissionTypes } from '../utils/types';
import { PermissionRepositoryImpl } from './permission';


export const UserRepositoryImpl = new Token<UserTypes.RepositoryInterface>();


/**
 * User Model Repository
 */
@Service(UserRepositoryImpl)
class UserRepository implements UserTypes.RepositoryInterface {

    model: UserStatic;

    @Inject(PermissionRepositoryImpl)
    permissionRepository: PermissionTypes.RepositoryInterface;

    constructor() {
        this.model = models.User;
    }

    /**
     * Return all users.
     *
     * @param paranoid If true, include deleted users.
     * @return Array<UserInterface>
     */
    async getAllUsers(paranoid?: boolean): Promise<Array<UserInterface>> {
        let users: Array<User> = await this.model.scope([ 'withUserRole', 'withPermissions' ]).findAll({ paranoid });

        return users.map((user: User) => {
            return user.serialize();
        });
    }

    /**
     * Return single User by ID.
     *
     * @return UserInterface
     * @param id
     */
    async getUserById(id: number): Promise<User> {
        return await this.model.scope([ 'withUserRole', 'withPermissions' ]).findByPk(id);
    }

    /**
     * Create new user.
     *
     * @throws SequelizeError
     * @param data
     */
    async createUser(data: UserTypes.CreateData): Promise<User> {
        let transaction: Transaction = await models.sequelize.transaction();

        try {
            let user: User = await this.model.create(data, { transaction });
            if ( data.permissions ) {
                await this.setPermissions(user, data.permissions, { transaction });
            }

            transaction.commit();
            return user;
        } catch (e) {
            transaction.rollback();
            throw new SequelizeError(e);
        }
    }

    /**
     * Update user object with new data.
     *
     * @param user
     * @param data
     */
    async updateUser(user: User, data: Partial<UserTypes.UpdateData>): Promise<User> {
        let transaction: Transaction = await models.sequelize.transaction();

        try {
            let updatedUser: User = await user.update(data, { transaction });
            if ( data.permissions ) {
                await this.setPermissions(user, data.permissions, { transaction });
            }

            transaction.commit();
            return updatedUser;
        } catch (e) {
            transaction.rollback();
            throw new SequelizeError(e);
        }
    }

    /**
     * Delete single user.
     *
     * @param user
     */
    async deleteUser(user: User): Promise<void> {
        return user.destroy();
    }

    /**
     * Return single deleted user by ID.
     *
     * @param id
     */
    async getDeletedUserById(id: number): Promise<User> {
        return this.model.findByPk(id, { paranoid: false });
    }

    /**
     * Restore single user.
     *
     * @param user
     */
    async restoreUser(user: User): Promise<void> {
        return user.restore();
    }

    /**
     * Block user. Blocked user can't login the system.
     *
     * @param user
     */
    async blockUser(user: User): Promise<void> {
        user.set('isActive', false);
        return user.save();
    }

    /**
     * Activate user - user is now allowed to login to the system again.
     *
     * @param user
     */
    async activateUser(user: User): Promise<void> {
        user.set('isActive', true);
        return user.save();
    }

    /**
     * Change given user's password after it's validation.
     *
     * @param user
     * @param password
     */
    async changeUserPassword(user: User, password: string): Promise<void> {
        if ( User.validatePassword(password) ) {
            user.set('password', password);
            return user.save();
        } else {
            throw new Error('Password must be at least 8 characters long and include 1 digit');
        }
    }

    /**
     * Set user's permissions.
     *
     * @param user
     * @param permissions
     * @param options
     */
    async setPermissions(user: User, permissions: string[], options: BelongsToCreateAssociationMixinOptions): Promise<void> {
        if ( !await this.permissionRepository.checkIfPermissionsExist(permissions, options) ) {
            throw new ValidationError(
                'Permissions do not exist',
                [ new ValidationErrorItem('Permissions do not exist', 'ValidationError', 'permissions') ]
            );
        }

        return user.setPermissions(permissions, options);
    }
}


export default UserRepository;