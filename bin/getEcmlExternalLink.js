// 'use strict'
// const path = require('path')
// , constants = require( path.join(__dirname, '..', 'constants'))
// , axios = require('axios')
// , qs = require('querystring')
// , perf = require('execution-time')()
// , {
//     convertArrayToCSV
// } = require('convert-array-to-csv')
// , fs = require('fs')
// , util = require("util")
// , chalk = require('chalk')
// , log = console.log
// , _ = require('lodash')

// perf.start(); // Just to measure the script performance

// function generateContentList() {
//     getAccessToken()
// }

// function getAccessToken() {
//     if(constants.access_token_required){
//         log(chalk.bold.yellow("Getting Access Token"))
//         const requestBody = {
//             client_id: constants.clientId,
//             username: constants.username,
//             password: constants.password,
//             grant_type: constants.grant_type,
//         }
//         const config = {
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             }
//         }
//         axios.post(constants.authEndpointUrl, qs.stringify(requestBody), config).then((result) => {
//                 getOldQumlContent(result.data.access_token)
//             })
//             .catch((err) => {
//                 log(err)
//             })
//     } else {
//         getOldQumlContent('')
//     }
    
// }


// function getOldQumlContent(token) {
//     log(chalk.bold.yellow("Searching for QUML version 0.5 content"))
//     const requestBody = {
//             "request": {
//               "filters": {
//                 "objectType": "Content",
//                 "status": [],
//                 "mimeType": ["application/vnd.ekstep.ecml-archive"]
//               },
//               "fields": ["identifier"]
//             } 
//     };
//     const config = {
//         headers: {
//             'Content-Type': 'application/json',
//             'Accept-Encoding': 'application/gzip',
//             'Accept-Charset': 'UTF-8',
//             'Authorization': 'Bearer '.concat(token)
//         }
//     }
//     // log('Request endpoint is ' + constants.kp_search_service_base_path + '/v3/search ' +" request body is " + JSON.stringify(requestBody) + 'with headers '+ JSON.stringify(config)) 
//     axios.post(constants.apiEndpointUrl + '/composite/v3/search', requestBody, config).then((result) => {
//             // log(result.data.result.content)
//             createCSVFromQuestionData(result.data.result.content)
//         })
//         .catch((err) => {
//             log(chalk.red(err))
//         })
// }

// function createCSVFromQuestionData(questionData) {
//     log(chalk.bold.yellow("Creating file for content Id's"))
//     var contentIdArray = [];
//     questionData.forEach(function(v) {
//         contentIdArray.push({
//             identifier: v.identifier,
//             objectType: v.objectType,
//         })
//     });
//     const csvFromArrayOfObjects = convertArrayToCSV(contentIdArray);
    
//     const writeFile = util.promisify(fs.writeFile);
//     writeFile(constants.ECML_content_identifier_path, csvFromArrayOfObjects, 'utf8').then(() => {
//         const results = perf.stop();
//         log(chalk.bold.greenBright('File is saved with content ID and ready to process for batch execution'));
//         log(chalk.white("Script execution time was " + results.words + " for " + (contentIdArray.length) + " content")); // in milliseconds
//     }).catch(error => log(chalk.red('Some error occurred - file either not saved or corrupted file saved.' + error)));;
// }

// // generateContentList()
// // exports.generateECMLContentList = generateContentList;
