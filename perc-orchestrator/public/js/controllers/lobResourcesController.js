var mplayer;

studioApp.controller('LearningObjectCtrl', function($scope, $http, page, action, $timeout) {

    // Model binding variables
    $scope.action = action;
    $scope.lob = {}; // The select LOB from the TOC
    $scope.element = {}; // The select Element from the bottom section
    $scope.selectedElement = {};
    $scope.taxonomyMetadata = {};
    $scope.metadata = {};
    $scope.selectedCategory = {};

    $scope.showVideo = false;
    $scope.showQuiz = false;
    $scope.selectedResource = null;
    $scope.lobResource = null;
    $scope.elements = [];
    $scope.lrResource = {};
    $scope.interception = {};
    $scope.videoPlayers = [];

    $scope.$on('$viewContentLoaded', function() {
        $timeout(function() {
            initializeLayout();
        }, 10);
    });

    $scope.selectAction = function(actionVal, liId) {
        $scope.action.setSelectedAction(actionVal);
        $timeout(function() {
            showActionSlider(liId);
        }, 10);
    }

    $scope.setTaxonomy = function(taxonomyId) {
        $http.get('/private/v1/taxonomy/metadata/' + encodeURIComponent(taxonomyId)).success(function(taxonomy) {
            $scope.taxonomyMetadata = taxonomy.lom_metadata;
            for(k in taxonomy.lom_metadata) {
                $scope.selectedCategory = k;
                break;
            }
        });
    };

    $scope.selectMetadataCategory = function(key) {
        $scope.selectedCategory = key;
    };

    $scope.getMetadata = function(lobId) {
        $http.get('/private/v1/lob/getMetadata/' + encodeURIComponent(lobId)).success(function(metadata) {
            $scope.metadata = metadata;
        });
    };

    $scope.selectLOB = function(lob, $event) {
        $scope.selectedElement = null;
        $scope.context = 'LOB';
        $scope.action.describeEnabled = true;
        $scope.lob = lob;
        $scope.element = lob;
        $scope.lob.relations.forEach(function(relation) {
            if(relation.toNodeSet == 'LearningActivity' || relation.toNodeSet == 'LearningResource') {
                $scope.action.addEnabled = true;
            }
        })
        $scope.setTaxonomy(lob.taxonomyId);
        $scope.getMetadata(lob.identifier);
        $scope.setLOBElements(lob.identifier);
    };

    $scope.treeIconClick = function($event) {
        collapseTree($event.target.id);
    };

    $scope.setLOBElements = function(lobId) {
        $http.get('/private/v1/lob/resources/' + encodeURIComponent(lobId)).success(function(data) {
            $scope.learningObjectResources = data;
            $scope.elements = [];
            if(data.lobs) {
                data.lobs.forEach(function(lob) {
                    $scope.elements.push(lob);
                });
            }
            if(data.resources) {
                data.resources.forEach(function(res) {
                    $scope.elements.push(res);
                });
            }
        });
    }

    $scope.selectFooterLOB = function(element) {
        $scope.selectedElement = null;
        if(element.type == 'learningobject') {
            $scope.element = element;
            setTimeout(function() {
                $('#' + $scope.transformId(element.identifier)).trigger('click');
            }, 10);
        } else {
            $scope.selectElement(element);
        }
    }

    $scope.selectElement = function(element) {
        $scope.selectedElement = element;
        $('.empty_border').removeClass('seq_active');
        $('#li-' + $scope.transformId(element.elementId)).addClass('seq_active');
        $http.post('/private/v1/lob/getElement/', {elementId: element.elementId, elementType: element.elementType}).success(function(data) {
            $scope.context = 'Element';
            $scope.selectedElement = data;
            $scope.setTaxonomy(data.taxonomyId);
            if(data.media) {
                $('#contentDiv').html('');
                $scope.videoPlayers.forEach(function(player) {
                    player.dispose();
                });
                $scope.videoPlayers = [];
                data.media.forEach(function(media) {
                    var id = $scope.transformId(media.mediaId);
                    var vid = $('<video id="' + id + '" class="video-js vjs-default-skin vjs-big-play-centered"></video>');
                    $('#contentDiv').append($(vid));
                    var player = videojs(id, {"controls": true, "autoplay": false, "preload": "auto", "width": "100%",
                    "height": "400",  "techOrder": ["youtube"], "src": media.mediaUrl});
                    $scope.videoPlayers.push(player);
                });
            }
        });
    }

    // deprecated
    $scope.incrementQuizIndex = function() {
        $scope.quizIndex++;
    }

    $scope.updateMetadata = function() {
        var obj = new Object();
        obj.lobId = $scope.selectedResource.lobId;
        var url = '/private/v1/lob/lr/update/';
        if($scope.selectedResource.nodeSet == 'Exercise') {
            obj.exerciseId = $scope.selectedResource.identifier;
            obj.exercise = $scope.lobResource;
            url = '/private/v1/lob/exercise/update/';
        } else if($scope.selectedResource.nodeSet == 'LearningActivity') {
            obj.laId = $scope.selectedResource.identifier;
            obj.la = $scope.lobResource;
            url = '/private/v1/lob/la/update/';
        } else {
            obj.lrId = $scope.selectedResource.identifier;
            obj.lr = $scope.lobResource;
            url = '/private/v1/lob/lr/update/';
        }
        $http.post(url, obj).success(function(data) {
        });
    }

    $scope.cancelAddContent = function() {
        $scope.addContent = 'hide';
    }

    $scope.showAddContent = function() {
        if($scope.lobRelations) {
            $scope.addContent = 'show';
            $scope.lobRelations.forEach(function(relation) {
                if(relation.nodeSetClass == 'LearningResource') {
                    //contentService.getMediaContent($scope.courseId, function(data) {
                    $http.get('/private/v1/content/media/' + encodeURIComponent($scope.courseId)).success(function(data) {
                        $scope.mediaItems = new Array();
                        for (var i in data) {
                            data[i].nodeSet = relation.toNodeSet;
                            data[i].nodeSetId = relation.toNodeSetId;
                            $scope.mediaItems.push(data[i]);
                        }
                    });
                }
                if(relation.nodeSetClass == 'LearningActivity') {
                    $http.get('/private/v1/content/learningActivity/' + encodeURIComponent($scope.courseId)).success(function(data) {
                        $scope.activityItems = new Array();
                        for (var i in data) {
                            data[i].nodeSet = relation.toNodeSet;
                            data[i].nodeSetId = relation.toNodeSetId;
                            $scope.activityItems.push(data[i]);
                        }
                    });
                }
            });
        }
    };

    $scope.addPreReq = function() {
        var obj = new Object()
        obj.lobId = $scope.selectedResource.lobId;
        obj.lrId = $scope.selectedResource.identifier;
        obj.preReq = $scope.lrResource;
        $http.post("/private/v1/lob/lr/prereq/add", obj).success(function(data) {
            $scope.selectLOBResource($scope.selectedResource);
            $('.ref_collapse').collapse('hide');
            $scope.lrResource = {};
        });
    }

    $scope.addReference = function() {
        var obj = new Object()
        obj.lobId = $scope.selectedResource.lobId;
        obj.lrId = $scope.selectedResource.identifier;
        obj.reference = $scope.lrResource;
        $http.post("/private/v1/lob/lr/reference/add", obj).success(function(data) {
            $scope.selectLOBResource($scope.selectedResource);
            $('.ref_collapse').collapse('hide');
            $scope.lrResource = {};
        });
    }

    $scope.addTutoringVideo = function() {
        var obj = new Object()
        obj.lobId = $scope.selectedResource.lobId;
        obj.lrId = $scope.selectedResource.identifier;
        obj.tutorExpVideo = $scope.lrResource;
        $http.post("/private/v1/lob/lr/tutorvideo/add", obj).success(function(data) {
            $scope.selectLOBResource($scope.selectedResource);
            $('.ref_collapse').collapse('hide');
            $scope.lrResource = {};
        });
    }

    $scope.attachContent = function() {
        $scope.addContent = 'hide';
        var obj = new Object();
        obj.id = $scope.learningObjectId;
        obj.las = [];
        obj.lrs = [];
        if($scope.activityItems) {
            $scope.activityItems.forEach(function(activity) {
                if(activity.selected) {
                    obj.las.push({
                        title: activity.name, nodeSet: activity.nodeSet, nodeSetId: activity.nodeSetId,
                        mediaIdentifier: activity.identifier, mediaURL: activity.media.url,
                        mediaType: angular.lowercase(activity.media.mediaType), description: activity.description,
                        mediaMimeType: angular.lowercase(activity.media.mimeType)
                    });
                }
            });
        }
        if($scope.mediaItems) {
            $scope.mediaItems.forEach(function(mediaItem) {
                if(mediaItem.selected) {
                    obj.lrs.push({
                        title: mediaItem.name,
                        description: mediaItem.description,
                        lrType:"Normal",
                        nodeSet: mediaItem.nodeSet,
                        nodeSetId: mediaItem.nodeSetId,
                        mediaIdentifier: mediaItem.identifier,
                        mediaURL: mediaItem.media.url,
                        mediaType: angular.lowercase(mediaItem.media.mediaType),
                        mediaMimeType: angular.lowercase(mediaItem.media.mimeType)
                    });
                }
            });
        }
        if(obj.lrs.length > 0) {
            $http.post("/private/v1/lob/lr/add", obj).success(function(data) {
                if(obj.las.length > 0) {
                    $http.post("/private/v1/lob/la/add", obj).success(function(data) {
                        $scope.setLOBResources($scope.learningObjectId);
                    });
                } else {
                    $scope.setLOBResources($scope.learningObjectId);
                }
            });
        } else if(obj.las.length > 0) {
            $http.post("/private/v1/lob/la/add", obj).success(function(data) {
                $scope.setLOBResources($scope.learningObjectId);
            });
        }
    }

    $scope.showAddInterceptions = function() {
        $scope.interception = {};
        $scope.learningResourceView = 'addInterceptions';
        setTimeout(function() {
            mplayer = videojs("video_interception", {"controls": true, "autoplay": false, "preload": "auto", "width": "100%",
                    "height": "360",  "techOrder": ["vimeo"], "src": $scope.selectedResource.mediaURL});
            //mplayer = videojs("video_interception", {"controls": true, "autoplay": false, "preload": "auto", "width": "100%",
            //        "height": "360",  "techOrder": ["youtube"], "src": "http://www.youtube.com/watch?v=xjS6SftYQaQ"});
            mplayer.ready(function() {
                console.log('player ready');
                mplayer.on("pause", function(){alert('paused');});
                mplayer.on("play", function(){alert('playing');});
            });
        }, 1000);

        //mplayer.src({ type: 'video/mp4', src: 'http://vjs.zencdn.net/v/oceans.mp4' });
        /*mplayer.rangeslider({controlTime:true, panel: true});
        mplayer.showSlider();
        mplayer.on("sliderchange",function() {
            var values = mplayer.getValueSlider();
            $scope.$apply(function () {
                $scope.interception.start = secondsTimeSpanToHMS(videojs.round(values.start, 0));
                $scope.interception.end = secondsTimeSpanToHMS(videojs.round(values.end, 0));
            });
        });*/
        mplayer.on("sliderchange",function() {
            var values = mplayer.getValueSlider();
            $scope.$apply(function () {
                $scope.interception.start = secondsTimeSpanToHMS(videojs.round(values.start, 0));
                $scope.interception.end = secondsTimeSpanToHMS(videojs.round(values.end, 0));
            });
        });
    }

    $scope.save = function() {
        $http.get('/private/v1/course/save/' + $scope.courseId).success(function(data) {
            console.log(data);
        });
    }

    $scope.sortableOptions = {
        update: function(e, ui) {
            //$scope.setSequence();
        }
    };

    $scope.setSequence = function() {
        var sequences = [];
        $('ul.sequences > li').each(function() {
            if(typeof sequences[$(this).attr('data-lobId')] === 'undefined')
                sequences[$(this).attr('data-lobId')] = [];
            sequences[$(this).attr('data-lobId')].push($(this).attr('data-resId'));
        });
        for(k in sequences) {
            var obj = new Object();
            obj.id = k;
            obj.sequence = sequences[k];
            $http.post("/private/v1/lob/resources/sequence", obj).success(function(data) {
            });
        }
        console.log('sequences', sequences);
    }

    $scope.transformId = function(id) {
        id = id.replace('info:fedora/', '');
        return id.replace(':', '-');
    }

    $scope.pageLoad = function() {
        $scope.courseId = $('#courseId').val();
        page.setEditor(true);
        $http.get('/private/v1/course/courseStructure/' + encodeURIComponent($scope.courseId)).success(function(data) {
            page.setCourseTitle(data.name);
            $scope.courseStructure = data;
            if(data.children && data.children.length > 0) {
                $scope.selectLOB(data.children[0]);
            }
            $scope.lobRelations = data.relations;
            setTimeout(function() {
                initializeTree();
                leftrightEqualHeight();
                MiddleCtH();
                //autoAdjustSequencePanel();
                $('#' + $scope.transformId($scope.lob.identifier)).addClass('list-active');
            }, 100);
        });
        // $http.get('/json/sample_quiz.json').success(function(data) {
        //     $scope.sampleQuiz = data;
        //     $scope.quizIndex = 0;
        // });
    }
    $scope.pageLoad();

    $scope.sequenceTestData = [];
    $scope.sequenceTestData.push({name: "Module 1", type: "LearningObject"});
    $scope.sequenceTestData.push({name: "Lesson 1", type: "LearningObject"});
    $scope.sequenceTestData.push({name: "Lesson 2", type: "LearningObject"});
    $scope.sequenceTestData.push({name: "Lesson 3", type: "LearningObject"});
    $scope.sequenceTestData.push({name: "Learning Resource 1", type: "LearningResource"});
    $scope.sequenceTestData.push({name: "Lesson 4", type: "LearningObject"});
    $scope.sequenceTestData.push({name: "Topic 1", type: "LearningObject"});
    $scope.sequenceTestData.push({name: "Topic 2", type: "LearningObject"});
    $scope.sequenceTestData.push({name: "Topic 3", type: "LearningObject"});
    $scope.sequenceTestData.push({name: "Collection 1", type: "Collection"});
});
