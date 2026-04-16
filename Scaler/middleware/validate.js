const { validationResult } = require("express-validator");
const { sendError } = require("../utils/responseHelper");

/**
 * @desc Middleware that checks express-validator results.
 *       If validation fails, returns 400 with an array of error messages.
 */
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendError(res, {
      statusCode: 400,
      message: "Validation failed",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
};

module.exports = validate;
