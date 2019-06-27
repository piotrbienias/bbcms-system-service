/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';


import { Sequelize, Model, DataTypes, BuildOptions } from 'sequelize';


/**
 * Serialized UserRole representation
 */
export interface UserRoleInterface {
    name: string;
    label: string
}

/**
 * Static type of UserRole Model
 */
export type UserRoleStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): UserRole
}


/**
 * UserRole Sequelize Model
 */
export class UserRole extends Model {
    public name!: string;
    public label!: string;

    public serialize(): UserRoleInterface {
        let keys: Array<string> = [ 'name', 'label' ],
            userRole: any = {};

        keys.forEach((key: string) => {
            userRole[key] = this.get(key);
        });

        return userRole;
    }
}

export default (sequelize: Sequelize) => {

    UserRole.init({
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        label: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        tableName: 'bb_user_roles',
        timestamps: false,
        paranoid: false
    });

    return UserRole;
}