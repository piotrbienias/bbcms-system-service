/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import * as dotenv from 'dotenv';


dotenv.config();


module.exports = {
    development: {
        username: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
        database: process.env['DB_NAME'],
        host: process.env['DB_HOST'],
        dialect: process.env['DB_DIALECT']
    },
    staging: {
        username: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
        database: process.env['DB_NAME'],
        host: process.env['DB_HOST'],
        dialect: process.env['DB_DIALECT'],
        logging: false
    },
    test: {
        username: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
        database: process.env['DB_NAME'],
        host: process.env['DB_HOST'],
        dialect: process.env['DB_DIALECT'],
        logging: false
    },
    production: {
        username: process.env['DB_USER'],
        password: process.env['DB_PASSWORD'],
        database: process.env['DB_NAME'],
        host: process.env['DB_HOST'],
        dialect: process.env['DB_DIALECT']
    }
};