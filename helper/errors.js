/**
 * @class       : errors
 * @author      : Keshav Goyal (keshav.goyal@kritikalvision.ai)
 * @created     : Tuesday August 29, 2023
 * @description : errors
 */

const ErrorCodes = {
  ERR_NONE                  : 'ERR_NONE',
  ERR_INTERNAL              : 'ERR_INTERNAL',
  ERR_BAD_REQUEST           : 'ERR_BAD_REQUEST',
  ERR_NOT_FOUND             : 'ERR_NOT_FOUND',
  ERR_NOT_AUTHORIZED        : 'ERR_NOT_AUTHORIZED',
  ERR_NOT_IMPLEMENTED       : 'ERR_NOT_IMPLEMENTED',
  ERR_FORBIDDEN             : 'ERR_FORBIDDEN',
  ERR_VALIDATION            : 'ERR_VALIDATION',
  ERR_DATABASE              : 'ERR_DATABASE',
  ERR_DATABASE_TIMEOUT      : 'ERR_DATABASE_TIMEOUT',
  ERR_ACCESS_TOKEN_EXPIRED  : 'ERR_ACCESS_TOKEN_EXPIRED',
  ERR_REFRESH_TOKEN_EXPIRED : 'ERR_REFRESH_TOKEN_EXPIRED',
  ERR_PAYLOAD_TOO_LARGE     : 'ERR_PAYLOAD_TOO_LARGE',
  ERR_CONFLICT              : 'ERR_CONFLICT',
};

class ApplicationError extends Error {
  constructor(code, message, httpCode = 400) {
    super(message);
    this._code = code;
    this._httpCode = httpCode;
  }

  get code() {
    return this._code;
  }
  get httpCode() {
    return this._httpCode;
  }
}

class InternalError extends ApplicationError {
  constructor(message, code = ErrorCodes.ERR_INTERNAL, httpCode = 500) {
    super(code, message, httpCode);
  }
}

class UserError extends ApplicationError {
  constructor(message, code = ErrorCodes.ERR_BAD_REQUEST, httpCode = 400) {
    super(code, message, httpCode);
  }
}

class NotAuthorizedError extends UserError {
  constructor(message = 'Not authorized', code = ErrorCodes.ERR_NOT_AUTHORIZED) {
    super(message, code, 401);
  }
}

class ForbiddenError extends UserError {
  constructor(message = 'Forbidden') {
    super(message, ErrorCodes.ERR_FORBIDDEN, 403);
  }
}

class NotImplementedError extends UserError {
  constructor(message = 'Not implemented') {
    super(message, ErrorCodes.ERR_NOT_IMPLEMENTED, 501);
  }
}

class NotFoundError extends UserError {
  constructor(message = 'Not found') {
    super(message, ErrorCodes.ERR_NOT_FOUND, 404);
  }
}

class PayloadTooLargeError extends UserError {
  constructor(message = 'File size is too large') {
    super(message, ErrorCodes.ERR_PAYLOAD_TOO_LARGE, 413);
  }
}

class ConflictError extends UserError {
  constructor(message = 'Duplicate found') {
    super(message, ErrorCodes.ERR_CONFLICT, 409);
  }
}

exports.ErrorCodes = ErrorCodes;
exports.ApplicationError = ApplicationError;
exports.InternalError = InternalError;
exports.UserError = UserError;
exports.NotAuthorizedError = NotAuthorizedError;
exports.ForbiddenError = ForbiddenError;
exports.NotImplementedError = NotImplementedError;
exports.NotFoundError = NotFoundError;
exports.PayloadTooLargeError = PayloadTooLargeError;
exports.ConflictError = ConflictError;
