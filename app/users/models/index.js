

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define('mst_user', {
    Employee_id: {
      type: Sequelize.INTEGER(4),
      primaryKey: true,
      autoIncrement: true, // Automatically gets converted to SERIAL for postgres
    },
    Name: {
      type: Sequelize.STRING(45),
      allowNull: false,
    },
    Employee_code: {
      type: Sequelize.STRING(12),
      allowNull: false,
      unique: true,
    },
    Salary: {
      type: Sequelize.STRING(45),
    }
  });

  return User;
};
