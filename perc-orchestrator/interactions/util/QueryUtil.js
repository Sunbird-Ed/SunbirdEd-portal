/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Interaction related service
 * @author abhinav
 */
 /*args: {
		"post" : "ris placerat ",
		"userEmail" : "abhinav@perceptronnetwork.com",
		"courseEmail" : "dev_web301@app.ilimi.in",
		"title" : "Lorem ipsum",
		"context" :{
		    "leID" : "test1",
		    "leType" : "test2",
		    "courseId" : "info:fedora/learning:38529",
		    "interactionType" : "Q&A",
		    "discussionType" : "OPEN",
		    "concepts" : ["MySQL"],
		    "discussionUsers" :  [],
		    "moderators": []
	  	}
	}
*/

var metadataLabelPrefix = {
	'interaction_type':{label: '', labelPrefix: '', appendValue: true},
	'le_id':{label: '', labelPrefix: 'LE:', appendValue: true},
	'concepts':{label: '', labelPrefix: 'CP:', appendValue: true},
	'access_type':{label: '', labelPrefix: '', appendValue: true},
	'seed_post':{label: 'SeedPost', labelPrefix: '', appendValue: false},
	'comment_type':{label: '', labelPrefix: '', appendValue: true},
	'le_type':{label: '', labelPrefix: '', appendValue: true},
	'is_moderated':{label: 'RequiresModeration', labelPrefix: '', appendValue: false},
	'search_tag':{label: '', labelPrefix: '', appendValue: true},
};

function getSubQuery(key, value) {
	if(metadataLabelPrefix[key]) {
		if(metadataLabelPrefix[key].appendValue) {
			return 'l:' + metadataLabelPrefix[key].labelPrefix + value;
		} else {
			return 'l:' + metadataLabelPrefix[key].label;
		}
	}
	return '"' + key + '":"' + value + '"';
}

exports.getMetadataQuery = function(metadata){
 	var labelSet = [];
 	var allLabels = [];
 	var query = [];
 	var finalQuery = "";
 	//allLabels.push(["interaction_type:"  + args.context.interactionType]);
 	for(key in metadata) {
 		if(key == 'concepts') {
 			metadata[key].forEach(function(concept) {
 				allLabels.push(getSubQuery("concepts", concept.identifier));
 			})
 		} else if(key == 'moderators') {
 			allLabels.push(metadata[key].map(function(moderator){ return getSubQuery('mod_user', moderator) }));
 		} else if(key == 'members') {
			allLabels.push(metadata[key].map(function(member){ return getSubQuery('member', member) }));
 		} else if(key == 'le_id') {
 			allLabels.push(getSubQuery(key, metadata[key]));
 		} else {
 			query.push(getSubQuery(key, metadata[key]));
 		}
 	}
 	if(query.length > 0 || allLabels.length > 0) {
 		finalQuery = query.join(" ");
	 	finalQuery += " (";
	 	finalQuery += allLabels.map(function(label){return label;}).join(" OR ");
	 	finalQuery += ")";
 	}
 	return finalQuery;
 }