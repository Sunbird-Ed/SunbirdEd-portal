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

function getDataFromCSV() {
    var csv = fs.readFileSync(constants.content_csv_file_rath);
    var data = csvsync.parse(csv,{skipHeader: false,
      returnObject: true,});
    //   log(data)
    return data
}

function getQumlQuestions() {
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
      getQumlInBatch(result.data.access_token);
        })
        .catch((err) => {
          log(chalk.red(JSON.stringify(err.response.data)))
        })

  } else {
    getQumlInBatch('');
  }  
  
}

function getQumlInBatch (access_token) {
  var row =getDataFromCSV()
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
           log('Request endpoint is' + API_ENDPOINT +" request body is " + JSON.stringify(requestBody) + 'with headers '+ JSON.stringify(config)) 
          axios.post(API_ENDPOINT, requestBody, config).then((result) => {
            log("\n"+"itemset response is"+ JSON.stringify(result.data.result)+"\n")
            updateContent.updateContentWithItemSet(value.identifier, result.data.result.identifier, value.status, value.versionKey )
            }).catch((err) => {
                log('Itemset Failed with: ' +chalk.red(JSON.stringify(error.response.data)))
                failedItemSetToContentReport(value)
            })
   })

}

function failedItemSetToContentReport(value) {
    const csvWriter = createCsvWriter({
        path: constants.failed_itemset_creation_result_csv_file_rath,
        append: true, // Below header will not get added if this property is true, just to make a blank template make it false 
        header: [
            {id: 'identifier', title: 'contentIdentifier'},
            {id: 'questions', title: 'itemSetIdentifier'},
            {id: 'program', title: 'contentStatus'},
            {id: 'objectType', title: 'versionKey'},
            {id: 'resourceType', title: 'resourceType'},
        ]
    });
    const resultData = [{
        identifier: value.contentIdentifier,
        questions: value.itemSetIdentifier,
        program: value.contentStatus,
        objectType: value.versionKey,
        resourceType: value.resourceType,
        status: 'Failed to create itemset'
    }]
    csvWriter.writeRecords(resultData)       // returns a promise
    .then(() => {
        log(chalk.bold.green('Itemset creation failed Report generated for ' .concat(contentIdentifier)));
    });
}

// getQumlQuestions()

exports.publishContent = getQumlQuestions;