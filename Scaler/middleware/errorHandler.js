const { sendError } = require("../utils/responseHelper");

/**
 * @desc Global error-handling middleware.
 *       Catches unhandled errors from route handlers and returns a
 *       clean JSON response instead of leaking stack traces.
 */
const errorHandler = (err, req, res, _next) => {
  console.error(`[ERROR] ${err.message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  // Prisma known-error codes
  if (err.code === "P2002") {
    return sendError(res, {
      statusCode: 409,
      message: "A record with that unique value already exists.",
    });
  }

  if (err.code === "P2025") {
    return sendError(res, {
      statusCode: 404,
      message: "Record not found.",
    });
  }

  return sendError(res, {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;
