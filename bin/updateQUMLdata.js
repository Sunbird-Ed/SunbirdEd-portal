'use strict'
const batchRequest = require('batch-request-js')
, path = require('path')
, constants = require( path.join(__dirname, '..', 'constants'))
, axios = require('axios')
, qs = require('querystring')
, fs = require('fs')
, chalk = require('chalk')
, log = console.log
, csvsync = require('csvsync')
, _ = require('lodash')
, upgradeUtil  = require(path.join(__dirname,  'upgradeQumlQuestion'))

function getDataFromCSV() {
    var csv = fs.readFileSync(constants.content_csv_file_rath);
    var data = csvsync.parse(csv,{skipHeader: false,
      returnObject: true,});
    return data
}

function getQumlQuestions() {
  if(constants.access_token_required){
    log(chalk.bold.yellow("Getting Access Token in updatequmldata"))
    const requestBody = {
        client_id: constants.clientId,
        username: constants.username,
        password: constants.password,
        grant_type: constants.grant_type,
    }
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    }
    axios.post(constants.authEndpointUrl, qs.stringify(requestBody), config).then((result) => {
      getQumlInBatch(result.data.access_token);
        })
        .catch((err) => {
            log(err)
        })

  } else {
    getQumlInBatch('');

  }
  
}

async function getQumlInBatch (access_token) {
  var row =getDataFromCSV()
  let qumlIds = []
  row.forEach(function (value) {
    qumlIds.push(_.split(value.questions,','))
  });
  qumlIds = _.uniq(_.flatten(qumlIds))
  const config = {
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '.concat(access_token)
    }
  }
  const API_ENDPOINT =  constants.kp_learning_service_base_path .concat("/assessment/v3/items/read")
  for(var i = 0 ; i < qumlIds.length ; i++){
    // log(qumlIds[i])
    axios.get(`${API_ENDPOINT}/${qumlIds[i]}`, config).then(response => {
      upgradeUtil.upgradeQumlQuestion(response.data.result)
    }).catch((error) => {
      log(chalk.red(JSON.stringify(error.response.data)))
    });
  }

  
  
  // const request = (qumlId) => axios.get(`${API_ENDPOINT}/${qumlId}`, config).then(response => {
  //   // log("assessment read response is"+ JSON.stringify(response.data.params))
  //   upgradeUtil.upgradeQumlQuestion(response.data.result)
  //   // log("item read API is")
    
  // })
  // .catch((error) => {
  //   // log(chalk.red(JSON.stringify(error.response.data)))
  // });

  // const {error, data } = await batchRequest(qumlIds, request, { batchSize: constants.batch_size, delay: constants.delay_between_request })
  // log(chalk.green(JSON.stringify(data))) 
  // log(chalk.red(error)) 
}

// getQumlQuestions()

exports.updateQumlQuestion = getQumlQuestions;