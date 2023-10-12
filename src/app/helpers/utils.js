const CONSTANTS = require("../helpers/constants");
const envVariables = require('./environmentVariablesHelper');

function defaultHost(envValue) {
    return envValue || CONSTANTS.LOCALHOST;
}
module.exports = { defaultHost, envVariables }