/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';


import { Sequelize, Model, BuildOptions, DataTypes } from 'sequelize';


/**
 * Simple Permission Interface
 */
export interface PermissionInterface {
    name: string;
    label: string;
}

/**
 * Static representation of Permission Model
 */
export type PermissionStatic = typeof Model & {
    new(values?: object, options?: object): BuildOptions;
}


/**
 * Sequelize Permission Model
 */
export class Permission extends Model {
    public name!: string;
    public label!: string;

    /**
     * Serialize permission object data
     */
    public serialize(): PermissionInterface {
        return {
            name: this.get('name'),
            label: this.get('label')
        };
    }
}


export default (sequelize: Sequelize) => {

    Permission.init({
        label: {
            type: DataTypes.STRING,
            primaryKey: true,
            unique: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, {
        sequelize,
        timestamps: false,
        paranoid: false,
        tableName: 'bb_permissions'
    });

    return Permission;
};