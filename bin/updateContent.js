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
, createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * 
 */
function updateContentWithItemSet(contentIdentifier, itemSetIdentifier, contentStatus, versionKey) {
    if(constants.access_token_required){
        log(chalk.bold.yellow("Getting Access Token in update content"))
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
            getContentVersionKey(result.data.access_token, contentIdentifier, itemSetIdentifier, contentStatus, versionKey);
            })
            .catch((err) => {
                log(err)
            })


    } else {
        getContentVersionKey('', contentIdentifier, itemSetIdentifier, contentStatus, versionKey);

    }
    
  }

  function getContentVersionKey(access_token, contentIdentifier, itemSetIdentifier, contentStatus, versionKey) {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/gzip',
            'Authorization': 'Bearer '.concat(access_token)
        }
    }
    const API_ENDPOINT =  constants.kp_content_service_base_path + "/content/v3/read"
    axios.get(`${API_ENDPOINT}/${contentIdentifier}`+ "?mode=edit", config).then(response => {
        // log("Content get version key  response ----------------- " + response.data.result.params)
        // log(JSON.stringify("version key was" + versionKey + "changed to " + response.data.result.content.versionKey))
        patchContentWithItemset(access_token, contentIdentifier, itemSetIdentifier, contentStatus, response.data.result.content.versionKey)
        // log("item read API is")
        
      })
      .catch((error) => {
        log("Content get version key  response ----------------- " + chalk.red(JSON.stringify(error.response.data)))
      });
  }

  function patchContentWithItemset(access_token, contentIdentifier, itemSetIdentifier, contentStatus, versionKey) {
    log("content id = " + contentIdentifier)
    log("itemsetId id = " + itemSetIdentifier)
    log("contentStatus id = " + contentStatus)
    log("versionKey id = " + versionKey)

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/gzip',
            'Authorization': 'Bearer '.concat(access_token)
        }
    }

    const requestBody = {
        "request": {
          "content": {
            "itemSets": [{
                "identifier": itemSetIdentifier
              }
            ],
            "versionKey": versionKey
          }
        }
      }

    //   log(JSON.stringify(reqBody))
    log('Request endpoint is' + constants.kp_content_service_base_path.concat('/content/v3/update/').concat(contentIdentifier) +" request body is " + JSON.stringify(requestBody) + 'with headers '+ JSON.stringify(config)) 
    
    axios.patch(constants.kp_content_service_base_path.concat('/content/v3/update/').concat(contentIdentifier) , requestBody, config)
    .then( (response) => {
        log("Content update call response ----------------- " + JSON.stringify(response.data.params))
        if( (_.lowerCase(contentStatus)) === 'live' ) {
            contentPublish(access_token, contentIdentifier, itemSetIdentifier, contentStatus, versionKey)
        }
    })
    .catch((err) => {
        log("Failed update content with item set " + err)
        failedItemSetToContentReport(contentIdentifier, itemSetIdentifier, contentStatus, versionKey)
        log(chalk.red(JSON.stringify(err.response.data)))
    })
  }

  function contentPublish(access_token, contentIdentifier, itemSetIdentifier, contentStatus, versionKey ) {
      log("in publish with ")
      log("content id = " + contentIdentifier)
      log("itemsetId id = " + itemSetIdentifier)
      log("contentStatus id = " + contentStatus)
      log("versionKey id = " + versionKey)
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/gzip',
            'Authorization': 'Bearer '.concat(access_token)
        }
    }
    const requestBody =   {
        "request": {
          "content": {
            "publisher": "EkStep",
            "lastPublishedBy": "EkStep"
          }
        }
      }
      log('PUBLISH Request endpoint is' + constants.kp_content_service_base_path.concat('/content/v3/publish/').concat(contentIdentifier) +" request body is " + JSON.stringify(requestBody) + 'with headers '+ JSON.stringify(config)) 
      axios.post(constants.kp_learning_service_base_path.concat('/content/v3/publish/').concat(contentIdentifier) , requestBody, config).then((result) => {
        log("Content publish" + JSON.stringify(result.data.params))
        updatePublishReport(contentIdentifier, itemSetIdentifier, contentStatus, versionKey,'published')
    })
    .catch((err) => {
        updatePublishReport(contentIdentifier, itemSetIdentifier, contentStatus, versionKey,'failed')
        log(chalk.red(JSON.stringify(err.response.data)))
    })
  }


  async function updatePublishReport(contentIdentifier, itemSetIdentifier, contentStatus, versionKey, status) {
   
    const csvWriter = createCsvWriter({
        path: constants.publish_result_csv_file_rath,
        append: true, // Below header will not get added if this property is true, just to make a blank template make it false 
        header: [
            {id: 'contentIdentifier', title: 'contentIdentifier'},
            {id: 'itemSetIdentifier', title: 'itemSetIdentifier'},
            {id: 'contentStatus', title: 'contentStatus'},
            {id: 'versionKey', title: 'versionKey'},
            {id: 'status', title: 'status'},
        ]
    });
    const resultData = [{
            contentIdentifier: contentIdentifier,
            itemSetIdentifier: itemSetIdentifier,
            contentStatus: contentStatus,
            versionKey: versionKey,
            status: status
    }]
    csvWriter.writeRecords(resultData)       // returns a promise
    .then(() => {
        log(chalk.bold.green('Publish Report generated for ' .concat(contentIdentifier)));
    });
}


async function failedItemSetToContentReport(contentIdentifier, itemSetIdentifier, contentStatus, versionKey) {
   
    const csvWriter = createCsvWriter({
        path: constants.failed_itemset_to_content_result_csv_file_rath,
        append: true, // Below header will not get added if this property is true, just to make a blank template make it false 
        header: [
            {id: 'contentIdentifier', title: 'contentIdentifier'},
            {id: 'itemSetIdentifier', title: 'itemSetIdentifier'},
            {id: 'contentStatus', title: 'contentStatus'},
            {id: 'versionKey', title: 'versionKey'},
            {id: 'status', title: 'status'},
        ]
    });
    const resultData = [{
            contentIdentifier: contentIdentifier,
            itemSetIdentifier: itemSetIdentifier,
            contentStatus: contentStatus,
            versionKey: versionKey,
            status: 'Failed to attach itemset to content'
    }]
    csvWriter.writeRecords(resultData)       // returns a promise
    .then(() => {
        log(chalk.bold.green('Failed Itemset Report generated for ' .concat(contentIdentifier)));
    });
}
// getContentVersionKey()
exports.updateContentWithItemSet = updateContentWithItemSet