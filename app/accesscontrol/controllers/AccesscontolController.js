let accesscontrol =  require('../models/accesscontrol');
let accesscontrolManager = new accesscontrol();

exports.findById = async (req, res) => {

  let accesscontrol = await accesscontrolManager.findById(req).catch(err => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.json(accesscontrol);
};

exports.create = async (req, res) => {

  let accesscontrol = await accesscontrolManager.create(req).catch(err => {
    res.status(err.respHeadersStatus).json(err.respParams);
  });
  res.json(accesscontrol);
};

