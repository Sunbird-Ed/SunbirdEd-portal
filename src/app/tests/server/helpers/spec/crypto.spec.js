var mock = require('mock-require');
const mockEnv = {
  CRYPTO_ENCRYPTION_KEY: "030702bc8696b8ee2aa71b9f13e4251e"
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
