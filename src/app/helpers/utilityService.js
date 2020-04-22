const { encrypt, decrypt } = require('../helpers/crypto');
const _ = require('lodash');
/**
 * Parses string to object
 * @param string
 * @returns {boolean|any}
 */
const parseJson = (string) => {
  try {
    return JSON.parse(string)
  } catch (e) {
    return false;
  }
};

/**
 * Returns a resolved promise after duration mentioned
 * @param duration delay in duration default value is 1000 mili sec
 * @returns {Promise<any>}
 */
const delay = (duration = 1000) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, duration)
  });
};

/***
 * Checks and returns boolean if based on valid string or not
 * @param value Any value to check if it is valid string or not
 * @returns {boolean}
 */
const isValidAndNotEmptyString = (value) => {
  return typeof value === "string" && value.length > 0;
};

/**
 * Checks if value is valid date
 * @param date
 * @returns {boolean}
 */
var isDate = function (date) {
  return (new Date(date) !== "Invalid Date" && !isNaN(new Date(date))) ? true : false;
};

/**
 * Checks 2 dates and returns true if todate > fromdate
 * @param toDate
 * @param fromDate optional:
 * @returns {boolean}
 */
const isDateExpired = function (toDate, fromDate = Date.now()) {
  let expDate = new Date(0);
  expDate.setUTCMilliseconds(toDate);
  let exp = expDate.getTime();
  return isDate(exp) && !(exp > fromDate);
};

/**
  * To generate session for state user logins
  * using server's time as iat and exp time as 5 min
  * Session will not be created if exp is expired
  * @param data object to encrypt data
  * @returns {string}
  */
const getEncyptedQueryParams = (data) => {
  data.exp = Date.now() + (5 * 60 * 1000);  // adding 5 minutes
  return JSON.stringify(encrypt(JSON.stringify(data)));
};

/**
* Verifies request and check exp time
* @param encryptedData encrypted data to be decrypted
* @returns {*}
*/
const isValidRequest = (encryptedData) => {
  const decryptedData = decrypt(parseJson(decodeURIComponent(encryptedData)));
  const parsedData = parseJson(decryptedData);
  if (isDateExpired(parsedData.exp)) {
    throw new Error('DATE_EXPIRED');
  } else {
    return _.omit(parsedData, ['exp']);
  }
};

module.exports = { parseJson, delay, isDate, 
  isValidAndNotEmptyString, isDateExpired, 
  getEncyptedQueryParams, isValidRequest};
