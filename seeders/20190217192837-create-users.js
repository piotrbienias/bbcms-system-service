/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('bb_users', [{
            email: 'admin@example.com',
            password: bcrypt.hashSync('password', bcrypt.genSaltSync(10)),
            name: 'Name',
            lastName: 'Last Name',
            userRoleLabel: 'administrator',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            email: 'redaktor@example.com',
            password: bcrypt.hashSync('password', bcrypt.genSaltSync(10)),
            name: 'Redaktor',
            lastName: null,
            userRoleLabel: 'redaktor',
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            email: 'user@example.com',
            password: bcrypt.hashSync('password', bcrypt.genSaltSync(10)),
            name: 'User',
            userRoleLabel: 'redaktor',
            createdAt: new Date(),
            updatedAt: new Date()
        }]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('bb_users', null, {});
    }
};
