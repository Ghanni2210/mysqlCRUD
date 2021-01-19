module.exports = (sequelize, Sequelize) => {
  const AccessControl = sequelize.define ('AccessControl', {
    roleId: {
      type: Sequelize.INTEGER,
    },
    functionId: {
      type: Sequelize.INTEGER,
    }
  });

  return AccessControl;
};
