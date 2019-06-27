/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import { UserInterface } from '@system/models/user';
import { UserRoleInterface } from '@system/models/userRole';


/**
 * Verify if user role is one of specified roles.
 *
 * @param user
 * @param roles
 */
export const checkUserRole = (user: UserInterface, roles: string[]): boolean => {

    return (user && user.userRole && roles.includes((user.userRole as UserRoleInterface).label));

};


/**
 * Verify if user has specified permission.
 *
 * @param user
 * @param permission
 */
export const checkUserPermission = (user: UserInterface, permission: string): boolean => {

    return (user && Array.isArray(user.permissions) && user.permissions.includes(permission));

};