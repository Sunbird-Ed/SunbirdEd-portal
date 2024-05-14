'use strict';
/**
 * @file - Handle logs for the features of Portal API(s)
 * @since release-8.0.0
 * @version 1.0
 */

const _ = require('lodash');
const { pathToRegexp } = require("path-to-regexp");
const API_LIST = require('./whitelistApis.js');
/**
 * @description - Function to check whether
 * 1. Incoming API is having feature id (or) not
 * 2. If API does not exists then normal flow is contiued
 * 3. If incoming API is present in API_LIST ; then check URL pattern matching and add feature id to req for corresponding API
 * 4. Refer `API_LIST` 
 * @since release-8.0.0
 */
const mapFeature = () => {
  return function (req, res, next) {
    let REQ_URL = req.path;

    _.forEach(API_LIST.URL_PATTERN, (url) => {
      let regExp = pathToRegexp(url);
      if (regExp.test(REQ_URL)) {
        REQ_URL = url;
        return false;
      }
    });
    if (_.get(API_LIST.URL, REQ_URL)) {
      req.featureName = API_LIST.URL[REQ_URL]['featureName'] || null; // Return the mapping value or null if not found
      next();
    }
    else next();
  }
};

module.exports = {
  mapFeature
};
