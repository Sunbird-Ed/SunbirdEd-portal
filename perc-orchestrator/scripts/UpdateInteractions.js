/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Script to update interactions created date.
 * Usage - node UpdateInteractions.js <course_id> <start> <end> <output file>
 * Example - node UpdateInteractions.js 'info:fedora/learning:18740' 0 1000 'cloud_computing_course.tql'
 *
 * @author Santhosh
 */
var fs = require('fs');
var Client = require('node-rest-client').Client;
var client = new Client();
var url = "http://54.251.250.26:9090/int-mgr/v1/cmd/exec/SearchInteractions";

function getInteractions(requestData, callback) {
	args = {
		headers: {
        	"Content-Type": "application/json"
    	},
    	data: requestData
	}
    client.patch(url, args, function(data, response) {
        if (!data || data == null || data == '') {
            callback('Invalid response from MW', null);
        } else if (typeof data == 'string') {
            var isError = false;
            try {
                data = JSON.parse(data);
            } catch (e) {
                isError = true;
            }
            if (isError) {
                callback(data, null);
            } else {
                callback(null, data);
            }
        } else {
            callback(null, data);
        }
    }).on('error', function(err) {
        callback(err);
    });
}

function addDeleteScript(courseId, fileName, property) {
	var data = "delete select $s $p $o from <pcp:"+courseId+"> where ($s $p $o and $s <pcp:"+property+"> $o) from <pcp:"+courseId+">;\n";
	fs.appendFileSync(fileName, data);
}

function addInsertScript(courseId, fileName, intId, property, object) {
	var data = "insert <" + intId + "> <pcp:" + property + "> " + object + " into <pcp:" + courseId + ">;\n";
	fs.appendFileSync(fileName, data);
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function updateCreatedDate(courseId, start, end, fileName) {
	var dates = ['03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13'];
	var args = {
		USER_EMAIL_ID: 'admin@app.ilimi.in',
		SEARCH: {
			metadata: {
				type: 'interaction'
			},
			model: courseId,
			fields:["interactionId"],
			limit: end,
			offset: start
		 }
	};
	getInteractions(args, function(err, data) {
		if(err) {
			console.log('Error in getting interactions - ', err);
		} else {
			var interactions = data.responseValueObjects.INTERACTIONS.valueObjectList;
			if(interactions && interactions.length > 0) {
				addDeleteScript(courseId, fileName, 'createdDate');
				interactions.forEach(function(interaction) {
					//addDeleteScript(courseId, fileName, interaction.interactionId, 'createdDate');
					var obj = "'2015-03-" + dates[getRandomInt(0, 10)] + "T00:00:00.000'^^<http://www.w3.org/2001/XMLSchema#dateTime>"
					addInsertScript(courseId, fileName, interaction.interactionId, 'createdDate', obj);
				});
				console.log('Completed generating tql script.');
			}
		}
	})
}

updateCreatedDate(process.argv[2], process.argv[3], process.argv[4], process.argv[5]);
