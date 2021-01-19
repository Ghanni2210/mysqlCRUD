const user = require('../models/users');

const userManager = new user();

exports.findById = async (req, res) => {
  const userData = await userManager.findById(req).catch((err) => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.json(userData);
};

exports.create = async (req, res) => {
  const userData = await userManager.create(req).catch((err) => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.set({ 'Access-Token': userData.token });
  res.json(userData.userData);
};

exports.update = async (req, res) => {
  const userData = await userManager.update(req).catch((err) => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.json(userData);
};


exports.delete = async (req, res) => {
  const userData = await userManager.delete(req).catch((err) => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.json(userData);
};

