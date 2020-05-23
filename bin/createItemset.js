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
, { v4: uuidv4 } = require('uuid')
, updateContent  = require(path.join(__dirname,  'updateContent'))
, createCsvWriter = require('csv-writer').createObjectCsvWriter;
axios.defaults.timeout = 180000;

function getDataFromCSV(fromPath) {
    var csv = fs.readFileSync(fromPath);
    var data = csvsync.parse(csv,{skipHeader: false,
      returnObject: true,});
    //   log(data)
    return data
}

function getQumlQuestions(fromPath) {
  if(constants.access_token_required){
    log(chalk.bold.yellow('\n'+"Getting Access Token in createItemset"+'\n'))
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
      getQumlInBatch(result.data.access_token,fromPath);
        })
        .catch((err) => {
          log(chalk.red(JSON.stringify(err.response.data)))
        })

  } else {
    getQumlInBatch('',fromPath);
  }  
  
}

function getQumlInBatch (access_token,fromPath) {
  var row =getDataFromCSV(fromPath)
  var questionIdObjForItemset = []
  row.forEach(function (value) {
    let arrayOfQuestions = _.split(value.questions,',')
    value.questions = arrayOfQuestions
  });
   row.forEach(function(value){
        let questions = value.questions
        questions.forEach(function(value){
            questionIdObjForItemset.push({'identifier': value })
        })
        
          const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer '.concat(access_token)
            }
          }
          let requestBody = {
            "request": {
                "itemset": {
                    "code": uuidv4(),
                    "name": value.name,
                    "description": value.name,
                    "language": _.split(value.language),
                    "owner": value.author,
                    "items": questionIdObjForItemset
                }
            }
        }

      const API_ENDPOINT =  constants.kp_assessment_service_base_path .concat("/itemset/v3/create")
      axios.post(API_ENDPOINT, requestBody, config).then(response => {
        updateContent.updateContentWithItemSet(value.identifier, response.data.result.identifier, value.status, value.versionKey )
        }).catch( (err) => {
            itemSetCreationReport(value,err.response.data,"failed")
        });
   })

}

function itemSetCreationReport(value,apiStatus,repStatus) {
    const reportPath = constants.itemset_creation_result_csv_file_rath
    if(repStatus == "passed"){
         apiStatus = JSON.stringify(apiStatus)
    } else {
         apiStatus = JSON.stringify(apiStatus)
    }
    const csvWriter = createCsvWriter({
        path: reportPath,
        append: true, // Below header will not get added if this property is true, just to make a blank template make it false 
        header: [
            {id: 'identifier', title: 'contentIdentifier'},
            {id: 'questions', title: 'itemSetIdentifier'},
            {id: 'status', title: 'status'},
            {id: 'apiStatus', title: 'apistatus'}
        ]
    });
    const resultData = [{
        identifier: value.contentIdentifier,
        questions: value.questions,
        status:  repStatus + 'to create itemset',
        apiStatus: apiStatus
    }]
    csvWriter.writeRecords(resultData)       // returns a promise
    .then(() => {
        log(chalk.bold.green(' Itemset creation Report generated for '+ apiStatus ));
    }).catch((err) => { console.log(err)});
}

// getQumlQuestions()

exports.publishContent = getQumlQuestions;