/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';


module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('bb_user_roles', {
            label: {
                primaryKey: true,
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('bb_user_roles');
    }
};
