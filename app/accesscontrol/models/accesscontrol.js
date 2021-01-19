const accessControlModel = require('./index');
const _ = require('underscore');
const db = require(ROOT_DIR + '/config/connection.js');
const accessControls = db.accesscontrol;
const errorModel = require(ROOT_DIR + '/lib/error');
const errorObj = new errorModel();

class accessControlsManager {
  constructor() {}

  async findById(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = reqObj.body;
        let accessControlData = await accessControlModel.findById(data.accessControlId);
        if (accessControlData) {
          resolve(accessControlData);
        } else {
          reject('no accessControl found.');
        }
      } catch (err) {
        let errResp = await errorObj.errorHander('', err);
        reject(errResp);
      }
    });
  }

  async create(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = reqObj.body;
        accessControls.create(data).then(accessControl => {
          resolve(accessControl);
        });
      } catch (err) {
        let errResp = await errorObj.errorHander('', err);
        reject(errResp);
      }
    });
  }
}

module.exports = accessControlsManager;
