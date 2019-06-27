'use strict';


module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('bb_permissions', {
            label: {
                type: Sequelize.STRING,
                primaryKey: true,
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
        return queryInterface.dropTable('bb_permissions');
    }
};