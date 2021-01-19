/* eslint linebreak-style: ["error", "windows"] */

const Sequelize = require('sequelize');
const env = require('./env.js');

// eslint-disable-next-line no-unused-vars
const opts = {
  define: {
    // prevent sequelize from pluralizing table names
    freezeTableName: true,
  },
};
const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
  define: {
    freezeTableName: true,
  },

  pool: {
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Models/tables
db.routing = require('../app/routing/models/index.js')(sequelize, Sequelize);
db.accesscontrol = require('../app/accesscontrol/models/index.js')(sequelize, Sequelize);
db.users = require('../app/users/models/index.js')(sequelize, Sequelize);


module.exports = db;
