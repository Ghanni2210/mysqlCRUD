const joi = require('joi');

const schemavalidate = {};

schemavalidate.mand_field_login = joi.object().keys({
  mobileEmail: joi.required().error(new Error('Mobile or email is required')),
  password: joi.required().error(new Error('Password is required')),
}).required();

module.exports = schemavalidate;
