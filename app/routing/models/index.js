module.exports = (sequelize, Sequelize) => {
  const Routing = sequelize.define ('routing', {
    function: {
      type: Sequelize.STRING,
    },
    path: {
      type: Sequelize.STRING,
    },
    requiredParams: {
        type: Sequelize.STRING,
    },
  });

  return Routing;
};
