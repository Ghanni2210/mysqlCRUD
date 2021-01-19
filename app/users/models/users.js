const errorModel = require(ROOT_DIR + '/lib/error');

const errorObj = new errorModel();
const Constants = require(ROOT_DIR + '/Constants.js');

const db = require(ROOT_DIR + '/config/connection.js');
const User = db.users;
const winston = require(ROOT_DIR + '/winstonlog.js');
const bcrypt = require('bcrypt');
const sequelize = require('sequelize');
const config = require('config');

const Op = sequelize.Op;
const appSecret = config.get('app.secret');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const util = require('../../../util');
const authManager = require('./../../auth/auth');
const validschema = require('../validation/validationSchema');

class UsersManager {
  constructor() { }

  // Not in use for now
  async create(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = reqObj.body;
        // const pass = data.password;
        // const hashpwd = await bcrypt.hashSync(pass, config.get('app.saltRounds'));
        User.create({
          Employee_id:data.Employee_id,
          Name: data.Name,
          Employee_code: data.Employee_code,
          Salary: data.Salary
        }).then((User) => {
          // Send created customer to client
          resolve(User);
        });
      } catch (err) {
        const errResp = await errorObj.errorHander('', err);
        reject(errResp);
      }
    });
  }

  async login(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = reqObj.body;
        const { mobileEmail } = data;
        const options = {
          allowUnknown: true,
        };

        const check = joi.validate(data, validschema.mand_field_login, options);
        if (check.error) { // Joi validation for mand field
          const errmsg = 'In User.login joi(json schema) validation fail Error=>  ' + check.error.message;
          const error = await errorObj.errorHander(Constants.statusOK_code, Constants.statusmandatory_code, new Error(check.error.message), errmsg, err.stack);
          reject(error);
        } else {
          const userData = await db.sequelize.query(`select mu.user_id, mu.user_name, mu.user_mob, mu.user_email, mu.user_img_path, mu.role_id, mu.comp_id, mu.user_fcm,
          mu.address, mu.password, mr.role_name from mst_user mu, mst_role mr where mr.role_id=mu.role_id and (user_mob=$mobileEmail or user_email=$mobileEmail) 
          and mu.is_active=$is_active`, { // Fetching userdata
            bind: {
              mobileEmail, is_active: Constants.active,
            },
            type: sequelize.QueryTypes.SELECT,
          }).catch(async (err) => {
            const errmsg = `Error ocurred in user.login while querying user with mobileEmail ${mobileEmail}`;
            const error = await errorObj.errorHander(Constants.statusOK_code, Constants.statusfail_code, new Error(Constants.fail_msg), errmsg, err.stack);
            reject(error);
          });
          if (userData.length > 0) { // Checking userdata exist or not
            const correctPass = await bcrypt.compareSync(data.password, userData[0].password);// bcrypt Comparing password with hashpwd
            if (correctPass) { // return true if matched or else return false
              winston.info(`${mobileEmail} logged in with valid password but token is yet to be generated`);
              delete userData[0].password; // Not required fields
              delete userData[0].createdAt;
              delete userData[0].updatedAt;
              delete userData[0].user_otp;
              const token = await authManager.generateToken(userData[0], {});// Token generation
              // eslint-disable-next-line vars-on-top
              const roleindex = roleDetails.findIndex(obj => obj.role_name === reqObj.headers.module);
              if (roleindex !== 1) {
                userData[0].access_rights = roleDetails[roleindex].role_access;// users right
              }
              userData[0].token = token;

              winston.info(`In login Token generated for ${mobileEmail}`);
              const resp = {
                status: Constants.statusOK_code,
                data: {
                  API_status: Constants.statusOK_code,
                  API_message: Constants.statusOK_msg,
                  API_URL: '',
                  API_data: userData[0],
                },
              };
              resolve(resp);// response send back from api
            } else {
              const errmsg = mobileEmail + '  was invalid user(Password not matched)';
              const error = await errorObj.errorHander(Constants.statusOK_code, Constants.statusinvaliduser_code, new Error(Constants.Invalid_user_msg), errmsg, null);
              reject(error);
            }
          } else {
            const errmsg = mobileEmail + '  was invalid user(User does not exist) ';
            const error = await errorObj.errorHander(Constants.statusOK_code, Constants.statusinvaliduser_code, new Error(Constants.Invalid_user_msg), errmsg, null);
            reject(error);
          }
        }
      } catch (err) {
        const errmsg = `Login Some error occured for user :${reqObj.body.mobileEmail}`;
        const error = await errorObj.errorHander(Constants.statusOK_code, Constants.statusissue_code, new Error(Constants.issue_msg), errmsg, err.stack);
        reject(error);
      }
    });
  }

  async forgotpwd(reqObj) {
    return new Promise(async (resolve, reject) => {
      try {
        const data = reqObj.body;
        const mobileEmail = data.mobileEmail;
        if (!mobileEmail) {
          winston.info('Entered Empty value for email/mobile in user.forgotpwd');
          const error = await errorObj.errorHander(Constants.statusmandatory, new Error(Constants.mandatory));
          reject(error);
        }
        const userData = await User.findOne({
          where: {
            [Op.or]: [{ user_mob: mobileEmail }, { user_email: mobileEmail }],
            [Op.and]: [{ is_active: Constants.active }],
          },
        });

        if (userData) {
          winston.info(mobileEmail, ' found data in user.forgotpwd');
          const otp = Math.floor(1000 + Math.random() * 9000);
          if (userData.dataValues.user_email) {
            const otpupdate = await User.update(
              { user_otp: otp },
              { where: { [Op.or]: [{ user_mob: mobileEmail }, { user_email: mobileEmail }] } },
            );
            winston.log('In user.forgotpassword Otp generated for ', mobileEmail);
            if (otpupdate[0] > 0) {
              let { otp_msg } = Constants;
              otp_msg = otp_msg.replace('<<otp>>', otp);
              otp_msg = otp_msg.replace('<<user>>', userData.dataValues.last_name);
              const statusmail = await util.sendMail(userData.dataValues.user_email, Constants.otp, otp_msg);

              if (statusmail.accepted.length > 0) {
                winston.info(`In user.forgotpassword Mail with otp was sent to email ${mobileEmail}`);
                const resp = { status: Constants.statusOK_code, message: Constants.statusOK_msg };
                resolve(resp);
              } else {
                winston.info(`In user.forgotpassword Unable to send email to ${mobileEmail}`);
                const error = await errorObj.errorHander(Constants.statusfail, new Error(Constants.fail));
                reject(error);
              }
            } else {
              winston.info('Something went wrong while updating otp in user.forgotpassword ', mobileEmail);
              const error = await errorObj.errorHander(Constants.statusfail, new Error(Constants.fail));
              reject(error);
            }
          }
          // TODO - send OTP to mobile
        } else {
          winston.info(mobileEmail, '  was invalid user in users.forgotpassword');
          const error = await errorObj.errorHander(Constants.statusinvaliduser, new Error(Constants.Invalid_user));
          reject(error);
        }
      } catch (err) {
        winston.error(`Some error occured in forgotpwd for mobile/email ${reqObj.body.mobileEmail} ---- `, err);
        const error = await errorObj.errorHander(Constants.statusissue, new Error(Constants.issue));
        reject(error);
      }
    });
  }
  }


module.exports = UsersManager;
