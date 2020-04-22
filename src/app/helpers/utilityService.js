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

module.exports = {parseJson, delay, isDate, isValidAndNotEmptyString, isDateExpired};
