'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('bb_user_permissions', [{
            userId: 1,
            permissionId: 'manage-translations'
        }, {
            userId: 2,
            permissionId: 'manage-translations'
        }]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('bb_user_permissions', null, {});
    }
};
