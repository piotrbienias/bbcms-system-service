'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('bb_user_permissions', {
            userId: {
                type: Sequelize.INTEGER,
                references: {
                    model: 'bb_users',
                    key: 'id'
                },
                primaryKey: true,
                allowNull: false
            },
            permissionId: {
                type: Sequelize.STRING,
                references: {
                    model: 'bb_permissions',
                    key: 'label'
                },
                primaryKey: true,
                allowNull: false
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable('bb_user_permissions');
    }
};
