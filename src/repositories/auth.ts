/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import { Service, Token } from 'typedi';
import { User } from '../models/user';
import { Auth as AuthTypes } from '../utils/types';


export const AuthRepositoryImpl = new Token<AuthTypes.RepositoryInterface>();


@Service(AuthRepositoryImpl)
class AuthRepository implements AuthTypes.RepositoryInterface {

    /**
     * Verifies if given password matches password of user with given username.
     *
     * @param email
     * @param password
     */
    async verifyUserPassword(email: string, password: string): Promise<User> {
        if ( !email || !password ) throw new Error('`email` and `password` are required');

        let isPasswordValid = await User.verifyPassword(email, password);
        if ( !isPasswordValid ) throw new Error('Wrong email or password');

        let user: User = await User.findOne({ where: { email } });

        if ( !user.isActive ) throw new Error('Your account is blocked!');

        return user;
    }

}


export default AuthRepository;