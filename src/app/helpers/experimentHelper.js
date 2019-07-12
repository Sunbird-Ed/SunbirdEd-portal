const request = require('request-promise');
const fs = require('fs');
const packageObj = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const envHelper = require('./environmentVariablesHelper.js');
const experimentBaseUrl = envHelper.EXPERIMENT_BASE_URL;
const portalDeviceId = '2c010e13a76145d864e459f75a176171';
const _ = require('lodash');

const getExperimentIndexFile = async (req) => {
  let indexFilePath, indexFile, experimentDetails;
  if(!experimentBaseUrl){
    return;
  }
  experimentDetails = req.query.experimentDetails ? req.query.experimentDetails
    : await fetchExperimentDetails(req);
  if(!experimentDetails) {
    return;
  }
  indexFilePath = `${experimentBaseUrl}${experimentDetails.id}/`;
  indexFile = await request.get(indexFilePath + 'index.html')
    .catch(error => console.log('fetching experiment app failed'))
  return { path: indexFilePath, data: indexFile };
}
const fetchExperimentDetails = async (req) => {
  const options = {
    method: 'POST',
    url: envHelper.DEVICE_REGISTER_API + portalDeviceId,
    headers: {},
    body: {
      id: envHelper.APPID,
      ver: packageObj.version,
      ts: moment().format(),
      params: {
        msgid: uuidv1()
      },
      request: {
        did: portalDeviceId,
        ext: {
          userid: req.session.userId,
        }
      }
    },
    json: true
  }
  return request(options).then(data => {
    if(!_.get(data, 'result.actions.length')){
      return
    }
    const experimentDetails = data.result.actions.find(action => action.type === 'experiment')
    return experimentDetails.data
  }).catch(error => {
    console.log('fetching device register api failed', error.message);
  })
}

module.exports = {
  getExperimentIndexFile
}
