const getTokenFromHeader = require("../utils/getTokenFromHeader");
const verifyToken = require("../utils/verifyToken");
const { appErr } = require("../utils/appErr");
const isLogin = (req, res, next) => {
  //get token from header
  const token = getTokenFromHeader(req);
  //verify token
  const decodedUser = verifyToken(token);
  //save the user into req obj
  req.user = decodedUser.id;
  if (!decodedUser) {
    return next(appErr("Invalid/Expired Token, Please login again", 401));
  }
  next();
};

module.exports = isLogin;
