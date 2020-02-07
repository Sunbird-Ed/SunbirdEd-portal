/**
 * description : Mock file for JSON web token (For lib `jsonwebtoken`)
 */

module.exports = {
  decode: (token) => {
    return {
      sub: token || 'token'
    }
  }
};
