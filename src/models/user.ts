/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import * as bcrypt from 'bcryptjs';
import { Model, DataTypes, BuildOptions, BelongsToManySetAssociationsMixin, ModelCtor } from 'sequelize';
import { UserRole, UserRoleInterface, UserRoleStatic } from './userRole';
import { Permission } from './permission';


/**
 * User serialized data representation
 */
export interface UserInterface {
    id: number;
    email: string;
    userRole: string | UserRoleInterface;
    name?: string;
    lastName?: string;
    isActive: boolean;
    isDeleted: boolean;
    permissions: string[];
}


export type UserStatic = typeof Model & {
    new(values?: object, options?: BuildOptions): User
    verifyPassword(email: string, password: string): Promise<boolean>;
    validatePassword(password: string): Promise<boolean>;
    associate<T extends ModelCtor<Model>>(models: { [key: string]: T }): void;
}


/**
 * User Sequelize Model
 */
export class User extends Model {
    public id!: number;
    public email!: string;
    public name!: string | null;
    public lastName!: string | null;
    public userRole!: string | UserRoleInterface;
    public permissions!: string[];
    public isActive!: boolean;

    public readonly password!: string;
    public readonly resetToken!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date;

    public setPermissions!: BelongsToManySetAssociationsMixin<Permission, string>;

    public readonly UserRole?: UserRole;
    public readonly Permissions?: Permission[];

    public getPassword(): any {
        return this.get('password');
    }

    /**
     * Serialize user data
     *
     * @return UserInterface
     */
    public serialize(): UserInterface {
        let keys: Array<string> = [ 'id', 'email', 'name', 'lastName', 'isActive' ],
            user: any = {};

        keys.forEach(key => {
            user[key] = this.get(key);
        });

        user['isDeleted'] = !!this.get('deletedAt');

        user.userRole = this.UserRole ? this.UserRole.toJSON() : this.get('userRole');

        user.permissions = this.Permissions ? this.Permissions.map((permission: Permission) => {
            return permission.get('label');
        }) : this.Permissions;

        return user;
    }

    /**
     * Verifies if given password belongs to user with given email.
     *
     * @param email
     * @param password
     */
    static async verifyPassword(email: string, password: string): Promise<boolean> {
        let user = await User.scope([ 'withUserRole' ]).findOne({ where: { email } });
        if ( !user ) return false;

        return bcrypt.compareSync(password, user.getPassword()) ? user : false;
    }

    /**
     * Validates if password matches specified regex.
     *
     * @param password
     */
    static async validatePassword(password: string): Promise<boolean> {
        const passwordRegex = /^(?=.*)(?=.*\d+)(?!.*\s).{8,}$/g;
        return passwordRegex.test(password);
    }

    /**
     * Associate User with other models.
     *
     * @param models
     */
    static associate<T extends ModelCtor<Model>>(models: { [key: string]: T }): void {
        User.belongsTo(models.UserRole, { foreignKey: 'userRole' });
        User.belongsToMany(
            models.Permission,
            {
                as: 'Permissions',
                through: 'bb_user_permissions',
                foreignKey: 'userId',
                otherKey: 'permissionId',
                timestamps: false
            }
        );
    }
}


export default sequelize => {

    User.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: { msg: 'Please provide valid e-mail address' },
                isUnique: email => {
                    return sequelize.models.User.count({ where: { email }, col: 'id' }).then(count => {
                        if ( count > 0 ) throw new Error('This e-mail address is already in use');
                    });
                }
            }
        },
        password: {
            type: DataTypes.STRING,
            set(value: string) {
                if ( value && value !== '' ) {
                    const salt = bcrypt.genSaltSync(10);
                    this.setDataValue('password', bcrypt.hashSync(value, salt));
                } else {
                    this.setDataValue('password', null);
                }
            }
        },
        name: DataTypes.STRING,
        lastName: DataTypes.STRING,
        userRole: {
            type: DataTypes.STRING,
            field: 'userRoleLabel',
            references: {
                key: 'label',
                model: sequelize.models.UserRole
            },
            allowNull: false,
            validate: {
                doesExist: (label: string) => {
                    return sequelize.models.UserRole.findByPk(label).then((userRole: UserRoleStatic) => {
                        if ( !userRole ) throw new Error('Given user role does not exist');
                    });
                }
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        resetToken: DataTypes.STRING
    }, {
        sequelize,
        tableName: 'bb_users',
        timestamps: true,
        paranoid: true,
        scopes: {
            withUserRole: (): object => {
                return {
                    include: {
                        model: sequelize.models.UserRole
                    }
                }
            },
            withPermissions: (): object => {
                return {
                    include: {
                        model: sequelize.models.Permission,
                        as: 'Permissions',
                        through: {
                            attributes: []
                        }
                    }
                }
            }
        }
    });

    return User;
}