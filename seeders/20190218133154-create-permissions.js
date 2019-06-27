'use strict';

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert('bb_permissions', [{
            label: 'manage-translations',
            name: 'Manage translations'
        }]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete('bb_permissions', null, {});
    }
};
