
const env = {
    database: 'EmployeeDB',
    username: 'root',
    password: 'cst@2021',
    host: 'localhost',
    dialect: 'mysql',
    multipleStatements:true , //used for post request as we have multi input state in on line with ;
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  };
  module.exports = env;
  