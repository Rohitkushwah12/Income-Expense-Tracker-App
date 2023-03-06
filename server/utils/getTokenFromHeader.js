const getTokenFromHeader = (req) => {
  // Get the token from the request headers
  const headerObj = req.headers;
  const token = headerObj["authorization"].split(" ")[1];
  if (token !== undefined) {
    return token;
  } else {
    return {
      status: "failed",
      message: "There is no token attached to request header",
    };
  }
};
module.exports = getTokenFromHeader;
