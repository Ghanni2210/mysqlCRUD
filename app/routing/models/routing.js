const RoutingModel = require('./index');
const _ = require('underscore');
const db = require(ROOT_DIR + '/config/connection.js');
const Routing = db.routing;
const errorModel = require(ROOT_DIR + '/lib/error');
const errorObj = new errorModel();

class RoutingsManager {
  constructor() {}

  async findById(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {
        let data = reqObj.body;
        let routingData = await RoutingModel.findById(data.routingId);
        if (routingData) {
          resolve(routingData);
        } else {
          reject('no Routing found.');
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
        Routing.create(data).then(routing => {
          resolve(routing);
        });
      } catch (err) {
        let errResp = await errorObj.errorHander('', err);
        reject(errResp);
      }
    });
  }
}

module.exports = RoutingsManager;
