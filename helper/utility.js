/*
Name: Utility
Description: This file consists of the utility functions
Authors: Keshav Goyal
Created: September 4, 2023
*/
const crypto = require('crypto'), algorithm = 'aes-256-ctr', password = 'd6F3Efeq';
const logger = require('./logger')
const { ApplicationError, ErrorCodes, UserError, NotFoundError, NotAuthorizedError, InternalError, ForbiddenError, NotImplementedError, ConflictError, PayloadTooLargeError } = require('./errors');

var main = {}


main.successBody = (obj) => {
  return {
    status: 1,
    code: ErrorCodes.ERR_NONE,
    message: obj.message || 'success',
    data: {
      ...obj
    }
  };
};

main.runAsyncWrapper = (callback) => {
  return function (req, res, next) {
    callback(req, res, next)
      .catch(next)
  }
}


main.errorBody = (err, obj = {}) => {
  if (err instanceof ApplicationError) {
    return {
      status: 0,
      code: err.code,
      message: err.message,
      data: {
        ...obj
      }
    };
  } else if (err instanceof Error) {
    return {
      status: 0,
      code: ErrorCodes.ERR_BAD_REQUEST,
      message: err.message,
      ...obj
    };
  } else {
    return {
      status: 0,
      code: ErrorCodes.ERR_BAD_REQUEST,
      message: err,
      ...obj
    }
  };
}

main.sha512 = function(password, salt = ''){
  salt = salt != '' ? salt : 'LittleGuys@$56!#'; /** Gives us salt of length 16 */
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  console.log("PASSWORD: ", password);
  hash.update(password);
  var passwordHash = hash.digest('hex');

  return passwordHash;
};



module.exports=main