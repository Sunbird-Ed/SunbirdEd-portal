const httpMocks = require('node-mocks-http');


/* To construct request body with given configuration */
function constructReqBody(config) {
  return httpMocks.createRequest(config);
}


function getResponseObject() {
  return httpMocks.createResponse({
    eventEmitter: require('events').EventEmitter
  });
}

module.exports = {
  constructReqBody: constructReqBody,
  getResponseObject: getResponseObject
};
