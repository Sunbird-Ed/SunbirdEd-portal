app.service('AssessmentService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {
    this.getURL = function(command, operationType) {
        var url = $rootScope.appConfig.assessmentBasePercUrl + command;
        if(operationType == "WRITE") {
            url="http://" + document.location.host + "/private/write/admin_middleware/?url="+encodeURIComponent(url);
        } else {
            url="http://" + document.location.host + "/private/read/admin_middleware/?url="+encodeURIComponent(url);
        }
        return url;
    };

    this.callService = function(command, input, type, operationType) {
        var deferred = $q.defer();
        console.dir(input);
        var result = "";
        if(type == "") type = "POST";
        if(!operationType) operationType = "READ";

        $.ajax({
            url : this.getURL(command, operationType),
            type : type,
            data : input,
            async : false,
            success : function(data) {
                result = data;
                deferred.resolve(result);
            },
            error : function(xhr, ajaxOptions, thrownError) {
                if(xhr && xhr.status == 403) {
                    result = xhr.responseText;
                } else {
                    result = ASSESSMENT_TECHNICAL_ERROR;    
                }
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    };

    this.getUserRole = function(data) {
        var deferred = $q.defer();
        $http.post('/private/v1/interactions/checkRole', data).success(function(resp) {
            if (!resp.error)
                deferred.resolve(resp);
            else
                deferred.reject(resp.error);
        });
        return deferred.promise;
    }

    this.fedoraPrefix = "info:fedora/";
    this.removeFedoraPrefix = function(identifier) {
        if (identifier.indexOf(this.fedoraPrefix) == 0) {
            return identifier.substring(this.fedoraPrefix.length);
        } else {
            return identifier;
        }
    };

    this.addFedoraPrefix = function(identifier) {
        if (identifier.indexOf(this.fedoraPrefix) == -1) {
            return this.fedoraPrefix + identifier;
        }
        return identifier;
    };

    this.getTOCForQuestionSets = function(){
        var QuestionSetTOC = $rootScope.toc;
        if(QuestionSetTOC) {
            var courseId = this.removeFedoraPrefix($rootScope.courseId);
            QuestionSetTOC.id = courseId;
            QuestionSetTOC.type = QuestionSetTOC.lobType;
            for(moduleKey in QuestionSetTOC.modules) {
                var module = QuestionSetTOC.modules[moduleKey];
                for(lessonKey in module.lessons) {
                    var lesson = module.lessons[lessonKey];
                    for(lectureKey in lesson.lectures) {
                        var lecture = lesson.lectures[lectureKey];
                        if(lecture.type == 'learningactivity') {
                            lesson.lectures.splice(lesson.lectures.indexOf(lecture), 1);
                        }
                    }
                }
            }
        } else {
            QuestionSetTOC = {};
        }
        return QuestionSetTOC;
    };

    this.getTOCKeyNames = function(){
        var tocKeyName = {};
        if($rootScope.toc) {
            for(moduleKey in $rootScope.toc.modules) {
                var module = $rootScope.toc.modules[moduleKey];
                if(module.id) tocKeyName[this.addFedoraPrefix(module.id)] = module.name;
                for(lessonKey in module.lessons) {
                    var lesson = module.lessons[lessonKey];
                    if(lesson.id) tocKeyName[this.addFedoraPrefix(lesson.id)] = lesson.name;
                    for(lectureKey in lesson.lectures) {
                        var lecture = lesson.lectures[lectureKey];
                        if(lecture.id) tocKeyName[this.addFedoraPrefix(lecture.id)] = lecture.name;
                    }
                }
            }
        }
        return tocKeyName;
    };

    var qsListSearchCriteria = '';
    this.setQSListSearchCriteria = function(criteria) {
        qsListSearchCriteria = criteria;
    };
    this.getQSListSearchCriteria = function() {
        return qsListSearchCriteria;
    }

    var qpListSearchCriteria = '';
    this.setQPListSearchCriteria = function(criteria) {
        qpListSearchCriteria = criteria;
    }
    this.getQPListSearchCriteria = function() {
        return qpListSearchCriteria;
    }

    var questionsListSearchCriteria = '';
    this.setQuestionsListFilter = function(criteria) {
        questionsListSearchCriteria = criteria;
    }

    this.getQuestionsListFilter = function() {
        return questionsListSearchCriteria;
    }

    this.getLearningElementName = function(identifier) {
        var learningElementId = this.removeFedoraPrefix(identifier);
        if(!learningElements) {
            this.getLearningElements();
        }

        var filteredElements = learningElements.filter(function(item) {
            return item.id == learningElementId;
        });
        if(filteredElements.length == 1) {
            return filteredElements[0].name;
        } else {
            return "";
        }
    }

    var learningElements = null;
    this.getLearningElements = function(){
        if(learningElements && learningElements.length > 0) {
            return learningElements;
        } else {
            var tocArray = [];
            if($rootScope.toc) {
                var courseId = this.removeFedoraPrefix($rootScope.courseId);
                tocArray.push({"label": '<span class="glyph20 icon icon-course"></span>&nbsp;'+$rootScope.toc.name, "id" : courseId, "name" : $rootScope.toc.name, "eleType" : $rootScope.toc.lobType, "parentId" : "" });
                $rootScope.toc.modules.forEach(function(module) {
                    tocArray.push({"label": '&nbsp;&nbsp;<span class="glyph20 icon icon-moduel"></span>&nbsp;'+module.name, "id" : module.id, "name" : module.name, "eleType" : module.type, "parentId" : courseId });
                    module.lessons.forEach(function(lesson) {
                        tocArray.push({"label": '&nbsp;&nbsp;&emsp;<span class="glyph20 icon icon-lessons"></span>&nbsp;'+lesson.name, "id" : lesson.id, "name" : lesson.name, "eleType" : lesson.type, "parentId" : module.id });            
                        lesson.lectures.forEach(function(lecture) {
                            if(lecture.type != 'learningactivity') {
                                tocArray.push({"label": '&nbsp;&nbsp;&emsp;&emsp;<span class="glyph20 icon icon-reference"></span>&nbsp;'+lecture.name, "id" : lecture.id, "name" : lecture.name, "eleType" : lecture.type, "parentId" : lesson.id });
                            }
                        });
                    });
                });
            }
            learningElements = tocArray;
            return tocArray;
        }
    };

    this.getTestTypes = function() {
        return ["Exam", "Practice"];
    };

    this.getPurpose = function () {
        return [
                { 'name': 'Knowledge', 'subpurpose' : [{id:1, name: "Definition"}, {id:2, name:"Syntax memory"}, {id:3, name: "Steps or process"}] }, 
                { 'name': 'Conceptual', 'subpurpose' : [{id:1, name:"Working mechanism of principle"}, {id:2, name: "Cause/effect"}] }, 
                { 'name': 'Application', 'subpurpose' : [{id:1, name:"Complete the code"}, {id:2, name:"Complete the algorithm"}, {id:3, name:"Develop a program"}, {id:4, name:"Develop an algorithm"}, {id:5, name:"Develop test cases"}] }, 
                { 'name': 'Problem solving', 'subpurpose' : [{id:1, name:"Identify the error in"}, {id:2, name:"Extend using API"}, {id:3, name:"Trace execution path"}] }
            ];
    };

    this.getQuestionTypes = function() {
        // return ["Objective", "Programming"];
        return [
                {'name': 'Objective', 'subTypes': [{ id: 1, name : "MCQ", code:"MCQ"}, { id: 2, name : "MMCQ", code : "MMCQ"}]},
                {'name': 'Programming', 'subTypes': [{id: 1, name : "Program/IDE", code : "Program in IDE"}/*, { id: 2, name : "Embedded Program", code : "EMBEDDED_PROGRAM"}*/]}
            ];
    };

    this.getQuestionSubTypes = function() {
        return [{ id: 1, name : "MCQ"}, { id: 2, name : "MMCQ"}];
    };

    this.getDifficultyLevels = function() {
        return [ {id: 1, name: "Easy"}, {id: 2, name: "Medium"}, {id: 3, name: "Difficult"}];
    }

}]);