var mock = require('mock-require');
const mockEnv = {
  CRYPTO_ENCRYPTION_KEY: "8887a2bc869998be22221b9b1bb42555"
};
mock('../../../../helpers/environmentVariablesHelper', mockEnv);
const {expect} = require('chai');
const cryptoService = require('../../../../helpers/crypto');

describe('Crypto Test Cases', function () {

  it('should encrypt and decrypt data', function (done) {
    const dataToEncrypt = 'test';
    const encryptedData = cryptoService.encrypt(dataToEncrypt);
    const decryptedData = cryptoService.decrypt(encryptedData);
    expect(encryptedData).to.have.keys(['iv', 'encryptedData']);
    expect(decryptedData).to.eql(dataToEncrypt);
    done();
  });

});
