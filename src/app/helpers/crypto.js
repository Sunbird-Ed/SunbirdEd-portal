// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const envHelper = require('./environmentVariablesHelper');
const key = envHelper.CRYPTO_ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);

/**
 * Encrypts the data and return encrypted data with iv
 * @param text string to encypt the data
 * @returns {{encryptedData: string, iv: string}}
 */
const encrypt = (text) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {iv: iv.toString('hex'), encryptedData: encrypted.toString('hex')};
};

/**
 * decrypts the data and returns back decrypted data
 * @param text string to decrypt with the iv key
 * @returns {string}
 */
const decrypt = (text) => {
  console.log('object to decrypt', JSON.stringify(text));
  console.log('encryption key', key);
  let iv = Buffer.from(text.iv, 'hex');
  console.log('iv captured', iv);
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

/**
  * To generate session for state user logins
  * using server's time as iat and exp time as 5 min
  * Session will not be created if exp is expired
  * @param data object to encrypt data
  * @returns {string}
  */
 const encriptWithTime = (data, timeInMin) => {
  data.exp = Date.now() + (timeInMin * 60 * 1000);  // adding 5 minutes
  return JSON.stringify(encrypt(JSON.stringify(data)));
};


module.exports = {
  decrypt,
  encrypt,
  encriptWithTime,
};

