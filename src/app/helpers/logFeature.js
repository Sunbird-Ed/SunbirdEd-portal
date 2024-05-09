'use strict';
/**
 * @file - Handle logs for the features of Portal API(s)
 * @since release-8.0.0
 * @version 1.0
 */

const _ = require('lodash');
const { pathToRegexp } = require("path-to-regexp");
const { API_LIST, getMappingValue } = require('./whitelistApis.js');
/**
 * @description - Function to check whether
 * 1. Incoming API is having feature id (or) not
 * 2. If API does not exists then normal flow is contiued
 * 3. If incoming API is present in API_LIST ; then check URL pattern matching and add telemetry log for the feature
 * 4. Refer `API_LIST` 
 * @since release-8.0.0
 */
const mapFeature = () => {
  return function (req, res, next) {
    let REQ_URL = req.path;
    req.originalUrl = REQ_URL

    _.forEach(API_LIST.URL_PATTERN, (url) => {
      let regExp = pathToRegexp(url);
      if (regExp.test(REQ_URL)) {
        REQ_URL = url;
        return false;
      }
    });
    if (_.get(API_LIST.URL, REQ_URL)) {
      let mappingValue = getMappingValue(REQ_URL);
      req.feature = mappingValue
      next();
    }
    else next();
  }
};

module.exports = {
  mapFeature
};
