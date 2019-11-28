const jwt = require('jsonwebtoken');

/**
 *
 * @param accessToken
 * @returns {*}
 */
const getUserIdFromToken = (accessToken) => {
  var jwtPayload = jwt.decode(accessToken);
  if (jwtPayload && jwtPayload.sub) {
    var splittedSub = jwtPayload.sub.split(':');
    return splittedSub[splittedSub.length - 1]
  } else {
    // invalid JWT token
    return null;
  }
};

module.exports = {getUserIdFromToken};
