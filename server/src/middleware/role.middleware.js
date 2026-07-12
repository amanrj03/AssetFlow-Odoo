const { sendError } = require("../utils/response");
const Messages = require("../constants/messages");

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return sendError(res, Messages.AUTH.UNAUTHORIZED, 401);
    }

    if (!roles.includes(req.user.role)) {
      return sendError(res, Messages.AUTH.FORBIDDEN, 403);
    }

    next();
  };
};

module.exports = { authorize };
