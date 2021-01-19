const routing = require('../models/routing');

const routingManager = new routing();

exports.findById = async (req, res) => {
  const routingData = await routingManager.findById(req).catch((err) => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.json(routingData);
};

exports.create = async (req, res) => {
  const routingData = await routingManager.create(req).catch((err) => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.json(routingData);
};
