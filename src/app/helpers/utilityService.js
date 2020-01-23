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

module.exports = {parseJson, delay};
