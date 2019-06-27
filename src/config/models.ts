/*
 * Author: Piotr Bienias
 * Project: bbcms
 * Copyright (c) 2019.
 */

'use strict';

import * as fs from 'fs';
import * as path from 'path';
import { Sequelize } from 'sequelize';

const configObject = require('./database');

const env = process.env.NODE_ENV || 'development';
let config = configObject[env];


let db: any = {};


let sequelize: Sequelize;
if ( config['use_env_variable'] ) {
    sequelize = new Sequelize(process.env[config['use_env_variable']], config);
} else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Include all service models
const modelsPath = path.resolve(__dirname, '..', 'models');
fs.readdirSync(modelsPath).forEach(modelFile => {
    if ( modelFile && !modelFile.startsWith('.') ) {
        const modelFunc = require(path.join(modelsPath, modelFile))['default'];

        if ( modelFunc && typeof modelFunc === 'function' ) {
            const model = modelFunc(sequelize);
            db[model.name] = model;
        }
    }
});

Object.keys(db).forEach(modelName => {
    if ( db[modelName].associate && typeof db[modelName].associate === 'function' ) {
        db[modelName].associate(db);
    }
});


db.sequelize = sequelize;


export default db;