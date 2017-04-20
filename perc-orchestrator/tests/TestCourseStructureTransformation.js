/*
 * Copyright (c) 2013-2014 Canopus Consulting. All rights reserved.
 *
 * This code is intellectual property of Canopus Consulting. The intellectual and technical
 * concepts contained herein may be covered by patents, patents in process, and are protected
 * by trade secret or copyright law. Any unauthorized use of this code without prior approval
 * from Canopus Consulting is prohibited.
 */

/**
 * Test for RDF Parser.
 *
 * @author ravitejagarlapati
 */

var rdfGraphUtil = require('../commons/RDFGraphUtil');
var courseUtil = require('../view_helpers/studio/CourseUtil');
var mongoose = require('mongoose');


module.exports = {
    setUp: function(callback) {

        callback();
    },
    tearDown: function(callback) {
        // clean up
        callback();
    },
    testPopulateRDFFromCourseStructure: function(test) {
        // expecting 3 assertions to be run
        // test.expect(3);
        var courseStructure = {
            "__v": 6,
            "_id": "534442d310884b00002d48d9",
            "children": [{
                "identifier": "lob_xySnWu2In",
                "nodeSet": "Module",
                "nodeSetId": "ped_1_module",
                "relationName": "contains",
                "_id": "53444386a615dc00006fd411",
                "name": "Introduction",
                "taxonomyId": "taxonomy_1_module",
                "metadata": {
                    "concept": "Course syllabus introduction",
                    "learningObjective": "Learn about course structure",
                    "studentProfile": "All",
                    "difficultyLevel": "Medium",
                    "subject": "Java"
                },
                "children": [{
                    "identifier": "lob_gkK_f_3In",
                    "nodeSet": "Lecture",
                    "nodeSetId": "ped_1_lecture",
                    "relationName": "contains",
                    "_id": "5344438ea615dc00006fd413",
                    "name": "What does the course cover",
                    "taxonomyId": "taxonomy_1_lecture",
                    "metadata": {
                        "difficultyLevel": "Low",
                        "subject": "Java"
                    },
                    "children": [],
                    "learningObjectives": [],
                    "sequence": [],
                    "nodeSetClass": "LearningObject"
                }, {
                    "identifier": "lob_e1Hwzu2Uh",
                    "nodeSet": "Lecture",
                    "nodeSetId": "ped_1_lecture",
                    "relationName": "contains",
                    "_id": "53444397a615dc00006fd415",
                    "name": "Java Programming Landscape",
                    "taxonomyId": "taxonomy_1_lecture",
                    "metadata": {
                        "difficultyLevel": "Low",
                        "subject": "Java"
                    },
                    "children": [],
                    "learningObjectives": [],
                    "sequence": []
                }, {
                    "identifier": "lob_l140fd28n",
                    "nodeSet": "Lecture",
                    "nodeSetId": "ped_1_lecture",
                    "relationName": "contains",
                    "_id": "534443a3a615dc00006fd417",
                    "name": "Basics of Java Programming",
                    "taxonomyId": "taxonomy_1_lecture",
                    "metadata": {
                        "difficultyLevel": "Low",
                        "subject": "Java"
                    },
                    "children": [],
                    "learningObjectives": [],
                    "sequence": []
                }, {
                    "identifier": "lob_eylDBdnL2",
                    "nodeSet": "Lecture",
                    "nodeSetId": "ped_1_lecture",
                    "relationName": "contains",
                    "_id": "534443e41d73fc0000224b32",
                    "name": "Real World Programs",
                    "taxonomyId": "taxonomy_1_lecture",
                    "metadata": {
                        "difficultyLevel": "Low",
                        "subject": "Java"
                    },
                    "children": [],
                    "learningObjectives": [],
                    "sequence": []
                }],
                "learningObjectives": [],
                "sequence": [
                    "lob_gkK_f_3In",
                    "lob_e1Hwzu2Uh",
                    "lob_l140fd28n",
                    "lob_eylDBdnL2"
                ],
                "nodeSetClass": "LearningObject"
            }, {
                "identifier": "lob_lJyy8u2I3",
                "nodeSet": "Module",
                "nodeSetId": "ped_1_module",
                "relationName": "contains",
                "_id": "534443f01d73fc0000224b34",
                "name": "Object Oriented Programming in Java",
                "taxonomyId": "taxonomy_1_module",
                "metadata": {
                    "learningObjective": "Demonstrate object oriented programming in Java",
                    "studentProfile": "All",
                    "difficultyLevel": "Low",
                    "subject": "Java"
                },
                "children": [{
                    "identifier": "lob_l1NE8u2Uh",
                    "nodeSet": "Lecture",
                    "nodeSetId": "ped_1_lecture",
                    "relationName": "contains",
                    "_id": "534443f91d73fc0000224b36",
                    "name": "Basics of Object Orientation",
                    "taxonomyId": "taxonomy_1_lecture",
                    "metadata": {
                        "learningObjective": "Understand the basics of OO",
                        "studentProfile": "All",
                        "difficultyLevel": "Low",
                        "subject": "Java"
                    },
                    "children": [],
                    "learningObjectives": [],
                    "sequence": []
                }, {
                    "identifier": "lob_eJxYLdhU2",
                    "nodeSet": "Lecture",
                    "nodeSetId": "ped_1_lecture",
                    "relationName": "contains",
                    "_id": "534444011d73fc0000224b38",
                    "name": "Object Oriented Design",
                    "taxonomyId": "taxonomy_1_lecture",
                    "children": [],
                    "learningObjectives": [],
                    "sequence": []
                }, {
                    "identifier": "lob_x1CCIOnU3",
                    "nodeSet": "Lecture",
                    "nodeSetId": "ped_1_lecture",
                    "relationName": "contains",
                    "_id": "5344440a1d73fc0000224b3a",
                    "name": "Working Session",
                    "taxonomyId": "taxonomy_1_lecture",
                    "children": [],
                    "learningObjectives": [],
                    "sequence": []
                }],
                "learningObjectives": [],
                "sequence": [
                    "lob_l1NE8u2Uh",
                    "lob_eJxYLdhU2",
                    "lob_x1CCIOnU3"
                ],
                "nodeSetClass": "LearningObject"
            }, {
                "identifier": "lob_xk8vPO2I2",
                "nodeSet": "Module",
                "nodeSetId": "ped_1_module",
                "relationName": "contains",
                "_id": "534444181d73fc0000224b3c",
                "name": "Data Structures and Collections",
                "taxonomyId": "taxonomy_1_module",
                "children": [{
                    "identifier": "lob_lk9pw_nI2",
                    "nodeSet": "Lecture",
                    "nodeSetId": "ped_1_lecture",
                    "relationName": "contains",
                    "_id": "534444221d73fc0000224b3e",
                    "name": "Arrays and Lists in Java",
                    "taxonomyId": "taxonomy_1_lecture",
                    "children": [{
                        "identifier": "lob_x14fd_3Un",
                        "nodeSet": "Topic",
                        "nodeSetId": "ped_1_topic",
                        "relationName": "contains",
                        "_id": "534444291d73fc0000224b40"
                    }],
                    "learningObjectives": [],
                    "sequence": [
                        "lob_x14fd_3Un"
                    ]
                }],
                "learningObjectives": [],
                "sequence": [
                    "lob_lk9pw_nI2"
                ],
                "nodeSetClass": "LearningObject"
            }],
            "description": "Description for advanced java course",
            "identifier": "course_x1LncDhIn",
            "isDraft": true,
            "learningObjectives": [
                "Master Java Language"
            ],
            "metadata": {
                "tutorName": "Feroz",
                "concept": "Java advanced topics",
                "learningObjective": "Become a Java practitioner",
                "studentProfile": "All",
                "difficultyLevel": "Hard",
                "subject": "Java"
            },
            "name": "Advanced Java Course",
            "pedagogyId": "pedagogy_1",
            "sequence": [
                "lob_xySnWu2In",
                "lob_lJyy8u2I3",
                "lob_xk8vPO2I2"
            ],
            "tutors": [],
            "nodeSet": "Course",
            "nodeSetClass": "LearningObject"
        };

        var pedagogyId = courseStructure.pedagogyId;
        var rdfData = {
            pedagogyId: courseStructure.pedagogyId
        };
        courseUtil.populateRDFFromLearningObject(courseStructure, rdfData);

        console.log(JSON.stringify(rdfData, null, 4));
        test.done();
    },
    cleanupAfterTests: function(test) {
        mongoose.connection.close();
        test.done();
    }

};