'use strict'
const path = require('path')
, constants = require( path.join(__dirname, '..', 'constants'))
, axios = require('axios')
, qs = require('querystring')
, perf = require('execution-time')()
, {
    convertArrayToCSV
} = require('convert-array-to-csv')
, fs = require('fs')
, util = require("util")
, chalk = require('chalk')
, log = console.log
, _ = require('lodash')
, csvSplitStream = require('csv-split-stream')
, fsExtra = require('fs-extra');

axios.defaults.timeout = 180000;

perf.start(); // Just to measure the script performance

function generateContentList() {
    getAccessToken()
}

function getAccessToken() {
    if(constants.access_token_required){
        log(chalk.bold.yellow("Getting Access Token"))
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
                getOldQumlContent(result.data.access_token)
            })
            .catch((err) => {
                log(err)
            })
    } else {
        getOldQumlContent('')
    }
    
}


function getOldQumlContent(token) {
    log(chalk.bold.yellow("Searching for QUML version 0.5 content"))
    const requestBody = {
            "request": {
              "exists": "questions",
              "filters": {
                "contentType": "PracticeQuestionSet",
                "medium": "English",
                "objectType": "Content"
              },
              "not_exists": "itemSets",
              "sort_by": {
                "createdOn": "desc"
              }
            } 
    };
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/gzip',
            'Accept-Charset': 'UTF-8',
            'Authorization': 'Bearer '.concat(token)
        }
    }
    log('Request endpoint is ' + constants.kp_search_service_base_path + '/v3/search ' +" request body is " + JSON.stringify(requestBody) + 'with headers '+ JSON.stringify(config)) 
    axios.post(constants.kp_search_service_base_path + '/v3/search', requestBody, config).then((result) => {
            // log(result.data.result.content)
            createCSVFromQuestionData(result.data.result.content)
        })
        .catch((err) => {
            log(chalk.red(err))
        })
}

function createCSVFromQuestionData(questionData) {
    log(chalk.bold.yellow("Creating file for content Id's"))
    var contentIdArray = [];
    questionData.forEach(function(v) {
        contentIdArray.push({
            identifier: v.identifier,
            questions:_.join(v.questions),
            program: v.program,
            objectType: v.objectType,
            status: v.status,
            resourceType: v.resourceType,
            node_id: v.node_id,
            author: v.author,
            name:v.name,
            language:_.join(v.language),
            status:v.status,
            versionKey:v.versionKey
        })
    });
    const csvFromArrayOfObjects = convertArrayToCSV(contentIdArray);
    
    const writeFile = util.promisify(fs.writeFile);
    writeFile(constants.content_csv_file_rath, csvFromArrayOfObjects, 'utf8').then(() => {
        const results = perf.stop();
        log(chalk.bold.greenBright('File is saved with content ID and ready to process for batch execution'));
        log(chalk.white("Script execution time was " + results.words + " for " + (contentIdArray.length) + " content")); // in milliseconds
    }).catch(error => log(chalk.red('Some error occurred - file either not saved or corrupted file saved.' + error)));;
    
    splitCsv()
}


function splitCsv(){
    fsExtra.emptyDirSync(constants.content_csv_folder_rath)
    return csvSplitStream.split(
          fs.createReadStream(constants.content_csv_file_rath),
          {
            lineLimit: 4
          },
          (index) => fs.createWriteStream(constants.content_csv_folder_rath + '/' + `output-${index}.csv`)
        )
        .then(csvSplitResponse => {
          console.log('csvSplitStream succeeded.', csvSplitResponse);
          // outputs: {
          //  "totalChunks": 350,
          //  "options": {
          //    "delimiter": "\n",
          //    "lineLimit": "10000"
          //  }
          // }
        }).catch(csvSplitError => {
          console.log('csvSplitStream failed!', csvSplitError);
        });
        }

// generateContentList()
exports.generateContentList = generateContentList;
