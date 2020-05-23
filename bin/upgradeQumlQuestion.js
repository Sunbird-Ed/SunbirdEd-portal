'use strict'
const axios = require('axios')
, qs = require('querystring')
, chalk = require('chalk')
, log = console.log
, _ = require('lodash')
, path = require('path')
, constants = require( path.join(__dirname, '..', 'constants'))
, createCsvWriter = require('csv-writer').createObjectCsvWriter;

axios.defaults.timeout = 180000;
function upgradeQumlQuestion (QumlData) {

    if(QumlData.assessment_item.qumlVersion == 0.5){

    const options = (_.has(QumlData.assessment_item, 'options')) ? QumlData.assessment_item.options : []
    const question = (_.has(QumlData.assessment_item, 'question')) ? QumlData.assessment_item.question : ''
    const solutions = (_.has(QumlData.assessment_item, 'solutions')) ? QumlData.assessment_item.solutions : []

    const answer = _.toString(solutions) // for VAS , SA and LA question 

    let newEditorState = {};
    if(_.lowerCase(QumlData.assessment_item.category) === "mcq") {
        newEditorState.options = (_.has(QumlData.assessment_item.editorState, 'options')) ? QumlData.assessment_item.editorState.options : options;
    } else if ( (_.lowerCase(QumlData.assessment_item.category) === "vsa") 
    || (_.lowerCase(QumlData.assessment_item.category) === "sa")
    || (_.lowerCase(QumlData.assessment_item.category) === "la") ) { 
        newEditorState.answer = answer
    }

    newEditorState.question = (_.has(QumlData.assessment_item.editorState, 'question')) ? QumlData.assessment_item.editorState.question : question;
    newEditorState.solutions = (_.has(QumlData.assessment_item.editorState, 'solutions')) ? QumlData.assessment_item.editorState.solutions : solutions;
    QumlData.assessment_item.editorState = newEditorState
    
    // Adding response declaration in MCQ
    if(_.lowerCase(QumlData.assessment_item.category) === "mcq")  {
        let resDecl =  {
            "responseValue": {
                "cardinality": "single",
                "type": "integer",
                "correct_response": {
                    "value": '"'+_.findIndex(QumlData.assessment_item.options, {"answer": true}) + '"'
                }
            }
        }
        _.set(QumlData.assessment_item,'responseDeclaration',resDecl)

    // Adding response declaration in VSA and SA
    } else if ( (_.lowerCase(QumlData.assessment_item.category) === "vsa") 
                    || (_.lowerCase(QumlData.assessment_item.category) === "sa")
                    || (_.lowerCase(QumlData.assessment_item.category) === "la") ) {
        let resDecl =  {
            "responseValue": {
                "cardinality": "single",
                "type": "string",
                "correct_response": {
                    "value":  '"'+ _.toString(QumlData.assessment_item.solutions) + '"'
                }
            }
        }
        _.set(QumlData.assessment_item,'responseDeclaration',resDecl)
    }

    // updating QUML version from 0.5 to 1.0
    (_.has(QumlData.assessment_item, 'qumlVersion')) ? (QumlData.assessment_item.qumlVersion = 1) : _.set(QumlData.assessment_item,'qumlVersion',1)
    
    // Adding migration tag
    _.set(QumlData.assessment_item, 'prevQumlVersion', '0.5-1')

    // log(JSON.stringify(QumlData) + "<br><br>")
    getAccessToken(QumlData)
    }
}

function getAccessToken(QumlData) {
    if(constants.access_token_required){
        log(chalk.bold.yellow("Getting Access Token to UpgradeQumlQuestion"))
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
            patchQuestionForNewVersion(result.data.access_token,QumlData);
            })
            .catch((err) => {
                log(err)
            })

    } else {
        patchQuestionForNewVersion('',QumlData);
    }
    
}

function patchQuestionForNewVersion (access_token,QumlData) {
    const objectType = (_.has(QumlData.assessment_item, 'objectType')) ? QumlData.assessment_item.objectType : 'AssessmentItem'
    let requestBody = {
        "request": {
            "assessment_item": {
                "objectType": objectType,
                "metadata": {}
            }
        }
    };
    requestBody.request.assessment_item.metadata = QumlData.assessment_item;

    // log(JSON.stringify(requestBody));
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept-Encoding': 'application/gzip',
            'Authorization': 'Bearer '.concat(access_token)
        }
    }
    
    
    // log('Request endpoint is' + constants.kp_learning_service_base_path.concat('/assessmentitem/v3/update') +" request body is " + JSON.stringify(requestBody) + 'with headers '+ JSON.stringify(config)) 
    axios.patch(constants.kp_learning_service_base_path.concat('/assessment/v3/items/update/').concat(QumlData.assessment_item.identifier) , requestBody, config).then((result) => {
        // log("assessment update response is"+ JSON.stringify(result.data))
        updateReport(QumlData,'upgraded')
        // console.log(result)
        // log(QumlData)
    })
    .catch((err) => {
        // log("assessment failed update response is" + chalk.red(JSON.stringify(err.response.data)))
        updateReport(QumlData,'failed')
        
    })

}

async function updateReport(QumlData, status) {
   
    const csvWriter = createCsvWriter({
        path: constants.result_csv_file_rath,
        append: true, // Below header will not get added if this property is true, just to make a blank template make it false 
        header: [
            {id: 'identifier', title: 'identifier'},
            {id: 'itemType', title: 'itemType'},
            {id: 'qumlVersion', title: 'qumlVersion'},
            {id: 'program', title: 'program'},
            {id: 'type', title: 'type'},
            {id: 'category', title:'category'},
            {id: 'objectType', title: 'objectType'},
            {id: 'board', title: 'board'},
            {id: 'status', title: 'status'},
        ]
    });
    const resultData = [{
            identifier: QumlData.assessment_item.identifier,
            itemType: QumlData.assessment_item.itemType,
            qumlVersion: QumlData.assessment_item.qumlVersion,
            program: QumlData.assessment_item.program,
            type: QumlData.assessment_item.type,
            objectType: QumlData.assessment_item.objectType,
            board: QumlData.assessment_item.board,
            status: status
    }]
    csvWriter.writeRecords(resultData)       // returns a promise
    .then(() => {
        log(chalk.bold.green('Report generated for ' .concat(QumlData.assessment_item.identifier)));
    });
}

exports.upgradeQumlQuestion = upgradeQumlQuestion