app.controller('manageCoachingCtrl', ['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', '$location', 'CourseBrowserService', '$window', '$compile', '$sce', '$state', function($scope, $http, $timeout, $rootScope, service, $routeParams, $location, cbService, $window, $compile, $sce, $state) {
    $scope.allLectures = cbService.allLobs;
    $scope.editor = {};
    $scope.newAddRes = {};
    $scope.newAddRes.type = {};
    $scope.newMedia = {};
    $scope.autoGenClss;
    $rootScope.leftMenu = 'mc';
    $rootScope.showConceptMap = false;
    $rootScope.courseTitle = cbService.toc.name;
    $rootScope.learningElementTitle = cbService.toc.name;
    $rootScope.manageCoachingFilters = {
        addedToSelectedConcepts: []
    };
    $rootScope.manageCoachingFilters.addedToSelectedConcepts = [];
    $scope.contentItems = [];
    $scope.showNoneMsg = false;
    $scope.setNoContentFoundMsg = false;
    $scope.showListMsg = false;
    $scope.previewEvent = true;
    $scope.createSession = {};
    $scope.createSession.mediaList = [];
    $scope.session = {};
    $scope.showCreateSessionForm = true;
    $scope.showErrorMsg = false;
    $scope.showMediaErrorMsg = false;
    $scope.showEventMediaErrorMsg = false;

    $scope.selectedEvent = {};

    $scope.mediaTypesList = [{
        name: 'Slides',
        mime: 'scribd/id',
        type: 'slides'
    }, {
        name: 'Document',
        mime: 'scribd/doc',
        type: 'document'
    }, {
        name: 'Video',
        mime: 'video/youtube',
        type: 'video'
    }, {
        name: 'URL',
        mime: 'application/url',
        type: 'url'
    }, {
        name: 'External Page',
        mime: 'ilimi/external',
        type: 'external'
    }];

    $scope.renderHtmlTrim = function(htmlCode, length) {
        var subtxt = htmlCode.substring(0, length);
        if (htmlCode.length > length) {
            subtxt = subtxt + '...';
        }
        var txt = $sce.trustAsHtml(subtxt);
        return txt;
    };

    $rootScope.getAllCoachingSession = function() {
        setTimeout(function() {
            $http.get('/private/v1/player/getCoachingSession/' + encodeURIComponent($rootScope.courseId)).success(function(data) {
                // console.log(JSON.stringify(data));
                $rootScope.coachingSessionList = data;
                // console.log("pushed : ", $rootScope.coachingSessionList);
                $scope.showCreateSessionForm = true;
                $scope.createNewSessionMsg = false;
                if ($rootScope.coachingSessionList.length == 0) {
                    $scope.createNewSessionMsg = true;
                }
            });
        }, 100);
    };

    $rootScope.getCoachingSession = function(sessionId) {
        $http.get('/private/v1/player/coachingSession/' + encodeURIComponent(sessionId)).success(function(data) {
            $rootScope.selectedSession = data;
            $scope.showSessionDetail = true;
            $scope.showEditor = true;
        });
    };

    $rootScope.getAllEventsOfCoachingSession = function() {
        setTimeout(function() {
            $http.post('/private/v1/player/getAllEventsOfCoachingSession/').success(function(data) {
                //console.log(JSON.stringify(data));
                $rootScope.eventList = data;
                $scope.createNewEventMsg = false;
                if ($rootScope.eventList.length == 0) {
                    $scope.createNewEventMsg = true;
                }
            });
        }, 100);
    };

    $rootScope.showCreateCoachingSessionForm = function() {
        // write code here to create new coaching session
    };

    $scope.setCoachingSession = function(session) {
        // show detailed view page of coaching session
        //console.log("session : ", session);
        $rootScope.selectedSession = session;
    };

    $scope.backToSessions = function() {
        $scope.showSessionDetail = false;
        $scope.setNoContentFoundMsg = false;
        $scope.showNoneMsg = false;
        selectLeftMenuTab('coachingTab');
        $state.go('manageCoaching', {
            lobId: cbService.currentItem.id
        });
    };

    $scope.showSessionDetailedView = function(sessionId) {
        $state.go('coachingSession', {
            sessionId: encodeURIComponent(sessionId)
        });
    }

    $scope.backToEvents = function() {
        $scope.showSessionDetail = false;
        $scope.setNoContentFoundMsg = false;
        $scope.showNoneMsg = false;
    };

    $scope.userDetails = {};
    $scope.showEventPreview = function(sessionEvent) {
        $scope.previewEvent = false;
        $scope.selectedEvent = sessionEvent;
        console.log("session event : ", sessionEvent);

        //to get the full invites user detail
        if (sessionEvent.invited.length > 0) {
            var reqParms = {
                "userIdsArray": sessionEvent.invited
            };
            $http.post('/private/v1/player/getEnvitedUserDetails/', {
                param: reqParms
            }).success(function(data) {
                console.log("data from view helper: " + JSON.stringify(data));
                $scope.userDetails = data;
            }).
            error(function(data, status, headers, config) {
                console.log("Status : " + status);
            });
        }
    };


    $scope.getDisplayName = function(usersList) {
        $scope.displayNameArray = [];
        if ($scope.userDetails.length > 0) {
            usersList.forEach(function(identifier) {
                $scope.userDetails.forEach(function(user) {
                    if (user.identifier == identifier) {
                        $scope.displayNameArray.push(user.displayName);
                    }
                });
            });
        }
        return $scope.displayNameArray;
    }
    
    $scope.getActonsDisplayName = function(actions) {
        if ($scope.userDetails.length > 0) {
            actions.forEach(function(userAction) {
                $scope.userDetails.forEach(function(user) {
                    if (user.identifier == userAction.userId) {
                        userAction.name = user.displayName;
                    }
                });
            });
        }
        return actions;
    }

    $scope.backToList = function() {
        $scope.previewEvent = true;
        $scope.showEditor = true;
    };

    /* Start : Edit Session */
    $scope.editLR = function(session) {
        $scope.showErrorMsg = false;
        $scope.showMediaErrorMsg = false;
        $scope.showEditor = false;
        console.log(session);
        //console.log(cbService.currentItem.level); // need to ask how to get level
        // set default : 
        var level = 2;
        var url = '/private/studio/lob/' + level + '/' + encodeURIComponent(session.identifier);
        $http.get(url).success(function(lr) {
            console.log(lr);
            $scope.editor = {};
            $scope.editor.metadata = lr.metadata;
            console.log('metadta: ' + $scope.editor.metadata.author);

            $http.get('/private/studio/lr/content/' + encodeURIComponent(lr.contentIdentifier)).success(function(data) {
                $scope.editor.contentMetadata = data;
                console.log("media content : ", data);
            });

            $scope.editor.metadata.concepts = lr.concepts.map(function(item) {
                return {
                    'id': item.conceptIdentifier,
                    'name': item.conceptTitle
                }
            }) || [];

            if (lr.nodeSet == 'learningresource') {
                $scope.editor.metadata.nodeType = 'learningresource';
                $scope.editor.metadata.nodeClass = 'learningresource';
            } else if (lr.nodeSet == 'lesson') {
                $scope.editor.metadata.nodeType = 'lesson';
                $scope.editor.metadata.nodeClass = 'learningobject';
            }

            $scope.editor.addConcept = function($item, $model, $label) {
                $scope.editor.metadata.concepts.push($item);
            }

            $scope.editor.removeConcept = function(concept) {
                var index = $scope.editor.metadata.concepts.indexOf(concept);
                if (index > -1)
                    $scope.editor.metadata.concepts.splice(index, 1);
            }

            $scope.editor.getConcepts = function(object, val) {
                var conceptList = [];
                for (var key in object) {
                    conceptList.push({
                        id: key,
                        name: object[key]
                    });
                }
                $scope.editor.metadata.concepts.forEach(function(element) {
                    var index = conceptList.map(function(el) {
                        return el.id;
                    }).indexOf(element.id);
                    conceptList.splice(index, 1);
                });
                return conceptList;
            }

            $scope.editor.metadata.name = lr.name;
            $scope.editor.basic = true;
            if (level == 2) {
                $scope.editor.basic = false;
                $scope.editor.mediaList = lr.media;
                $scope.editor.mediaTypes = $scope.mediaTypesList;

                $scope.editor.handleMediaType = function() {
                    $scope.newMedia.mediaType = $scope.newMedia.type.type;
                    $scope.newMedia.mimeType = $scope.newMedia.type.mime;
                }

                $scope.editor.saveMedia = function(media) {
                    $scope.showMediaErrorMsg = false;
                    if ($scope.newMedia.type == "" || $scope.newMedia.title == "" || $scope.newMedia.mediaUrl == "" || $scope.newMedia.type == undefined || $scope.newMedia.title == undefined || $scope.newMedia.mediaUrl == undefined) {
                        $scope.showMediaErrorMsg = true;
                        return false;
                    }

                    $scope.editor.mediaList.push(media);
                    $scope.editor.mediaForm = false;
                    $scope.newMedia = {};
                }

                $scope.editor.editMedia = function(media) {
                    $scope.showMediaErrorMsg = false;
                    if ($scope.newMedia.type == "" || $scope.newMedia.title == "" || $scope.newMedia.mediaUrl == "" || $scope.newMedia.type == undefined || $scope.newMedia.title == undefined || $scope.newMedia.mediaUrl == undefined) {
                        $scope.showMediaErrorMsg = true;
                        return false;
                    }

                    $scope.editor.mediaList.splice($scope.editor.mediaList.indexOf(media), 1);
                    $scope.editor.editingMedia = media;
                    $scope.newMedia = media;
                    $scope.newMedia.type = _.findWhere($scope.editor.mediaTypes, {
                        mime: $scope.newMedia.mimeType
                    });
                    $scope.editor.mediaForm = true;
                }
                $scope.editor.removeMedia = function(media) {
                    $scope.editor.mediaList.splice($scope.editor.mediaList.indexOf(media), 1);
                }
                $scope.editor.cancelEdit = function() {
                    if ($scope.editor.editingMedia) {
                        $scope.editor.mediaList.push($scope.editor.editingMedia);
                        $scope.editor.editingMedia = false;
                    } else
                        $scope.newMedia = {};
                    $scope.editor.mediaForm = false;
                }
                $scope.editor.mediaList.uploadDoc = function() {
                    var fd = new FormData();
                    fd.append('document', $scope.editor.mediaList.fileToUpload);
                    $scope.editor.mediaList.uploading = true;
                    $http.post('/private/studio/scribd', fd, {
                        transformRequest: angular.identity,
                        headers: {
                            'Content-Type': undefined
                        }
                    }).success(function(data) {
                        $scope.editor.mediaList.uploading = false;
                        $scope.newMedia.mediaUrl = "https://www.scribd.com/embeds/" + data.doc_id + "/content?start_page=1&view_mode=scroll&access_key=" + data.access_key + "&show_recommendations=false";
                        $scope.newMedia.mediaType = "slides";
                    }).error(function() {
                        $scope.editor.mediaList.uploading = false;
                    });
                }

                $scope.editor.additional = {
                    list: lr.supplementary_content,
                    categories: ['discover', 'explore', '101', 'drilldown', 'references', 'recommended', 'tutorials'],
                    search: function() {
                        if (this.params.keyword.length !== 0) {
                            var keyword = this.params.keyword;
                            var params = {
                                keyword: this.params.keyword,
                                concepts: JSON.stringify(_.pluck($scope.editor.metadata.concepts, 'id'))
                            };
                            $http.post('/private/studio/content', params).success(function(data) {
                                $scope.editor.additional.contentItems = data.mediaContent;
                            });
                        }
                    },
                    exists: function(identifier) {
                        return _.findWhere(this.list, {
                            contentId: identifier
                        }).length > 0;
                    },
                    add: function(item) {
                        var media = _.findWhere(item.media, {
                            isMain: true
                        });
                        if (media.length > 1)
                            media = media[0];
                        var data = item.metadata;
                        data.contentGroup = data.category;
                        data.contentId = data.identifier;
                        data.title = data.name = item.name;
                        data.mediaType = media.mediaType;
                        data.mimeType = media.mimeType;
                        data.mediaURL = media.mediaUrl;
                    },
                    remove: function(item) {
                        this.list = _.without(this.list, _.findWhere(this.list, {
                            contentId: item.identifier
                        }));
                    },
                    form: {
                        handleTypeSelect: function() {
                            $scope.newAddRes.mediaType = $scope.newAddRes.type.type;
                            $scope.newAddRes.mimeType = $scope.newAddRes.type.mime;
                            console.log($scope.newAddRes);
                        },
                        uploadDoc: function() {
                            var fd = new FormData();
                            fd.append('document', this.fileToUpload);
                            $scope.editor.additional.form.uploading = true;
                            $http.post('/private/studio/scribd', fd, {
                                transformRequest: angular.identity,
                                headers: {
                                    'Content-Type': undefined
                                }
                            }).success(function(data) {
                                $scope.editor.additional.form.uploading = false;
                                $scope.newAddRes.mediaURL = "https://www.scribd.com/embeds/" + data.doc_id + "/content?start_page=1&view_mode=scroll&access_key=" + data.access_key + "&show_recommendations=false";
                                $scope.newAddRes.mediaType = 'slides';
                            }).error(function() {
                                $scope.editor.additional.form.uploading = false;
                            });
                        },
                        edit: function(item) {
                            $scope.editor.additional.list.splice($scope.editor.additional.list.indexOf(item), 1);
                            this.editing = item;
                            $scope.newAddRes = item;
                            $scope.newAddRes.category = $scope.editor.additional[$scope.editor.additional.categories.indexOf($scope.newAddRes.category)];
                            $scope.newAddRes.type = _.findWhere($scope.editor.mediaTypes, {
                                mime: $scope.newAddRes.mimeType
                            });
                            this.open = true;
                        },
                        remove: function(item) {
                            $scope.editor.additional.list.splice($scope.editor.additional.list.indexOf(item), 1);
                        },
                        save: function(item) {
                            $scope.editor.additional.list.push(item);
                            this.open = false;
                            $scope.newAddRes = {};
                        },
                        cancel: function() {
                            if (this.editing) {
                                $scope.editor.additional.list.push(this.editing);
                                this.editing = false;
                            } else
                                $scope.newAddRes = {};
                            this.open = false;
                        }
                    }
                }
            }

            //@TODO: MAKE THIS DRY

            $scope.editor.saveResource = function() {
                $('#updateBtn').html('Saving...').attr('disabled', true);
                $scope.showErrorMsg = false;
                if ($scope.editor.metadata.name == "" || $scope.editor.metadata.description == "") {
                    $('#updateBtn').html('Update Coaching Session').attr('disabled', false);
                    $("#editTitle").focus();
                    $scope.showErrorMsg = true;
                    return false;
                }

                var req = {
                    media: $scope.editor.mediaList || undefined,
                    content: $scope.editor.contentMetadata || undefined,
                    metadata: $scope.editor.metadata,
                    supplementary: ($scope.editor.additional) ? $scope.editor.additional.list : undefined
                }

                $http.post('/private/studio/lob', req).success(function(data) {
                    $scope.selectedSession.sessions.name = $scope.editor.metadata.name;
                    $scope.selectedSession.sessions.metadata.description = $scope.editor.metadata.description;
                    $scope.selectedSession.sessions.metadata.concepts = $scope.editor.metadata.concepts;
                    $('#updateBtn').html('Update Coaching Session').attr('disabled', false);
                    $scope.backToList();
                });
            }
        }).error(function(error) {
            console.log(error);
        });
    };
    /* Ends : Edit Session */

    $scope.getMetadata = function() {
        var metadata = {
            "isNew": true,
            "concepts": [],
            "node_type": "NODE",
            "object_uri": "",
            "setType": "learningresource",
            "isMandatory": "false",
            "extendedMaterial": "FALSE",
            "currentStatus": "draft",
            "shortDescription": "",
            "synopsis": "",
            "description": "",
            "language": "EN",
            "keyword": "",
            "offeredBy": "Stackroute Labs",
            "owner": "StackRoute Labs",
            "copyRight": "StackRoute Labs",
            "learnerLevel": "intermediate",
            "learningTime": 0,
            "elementType": "coachingSession",
            "instructionUsage": "coaching",
            "author": "",
            "authorImage": "http://beta.ilimi.in/uploads/image/feroz.png",
            "authorProfileURL": "http://www.canopusconsulting.com/index.php/feroz/",
            "ownerType": "Organization",
            "ownerImage": "http://beta.ilimi.in/uploads/image/canopuslogo.png",
            "ownerProfileURL": "http://www.canopusconsulting.com/",
            "offeredByType": "Organization",
            "offeredByImage": "http://beta.ilimi.in/uploads/image/canopuslogo.png",
            "offeredByProfileURL": "http://www.canopusconsulting.com/",
            "outcome": "default",
            "identifier": "",
            "createdBy": "",
            "descriptionVerified": false,
            "nodeType": "learningresource",
            "nodeClass": "learningresource",
            "name": ""
        };
        return metadata;
    };

    $scope.getContentMetadata = function() {
        var content = {
            "contentSubType": "lecture",
            "contentType": "lecture",
            "description": "",
            "identifier": "",
            "learningTime": 0,
            "metadata": {
                "isNew": true,
                "media": [],
                "node_type": "NODE",
                "object_uri": "",
                "setType": "content",
                "isMandatory": "false",
                "shortDescription": "",
                "synopsis": "",
                "description": "",
                "language": "EN",
                "learningTime": 0,
                "elementType": "lecture",
                "instructionUsage": "lecture",
                "identifier": "",
                "contentType": "lecture",
                "contentSubType": "lecture",
                "descriptionVerified": false
            },
            "name": "",
            "pedagogyId": "",
            "is_deleted": false,
            "interceptions": [],
            "mediaConcepts": [],
            "concepts": [],
            "subtitles": [],
            "transcripts": [],
            "categories": [],
            "media": [],
            "order": 0,
            "linkedCourses": []
        };
        return content;
    };

    /* Start : Create Session */
    $scope.createLR = function() {
        $scope.showErrorMsg = false;
        $scope.showMediaErrorMsg = false;
        $scope.showCreateSessionForm = false;
        $('#createSessionForm').slideDown();
        var level = 2;
        $scope.createSession = {};
        $scope.createSession.metadata = $scope.getMetadata();
        $scope.createSession.metadata.author = $scope.userName;
        $scope.createSession.contentMetadata = $scope.getContentMetadata();
        $scope.createSession.mandatoryOption = [{
            'key': 'false',
            'label': 'False'
        }, {
            'key': 'true',
            'label': 'True'
        }];
        $scope.createSession.metadata.isMandatory = _.findWhere($scope.createSession.mandatoryOption, {
            key: "false"
        });

        $scope.createSession.metadata.concepts = [];
        $scope.createSession.getConcepts = function(object) {
            var conceptList = [];
            for (var key in object) {
                if (object[key])
                    conceptList.push({
                        id: key,
                        name: object[key]
                    });
            }
            return conceptList;
        }
        $scope.createSession.basic = true;
        if (level == 2) {
            $scope.createSession.basic = false;
            $scope.createSession.mediaList = [];
            $scope.createSession.mediaTypes = $scope.mediaTypesList;
            $scope.createSession.handleMediaType = function() {
                $scope.newMedia.mediaType = $scope.newMedia.type.type;
                $scope.newMedia.mimeType = $scope.newMedia.type.mime;
            }

            $scope.createSession.saveMedia = function(media) {
                $scope.showMediaErrorMsg = false;
                if ($scope.newMedia.type == "" || $scope.newMedia.title == "" || $scope.newMedia.mediaUrl == "" || $scope.newMedia.type == undefined || $scope.newMedia.title == undefined || $scope.newMedia.mediaUrl == undefined) {
                    $scope.showMediaErrorMsg = true;
                    return false;
                }

                $scope.createSession.mediaList.push(media);
                $scope.createSession.mediaForm = false;
                $scope.newMedia = {};
            }
            $scope.createSession.editMedia = function(media) {
                $scope.showMediaErrorMsg = false;
                if ($scope.newMedia.type == "" || $scope.newMedia.title == "" || $scope.newMedia.mediaUrl == "" || $scope.newMedia.type == undefined || $scope.newMedia.title == undefined || $scope.newMedia.mediaUrl == undefined) {
                    $scope.showMediaErrorMsg = true;
                    return false;
                }

                $scope.createSession.mediaList.splice($scope.createSession.mediaList.indexOf(media), 1);
                $scope.createSession.editingMedia = media;
                $scope.newMedia = media;
                $scope.newMedia.type = _.findWhere($scope.createSession.mediaTypes, {
                    mime: $scope.newMedia.mimeType
                });
                $scope.createSession.mediaForm = true;
            }
            $scope.createSession.removeMedia = function(media) {
                $scope.createSession.mediaList.splice($scope.createSession.mediaList.indexOf(media), 1);
            }
            $scope.createSession.cancelEdit = function() {
                if ($scope.createSession.editingMedia) {
                    $scope.createSession.mediaList.push($scope.createSession.editingMedia);
                    $scope.createSession.editingMedia = false;
                } else
                    $scope.newMedia = {};
                $scope.createSession.mediaForm = false;
            }
            $scope.createSession.mediaList.uploadDoc = function() {
                var fd = new FormData();
                fd.append('document', $scope.createSession.mediaList.fileToUpload);
                $scope.createSession.mediaList.uploading = true;
                $http.post('/private/studio/scribd', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined
                    }
                }).success(function(data) {
                    $scope.createSession.mediaList.uploading = false;
                    $scope.newMedia.mediaUrl = "https://www.scribd.com/embeds/" + data.doc_id + "/content?start_page=1&view_mode=scroll&access_key=" + data.access_key + "&show_recommendations=false";
                    $scope.newMedia.mediaType = "slides";
                }).error(function() {
                    $scope.createSession.mediaList.uploading = false;
                });
            }

            $scope.createSession.additional = {
                list: [],
                categories: ['discover', 'explore', '101', 'drilldown', 'references', 'recommended', 'tutorials'],
                search: function() {
                    if (this.params.keyword.length !== 0) {
                        var keyword = this.params.keyword;
                        var params = {
                            keyword: this.params.keyword,
                            concepts: JSON.stringify(_.pluck($scope.createSession.metadata.concepts, 'id'))
                        };
                        $http.post('/private/studio/content', params).success(function(data) {
                            $scope.createSession.additional.contentItems = data.mediaContent;
                        });
                    }
                },
                exists: function(identifier) {
                    return _.findWhere(this.list, {
                        contentId: identifier
                    }).length > 0;
                },
                add: function(item) {
                    var media = _.findWhere(item.media, {
                        isMain: true
                    });
                    if (media.length > 1)
                        media = media[0];
                    var data = item.metadata;
                    data.contentGroup = data.category;
                    data.contentId = data.identifier;
                    data.title = data.name = item.name;
                    data.mediaType = media.mediaType;
                    data.mimeType = media.mimeType;
                    data.mediaURL = media.mediaUrl;
                },
                remove: function(item) {
                    this.list = _.without(this.list, _.findWhere(this.list, {
                        contentId: item.identifier
                    }));
                },
                form: {
                    handleTypeSelect: function() {
                        $scope.newAddRes.mediaType = $scope.newAddRes.type.type;
                        $scope.newAddRes.mimeType = $scope.newAddRes.type.mime;
                        console.log($scope.newAddRes);
                    },
                    uploadDoc: function() {
                        var fd = new FormData();
                        fd.append('document', this.fileToUpload);
                        $scope.createSession.additional.form.uploading = true;
                        $http.post('/private/studio/scribd', fd, {
                            transformRequest: angular.identity,
                            headers: {
                                'Content-Type': undefined
                            }
                        }).success(function(data) {
                            $scope.createSession.additional.form.uploading = false;
                            $scope.newAddRes.mediaURL = "https://www.scribd.com/embeds/" + data.doc_id + "/content?start_page=1&view_mode=scroll&access_key=" + data.access_key + "&show_recommendations=false";
                            $scope.newAddRes.mediaType = 'slides';
                        }).error(function() {
                            $scope.createSession.additional.form.uploading = false;
                        });
                    },
                    edit: function(item) {
                        $scope.createSession.additional.list.splice($scope.createSession.additional.list.indexOf(item), 1);
                        this.editing = item;
                        $scope.newAddRes = item;
                        $scope.newAddRes.category = $scope.createSession.additional[$scope.createSession.additional.categories.indexOf($scope.newAddRes.category)];
                        $scope.newAddRes.type = _.findWhere($scope.createSession.mediaTypes, {
                            mime: $scope.newAddRes.mimeType
                        });
                        this.open = true;
                    },
                    remove: function(item) {
                        $scope.createSession.additional.list.splice($scope.createSession.additional.list.indexOf(item), 1);
                    },
                    save: function(item) {
                        $scope.createSession.additional.list.push(item);
                        this.open = false;
                        $scope.newAddRes = {};
                    },
                    cancel: function() {
                        if (this.editing) {
                            $scope.createSession.additional.list.push(this.editing);
                            this.editing = false;
                        } else
                            $scope.newAddRes = {};
                        this.open = false;
                    }
                }
            }
        }

        // setting value to contentMetadata
        $scope.createSession.contentMetadata.linkedCourses.push($rootScope.courseId);
        $scope.createSession.contentMetadata.description = $scope.createSession.metadata.description;
        $scope.createSession.contentMetadata.metadata.media = $scope.createSession.mediaList;
        $scope.createSession.contentMetadata.metadata.isMandatory = $scope.createSession.metadata.isMandatory;
        $scope.createSession.contentMetadata.metadata.shortDescription = $scope.createSession.metadata.shortDescription;
        $scope.createSession.contentMetadata.metadata.synopsis = $scope.createSession.metadata.synopsis;
        $scope.createSession.contentMetadata.metadata.description = $scope.createSession.metadata.description;
        $scope.createSession.contentMetadata.name = $scope.createSession.metadata.name;
        $scope.createSession.contentMetadata.media = $scope.createSession.mediaList;

        $scope.clearContextInput = function() {
            contextSearchPrevValue = '';
            $(document).ready(function() {
                $('.bindercontextselect').click(function(evt) {
                    evt.stopPropagation();
                    $(".qa-context-container").toggleClass("qa-context-container-hover");
                    $('.bindercontextselect').val('');
                });
                $(document).click(function() {
                    $('.qa-context-container').removeClass('qa-context-container-hover'); //make all inactive
                    if ($('.bindercontextselect').val() == '') {
                        $('.bindercontextselect').val(contextSearchPrevValue);
                    }
                });
            });

            contextSearchPrevValue = $('.bindercontextselect').val();
            $scope.session.parent = '';
        }

        $scope.setCoachingSessionParent = function(context) {
            $scope.session.parent = context;
            $scope.session.parentId = context.id;
        }

        $scope.createSession.createResource = function() {
            $scope.createSession.metadata.isMandatory = $scope.createSession.metadata.isMandatory.key;
            $scope.createSession.contentMetadata.metadata.isMandatory = $scope.createSession.metadata.isMandatory.key;
            $('#createBtn').html('Saving...').attr('disabled', true);
            $scope.showErrorMsg = false;
            if ($scope.createSession.metadata.name == "" || $scope.createSession.metadata.description == "" || $scope.session.parent.name == "") {
                $('#createBtn').html('Create Coaching Session').attr('disabled', false);
                $("#createTitle").focus();
                $scope.showErrorMsg = true;
                return false;
            }

            $scope.createSession.metadata.courseId = $rootScope.courseId;
            $http.get('/private/v1/lob/getExternalId/' + encodeURIComponent($scope.session.parentId)).success(function(parentNode) {
                var req = {
                    media: $scope.createSession.mediaList || undefined,
                    content: $scope.createSession.contentMetadata || undefined,
                    metadata: $scope.createSession.metadata,
                    supplementary: ($scope.createSession.additional) ? $scope.createSession.additional.list : undefined,
                    parentNodeId: parentNode.nodeId
                }

                $http.post('/private/studio/lob', req).success(function(data) {
                    setTimeout(function() {
                        $('#createBtn').html('Create Coaching Session').attr('disabled', false);
                        $rootScope.getAllCoachingSession();
                        $scope.showCreateSessionForm = true;
                        $('#createSessionForm').slideUp();
                    }, 100);
                });
            });
        }
        $scope.initializeSelect2();
    };
    /* Ends : Create Session */

    /* Start: Edit Event */

    $scope.editEvent = {};
    $scope.editEvent.mediaUpload = {};

    $scope.editEvent.mediaTypes = $scope.mediaTypesList;

    $scope.editEvent.handleMediaType = function() {
        $scope.newMedia.mediaType = $scope.newMedia.type.type;
        $scope.newMedia.mimeType = $scope.newMedia.type.mime;
    }
    $scope.editEvent.addMedia = function() {
        $scope.newMedia = {};
        $scope.editEvent.mediaForm = true;
    }
    $scope.editEvent.saveMedia = function(media) {
        $scope.showEventMediaErrorMsg = false;
        if ($scope.newMedia.type == "" || $scope.newMedia.title == "" || $scope.newMedia.mediaUrl == "" || $scope.newMedia.type == undefined || $scope.newMedia.title == undefined || $scope.newMedia.mediaUrl == undefined) {
            $scope.showEventMediaErrorMsg = true;
            return false;
        }

        if (!$scope.selectedEvent.media) {
            $scope.selectedEvent.media = [];
        }

        $scope.selectedEvent.media.push(media);
        $scope.editEvent.mediaForm = false;
        $scope.newMedia = {};
    }
    $scope.editEvent.editMedia = function(media) {
        $scope.showEventMediaErrorMsg = false;
        if ($scope.newMedia.type == "" || $scope.newMedia.title == "" || $scope.newMedia.mediaUrl == "" || $scope.newMedia.type == undefined || $scope.newMedia.title == undefined || $scope.newMedia.mediaUrl == undefined) {
            $scope.showEventMediaErrorMsg = true;
            return false;
        }
        $scope.selectedEvent.media.splice($scope.selectedEvent.media.indexOf(media), 1);
        $scope.editEvent.editingMedia = media;
        $scope.newMedia = media;
        $scope.newMedia.type = _.findWhere($scope.editEvent.mediaTypes, {
            mime: $scope.newMedia.mimeType
        });
        $scope.editEvent.mediaForm = true;
    }
    $scope.editEvent.removeMedia = function(media) {
        $scope.selectedEvent.media.splice($scope.selectedEvent.media.indexOf(media), 1);
    }
    $scope.editEvent.cancelEdit = function() {
        if ($scope.editEvent.editingMedia) {
            $scope.selectedEvent.media.push($scope.editEvent.editingMedia);
            $scope.editEvent.editingMedia = false;
        } else
            $scope.newMedia = {};
        $scope.editEvent.mediaForm = false;
    }
    $scope.editEvent.mediaUpload.uploadDoc = function() {
        var fd = new FormData();
        fd.append('document', $scope.editEvent.mediaUpload.fileToUpload);
        $scope.editEvent.mediaUpload.uploading = true;
        $http.post('/private/studio/scribd', fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function(data) {
            $scope.editEvent.mediaUpload.uploading = false;
            $scope.newMedia.mediaUrl = "https://www.scribd.com/embeds/" + data.doc_id + "/content?start_page=1&view_mode=scroll&access_key=" + data.access_key + "&show_recommendations=false";
            $scope.newMedia.mediaType = $scope.newMedia.type.type;
        }).error(function() {
            $scope.editEvent.mediaUpload.uploading = false;
        });
    }
    $scope.editEvent.updateMedia = function() {
            var req = {};
            req.eventId = $scope.selectedEvent.identifier;
            req.media = $scope.selectedEvent.media;
            $('#updateMediaBtn').html('Updating Event...').attr('disabled', true);
            $http.post('/private/v1/coaching/event/updateMedia', req).success(function(data) {
                $('#updateMediaBtn').html('Update Event').attr('disabled', false);
                if (!data.error) {
                    $scope.selectedEvent.media = data;
                }
            }).
            error(function(data, status, headers, config) {
                console.log("Status : " + status);
                $('#updateMediaBtn').html('Update Event').attr('disabled', false);
            });
        }
        /* End: Edit Event */


    $scope.sessionListPage = function() {
        $scope.showCreateSessionForm = true;
        $('#createSessionForm').slideUp();
    };

    $scope.createCoachingSessionEvent = function(session) {
        //console.log("session : ", session.identifier);
        $state.go('postActivity', {
            type: "coachingSession",
            id: cbService.removeFedoraPrefix(session.identifier),
            locId: ""
        });
    };

    var sessionId = $routeParams.sessionId;
    if (sessionId && sessionId != '') {
        $rootScope.getCoachingSession(sessionId);
    } else {
        $rootScope.getAllCoachingSession();
    }
    setTimeout(function() {
        adjustLSMenuHeight();
    }, 100);

    $scope.initializeSelect2 = function() {
        setTimeout(function() {
            $("#sessionLOSelect").select2({
                formatResult: function(state) {
                    return state.text;
                },
                placeholder: "Select Lectures...",
                formatSelection: function(state) {
                    return state.text.replace(/&emsp;/g, '');
                },
                allowClear: true,
                escapeMarkup: function(m) {
                    return m;
                }
            });
        }, 100);
    }

    $scope.initializeSelect2();
}]);
