// Nodejs encryption with CTR
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const envHelper = require('./environmentVariablesHelper');
const key = envHelper.CRYPTO_ENCRYPTION_KEY;
const iv = crypto.randomBytes(16);
const CONSTANTS = require('./constants');

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
 * Used for encryption of data without noise added
 * @param dataToEncrypt data to encrypt in string
 * @returns {string} encrypted string
 */
const encryptWithoutIv = (dataToEncrypt) => {
  const cipher = crypto.createCipher(algorithm, key);
  return cipher.update(dataToEncrypt, CONSTANTS.ENCODINGS.UTF8, CONSTANTS.ENCODINGS.HEX) + cipher.final(CONSTANTS.ENCODINGS.HEX);
};

/**
 * Data to decrypt without noise added
 * @param dataToDecrypt data to decrypt in string
 * @returns {string} decrypted string
 */
const decryptWithoutIv = (dataToDecrypt) => {
  const decipher = crypto.createDecipher(algorithm, key);
  return decipher.update(dataToDecrypt, CONSTANTS.ENCODINGS.HEX, CONSTANTS.ENCODINGS.UTF8) + decipher.final(CONSTANTS.ENCODINGS.UTF8);
};

module.exports = {
  decrypt,
  encrypt,
  encryptWithoutIv,
  decryptWithoutIv
};

