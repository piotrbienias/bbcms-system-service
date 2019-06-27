/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

require('module-alias/register');

import 'reflect-metadata';

import * as dotenv from 'dotenv';

dotenv.config();

import './config/models';

import express from 'express';
import { Container } from 'typedi';

import UserRouter from './routers/user';
import UserRoleRouter from './routers/userRole';
import AuthRouter from './routers/auth';
import PermissionRouter from './routers/permission';


const systemService = express();

const userRouter        = Container.get(UserRouter);
const userRoleRouter    = Container.get(UserRoleRouter);
const authRouter        = Container.get(AuthRouter);
const permissionRouter  = Container.get(PermissionRouter);


systemService.use('/system/users',          userRouter.getRouter());
systemService.use('/system/user-roles',     userRoleRouter.getRouter());
systemService.use('/system/auth',           authRouter.getRouter());
systemService.use('/system/permissions',    permissionRouter.getRouter());


systemService.listen(process.env.PORT, () => {
    console.log(`System service is listening on port ${process.env.PORT}`);
});