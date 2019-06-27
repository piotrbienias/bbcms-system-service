/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('bb_user_roles', [{
            name: 'Administrator',
            label: 'administrator'
        }, {
            name: 'Redaktor',
            label: 'redaktor'
        }]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('bb_user_roles', null, {});
    }
};
