'use strict';

/**
 * @ngdoc service
 * @name playerApp.playerConstant
 * @description
 * # playerConstant
 * Constant in the playerApp.
 */
angular.module('playerApp')
  .constant('playerConstants', {

    	/*All api urls are listed under this key*/
    	"URL":{
            
            "BASE": "http://localhost:5000/api/sb/v1/",
            "COURSE": {
                "SEARCH" : "course/search",
                "CREATE" : "course/create",
                "UPDATE" : "course/update",
                "REVIEW" : "course/review",
                "PUBLISH" : "course/publish",
                "GET" : "course/get",
                "GET_MY_COURSE" : "course/get/mycourse",
                "HIERARCHY" : "course/hierarchy"
            },
            "CONTENT": {
                "SEARCH" : "content/search",
                "CREATE" : "content/create",
                "UPDATE" : "content/update",
                "REVIEW" : "content/review",
                "PUBLISH" : "content/publish",
                "GET" : "content/get",
                "GET_MY_COURSE" : "content/get/mycontent",
                "UPLOAD" : "content/upload"
            } 
    	},
        "MESSAGES" : {
            
        }
    });