const request = require('request-promise');
const fs = require('fs');
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const envHelper = require('./environmentVariablesHelper.js');
const experimentBlobUrl = 'http://localhost:3001/dist_experiment/';

const getExperimentIndexFile = async (req, res) => {
  let indexFilePath, indexFileData, experimentId, experimentDetails;
  console.log('----------query and path---------------', req.query, req.path);
  if(req.query.experimentId){
    experimentDetails = {experimentId: req.query.experimentId};
  } else {
    experimentDetails = await fetchExperimentDetails(req);
  }
  console.log('----experimentDetails----', experimentDetails);
  indexFileData = await request.get(`${experimentBlobUrl}${experimentDetails.experimentId}/index.html`)
    .catch(error => console.log('--------------fetching index file failed----------------------'))
  return { path: indexFilePath, data: indexFileData, redirectionParam: { experimentId } };
}
const fetchExperimentDetails = async (req) => {
  const requestBody = {
    id: envHelper.APPID,
    ver: packageObj.version,
    ts: moment().format(),
    params: {
      msgid: uuidv1()
    },
    request: {
      // did: req.session.deviceId,
      uid: req.session.userId,
    }
  }
  if(req.session.userId === '874ed8a5-782e-4f6c-8f36-e0288455901e') {
    return Promise.resolve({ experimentId: 'experiment5'})
  } else if (req.session.userId === '874ed8a5-782e-4f6c-8f36-e0288455901e') {
    return Promise.resolve({ experimentId: 'experiment5'})
  } else {
    return Promise.resolve({ experimentId: 'experiment5'})
  }
}
const mockDeviceRegister = async (req) => {
  console.log('device register', req.body.request.url);
  if(req.body.request.url === '/ap/explore') {
    return Promise.resolve({ experimentId: 'experiment1'})
  } else if (req.body.request.url === '/rj/explore') {
    return Promise.resolve({ experimentId: 'experiment2'})
  } else {
    return Promise.resolve({})
  }
}
module.exports = {
  getExperimentIndexFile,
  fetchExperimentDetails,
  mockDeviceRegister
}