var courseApp = angular.module('courseApp', ['ui.bootstrap', 'ngSanitize', 'checklist-model']);

courseApp.filter("transformId", function() {
    return function(identifier) {
        identifier = identifier.replace('info:fedora/', '');
        identifier = identifier.replace(':', '-');
        return identifier;
    }
});

courseApp.factory('action', function($rootScope) {
    var selectedAction = "";
    var addEnabled = false,
        describeEnabled = false,
        enhanceEnabled = false,
        //interceptionEnabled = false,
        enrichEnabled = false,
        sequenceEnabled = false;
    return {
        selectedAction: function() {
            return selectedAction;
        },
        setSelectedAction: function(actionText) {
            selectedAction = actionText;
        },
        addEnabled: false,
        describeEnabled: false,
        enhanceEnabled: false,
        //interceptionEnabled = false,
        enrichEnabled: false,
        sequenceEnabled: false
    }
});

courseApp.controller('EditContentCtrl', function($scope, $http, action, $timeout, $sce, $window) {
    $scope.pageScope = 'VIEW';
    $scope.action = action;
    $scope.taxonomyMetadata = {};
    $scope.metadata = {};
    $scope.selectedCategory = {};
    $scope.uploadObj = [];
    $scope.enhanceTab = '';
    $scope.enhance = {
        operation: 'read'
    };
    $scope.interception = {};
    $scope.content = {};
    $scope.fileSelected = false;
    $scope.mainMedia = {};
    $scope.enhanceTaxonomy = [{
        key: "transcripts",
        label: "Transcript",
        enable: true,
        formData: [{
            label: "Name",
            key: "name",
            datatype: "text"
        }, {
            label: "Language",
            key: "language",
            datatype: "text"
        }, {
            label: "File",
            key: "transcriptFile",
            datatype: "file"
        }]
    }, {
        key: "subtitles",
        label: "Sub Title",
        enable: true,
        formData: [{
            label: "Name",
            key: "name",
            datatype: "text"
        }, {
            label: "Language",
            key: "language",
            datatype: "text"
        }, {
            label: "File",
            key: "transcriptFile",
            datatype: "file"
        }]
    }, {
        key: "",
        label: "Chunk",
        enable: false
    }, {
        key: "",
        label: "Tag",
        enable: true
    }];

    // TODO For URL entry to create content - Media Types configured Here. This may change in future.
    $scope.mediatypes = [{
        'value': 'video',
        'name': 'Youtube Video'
    }, {
        'value': 'image',
        'name': 'Image'
    }, {
        'value': 'slides',
        'name': 'Scribd'
    }, {
        'value' : 'url',
        'name' : 'URL'
    }];

    $scope.contentTypes = [{
        'name': 'lecture',
        'label': ' Lecture'
    }, {
        'name': 'learningactivity',
        'label': 'Learning Activity'
    }];

    $scope.contentSubTypes = [{
        'name': 'quiz',
        'label': ' Quiz'
    }, {
        'name': 'program',
        'label': 'Program'
    }, {
        'name': 'exercise',
        'label': 'Submission Exercise'
    }];    

    $scope.contentTypeMimeTypeMapping = {
        'lecture' : 'image,video,pdf,text,word,excel,powerpoint',
        'learningactivity' :
        {
            'quiz': 'json',
            'exercise' : 'image,video,pdf,text,word,excel,powerpoint',
            'program' : 'image,video,pdf,text,word,excel,powerpoint'
        }
    };

    $scope.getAllowedTypes = function(contentType, contentSubType) {
        var allowedTypes = "";
        if(contentType == 'lecture') {
            allowedTypes = $scope.contentTypeMimeTypeMapping[contentType]
        } else if(contentType == 'learningactivity') {
            allowedTypes = $scope.contentTypeMimeTypeMapping[contentType][contentSubType];
        }
        return allowedTypes;
    }

    $scope.trustSrc = function(src) {
        return $sce.trustAsResourceUrl(src);
    }

    $scope.selectMetadataCategory = function(key) {
        $scope.selectedCategory = key;
    };

    $scope.selectAction = function(actionVal, liId) {
        $scope.action.setSelectedAction(actionVal);
        $timeout(function() {
            showActionSlider(liId);
        }, 10);
        $scope.enhanceTab = '';

        if (actionVal == 'Add') {
            $scope.content.from = 'FILE';
            $http.get('/private/v1/content/getAllMedia/').success(function(data) {
                $scope.mediaItems = new Array();
                $scope.activityItems = new Array();
                for (var i in data) {
                    if (data[i].contentType == 'lecture') {
                        $scope.mediaItems.push(data[i]);
                    } else if (data[i].contentType == 'learningactivity') {
                        $scope.activityItems.push(data[i]);
                    }
                }
                $scope.repoSelectedItems = [];
            });

            // $scope.mediaUploaderId = "addMediaUploader";
            // $scope.mediaUploaderFileList = "addMediaFileList";
            $scope.content.contentType = $scope.currentContent.contentType;
            var allowedTypes = $scope.getAllowedTypes($scope.currentContent.contentType, $scope.currentContent.contentSubType);

            $timeout(function() {
                $(".ajax-upload-dragdrop").remove();
            }, 500);
            $timeout(function() {
                $scope.addMediaUploader = $("#addMediaUploader").uploadFile({
                    url: "/private/v1/content/createMedia/" + encodeURIComponent($('#courseId').val()),
                    formData: {
                        "from": "FILE"
                    },
                    fileName: "mediafile",
                    autoSubmit: false,
                    multiple: true,
                    maxFileCount: 1,
                    allowedTypes: allowedTypes,
                    showStatusAfterSuccess: false,
                    showCancel: false,
                    showAbort: false,
                    showProgress: true,
                    dragDropStr: "<span><b> (or) Drag & Drop files here</b></span>",
                    statusBarDiv: 'addMediaFileList',
                    onSelect: $scope.onAddMediaFileSelect,
                    onSuccess: $scope.onAddMediaUploadSuccess
                });
            },500);
            $scope.addMediaFileCounter = 0;
            $scope.addMediaItems = [];
            $scope.addMediaUploader.fileCounter = 1;
            $scope.content.contentType = $scope.currentContent.contentType;
        } else if(actionVal == 'Interception') {
            initInterception();
        }
    }

    function initInterception() {
        $scope.content = {formPage :1, addFrom:'REPO'};
        $scope.contentMedia = {};
        $scope.interception = {};
        $scope.courseId = $('#courseId').val();
        $http.get('/private/v1/content/getCourseContents/' + encodeURIComponent($scope.courseId)).success(function(data) {
            $scope.contentItems = new Array();
            $scope.contentItems = data;
        });
    }

    $scope.courseId = $('#courseId').val();
    $scope.loadContentItems = function() {
        $scope.courseId = $('#courseId').val();
        $http.get('/private/v1/content/getCourseContents/' + encodeURIComponent($scope.courseId)).success(function(data) {
            $scope.mcMediaItems = new Array();
            $scope.mcActivityItems = new Array();
            for (var i in data) {
                if (data[i].contentType == 'lecture') {
                    $scope.mcMediaItems.push(data[i]);
                } else if (data[i].contentType == 'learningactivity') {
                    $scope.mcActivityItems.push(data[i]);
                }
            }
        });

        setTimeout(function() {
            initializeLayout();
        }, 100);
    };

    $scope.loadContentItems();

    $scope.loadContentTaxonomy = function() {
        $scope.courseId = $('#courseId').val();
        $http.get('/private/v1/content/getContentNodeSet/' + encodeURIComponent($scope.courseId)).success(function(data) {
            var taxonomyId = data.taxonomyId;
            $http.get('/private/v1/taxonomy/metadata/' + encodeURIComponent(taxonomyId)).success(function(data) {
                $scope.taxonomyMetadata = data.lom_metadata;
                for (k in data.lom_metadata) {
                    $scope.selectedCategory = k;
                    break;
                }
            });
        });
    };

    $scope.showAddNewContent = function() {        
        $scope.mediaUploaderId = "fileuploader";
        $scope.mediaUploaderFileList = "fileList";
        $scope.pageScope = 'NEW';

         $scope.content = {
             'formPage': 1,
             'from': 'FILE'
         };
        // $scope.contentTypes = [{
        //     'name': 'lecture',
        //     'label': 'Lecture',
        //     'group': 'Lecture'
        // }, {
        //     'name': 'quiz',
        //     'group': 'Learning Activity',
        //     'label': 'Quiz'
        // }, {
        //     'name': 'submissionexcercise',
        //     'group': 'Learning Activity',
        //     'label': 'Submission Exercise'
        // }, {
        //     'name': 'program',
        //     'group': 'Learning Activity',
        //     'label': 'Program'
        // }];
        
        $http.get('/private/v1/content/getAllMedia/').success(function(data) {
            $scope.mediaItems = new Array();
            $scope.activityItems = new Array();
            for (var i in data) {
                if (data[i].contentType == 'lecture') {
                    $scope.mediaItems.push(data[i]);
                } else if (data[i].contentType == 'learningactivity') {
                    $scope.activityItems.push(data[i]);
                }
            }
            $scope.repoSelectedItems = [];
        });
    };

    $scope.createContentFromURL = function() {
        if($scope.content.mediaType.toLowerCase() == 'video') {
            $scope.content.mimeType = 'video/youtube';
        } else if($scope.content.mediaType.toLowerCase() == 'image'){
            $scope.content.mimeType = 'image/image';
        } else if($scope.content.mediaType.toLowerCase() == 'url') {
            $scope.content.mimeType = 'application/url';
        } else if($scope.content.mediaType.toLowerCase() == 'slides') {
            $scope.content.mimeType = 'scribd/url';
        }

        //$scope.content.mimeType = 'application/' + $scope.content.mediaType.toLowerCase();
        $http.post('/private/v1/content/createMedia/' + encodeURIComponent($scope.courseId), $scope.content).success(function(media) {
            var mediaItems = [];
            mediaItems.push(media);
            $http.post('/private/v1/content/createNew/' + encodeURIComponent($scope.courseId), {
                'mediaItems': mediaItems,
                'content': $scope.content
            }).success(function(data) {

                $window.location.replace('/studio/content/' + encodeURIComponent($scope.courseId));
            });
        });
    };

    $scope.createContentFromRepo = function() {
        var mediaItems = $scope.repoSelectedItems;
        $http.post('/private/v1/content/createNew/' + encodeURIComponent($scope.courseId), {
            'mediaItems': mediaItems,
            'content': $scope.content
        }).success(function(data) {
            $window.location.replace('/studio/content/' + encodeURIComponent($scope.courseId));
        });
    };

    // Add Media Action - On select file.
    $scope.onAddMediaFileSelect = function() {
        $scope.fileSelected = true;
        $('#addMediaToContent').show();
        return true;
    }
    // Add Media Action - On Success of each file upload.
    $scope.onAddMediaUploadSuccess = function(files, response, xhr) {
        $scope.addMediaFileCounter++;
        $scope.addMediaItems.push(response);
        if ($scope.addMediaFileCounter == $scope.addMediaUploader.fileCounter - 1) {
            $http.post('/private/v1/content/addMediaToContent/', {
                'mediaItems': $scope.addMediaItems,
                'contentId': $scope.currentContent.identifier
            }).success(function(data) {
                $scope.currentContent = data;
                $scope.lob = data;
                $scope.fileSelected = false;
                $timeout(function() {
                    hideActionSlider();
                }, 10);
            });
        }
    }

    //
    $scope.createAddMediaToContent = function() {
        $scope.addMediaUploader.startUpload();
    }

    $scope.addURLMediaToContent = function(contentId) {
        var media = $scope.content;
        media.mimeType = 'application/' + media.mediaType.toLowerCase();
        $http.post('/private/v1/content/createMedia/' + encodeURIComponent($scope.courseId), media).success(function(media) {
            var mediaItems = [];
            mediaItems.push(media);
            $http.post('/private/v1/content/addMediaToContent/', {
                'mediaItems': mediaItems,
                'contentId': contentId
            }).success(function(data) {
                $scope.currentContent = data;
                $scope.lob = data;

                $timeout(function() {
                    hideActionSlider();
                }, 10);
            });
        });
    };

    $scope.addMediaToContentFromRepo = function(contentId) {
        var mediaItems = $scope.repoSelectedItems;
        $http.post('/private/v1/content/addMediaToContent/', {
            'mediaItems': mediaItems,
            'contentId': contentId
        }).success(function(data) {
            $scope.currentContent = data;
            $scope.lob = data;

            $timeout(function() {
                hideActionSlider();
            }, 10);
        });
    };

    $scope.videoPlayer = [];

    $scope.transformId = function(id) {
        id = id.replace('info:fedora/', '');
        return id.replace(':', '-');
    }

    $scope.selectMedia = function(mainMedia, divId) {
        $('#'+divId).html('');
        $scope.quizPlayer = false;
        if ($scope.videoPlayer[divId]) {
            $scope.videoPlayer[divId].dispose();
            $scope.videoPlayer[divId] = null;
        }

        if(mainMedia.mediaType == 'mcq') {
            // $http.get(mainMedia.mediaUrl).success(function(data) {
            //     $scope.quizPlayer = true;
            //     $scope.quizIndex = 0;
            //     $scope.sampleQuiz = data;
            // });
                $scope.quizPlayer = true;
                $scope.quizIndex = 0;
                $scope.sampleQuiz = mainMedia.mediaUrl;
                // TODO need relook at this
        } else {
            if(mainMedia.state =='NEW' || mainMedia.state == 'UPLOADED') {
                $timeout(function() {
                    var pending = "<div style='width: 100%;margin: auto;min-height: 200px;text-align: center;font-weight: bold;padding-top: 95px;border: 2px solid;'>Upload is in progress...</div>";
                    $('#'+divId).append(pending);
                }, 10);
                // $http.get('/private/v1/content/getMedia/'+encodeURIComponent(mainMedia.mediaId)).success(function(data) {
                //     if(data.state == 'READY') {

                //     }
                // });
                //TODO getMedia to update the state of MediaModel and MediaContentModel.media => State and URL, Thumbnails etc.,
            } else {
                if (mainMedia.mediaType == 'video') {
                    var id = $scope.transformId(mainMedia.mediaId);
                    $timeout(function() {
                        id = id + '_' + divId;
                        console.log('id', id);
                        var vid = $('<video id="' + id + '" class="video-js vjs-default-skin vjs-big-play-centered"></video>');
                        $('#'+divId).append($(vid));
                        $scope.videoPlayer[divId] = videojs(id, {
                            "controls": true,
                            "autoplay": false,
                            "preload": "auto",
                            "width": "100%",
                            "height": "400",
                            "techOrder": ["youtube"],
                            "ytcontrols": true,
                            "src": mainMedia.mediaUrl
                        });
                        // var interceptions = getInterceptions($scope.currentContent, mainMedia.mediaId);
                        // $scope.videoPlayer.ready(function() {                            
                        //     if (interceptions && interceptions.length > 0) {
                        //       this.cuepoints();
                        //       for (var i=0; i<interceptions.length; i++) {
                        //           var interception = interceptions[i];
                        //           this.addCuepoint({
                        //               namespace: "logger",
                        //               start: parseInt(interception.interceptionPoint),
                        //               end: parseInt(interception.interceptionPoint) + 5,
                        //               onStart: function(params){
                        //                   $scope.triggerInterception(interception,id,'interceptionDiv');
                        //               },
                        //               onEnd: function(params){
                        //               },
                        //               params: {error: false}
                        //           });
                        //       }
                        //     }
                        //     this.one('ended', function() {
                        //       $scope.setElementComplete();
                        //     });                            
                        // });
                    }, 10);

                } else if (mainMedia.mediaType == 'slides') {
                    var urlObj = parseScribdURL(mainMedia.mediaUrl);
                    var scribd_doc = scribd.Document.getDoc(urlObj.id, urlObj.access_key);
                    scribd_doc.addParam('jsapi_version', 2);
                    scribd_doc.addParam('mode', 'slideshow');
                    scribd_doc.write(divId);
                } else if(mainMedia.mediaType == 'url') {
                    $timeout(function() {
                        var urlHtml = "<span>URL of The Media: </span><a href='"+mainMedia.mediaUrl+"' style='margin:auto;padding-top:10px;padding-bottom:10px;' target='_blank'>"+mainMedia.title+"</a>";
                        $('#'+divId).append(urlHtml);
                    }, 10);
                } else if(mainMedia.mediaType == 'image') {
                    $timeout(function() {
                        var imageHtml = "<image src='"+mainMedia.mediaUrl+"' width='100%', height='400'/>";
                        $('#'+divId).append(imageHtml);
                    }, 10);
                }
            }
        }

        $('.all_media').removeClass('list-active');
        $('#' + $scope.transformId(mainMedia.mediaId)).addClass('list-active');
    };

    function getInterceptions(content, mediaId) {
        var interceptions = [];
        var allInterceptions = content.interceptions;
        if (allInterceptions && allInterceptions.length > 0) {
            for (var i = 0; i < allInterceptions.length; i++) {
                if(allInterceptions[i].mediaId == mediaId) {
                    interceptions.push(allInterceptions[i]);
                }
            }
        }
        return interceptions;
    }

    $scope.triggerInterception = function(interception, videoDivId, interceptionDivId) {
        alert("Interception triggered.");
        var vPlayer = videojs(videoDivId);
        vPlayer.pause();
        vPlayer.cancelFullScreen();
        setTimeout(function() {
            $('#'+videoDivId).hide();
            $('#'+interceptionDivId).show();
            $scope.selectMedia(interception, interceptionDivId);
        }, 500);
    }; 

    $scope.setElementComplete = function() {

    };

    $scope.selectContent = function(contentId) {
        $scope.action.describeEnabled = true;
        $scope.action.enhanceEnabled = true;
        $scope.action.addEnabled = true;
        $scope.action.interceptionEnabled = true;
        $scope.pageScope = 'VIEW';
        $scope.loadContentTaxonomy();

        $http.get('/private/v1/content/getContent/' + encodeURIComponent(contentId)).success(
            function(data) {
                $scope.currentContent = data;
                $scope.lob = data;
                $scope.metadata = data.metadata;
                var mediaItems = data.media;
                var mainMedia = mediaItems[0]; // Considering First As main media.
                $scope.selectMedia(mainMedia,"contentDiv");
        });        
    };

    $scope.updateMetadata = function() {
        for (var i in $scope.metadata) {
            var item = $scope.metadata[i];
            var value = $scope.taxonomyMetadata[item.propertyName]
            if (item.required) {
                if (value == '' || value.trim() == '') {
                    alert(item.label + ' is a required metadata');
                    return;
                }
            }
        }
        $http.post("/private/v1/content/saveMetadataInContent/" + encodeURIComponent($scope.currentContent.identifier), $scope.metadata).success(function(data) {
            $scope.loadContentItems();
            $scope.currentContent = data;
            $scope.metadata = data.metadata;
        });
        
        $timeout(function() {
            hideActionSlider();
        }, 10);

    };

    $scope.removeMediaFromContent = function(media) {
        $http.post("/private/v1/content/removeMediaFromContent/" + encodeURIComponent($scope.currentContent.identifier), {'media':media}).success(
            function(data) {
                $scope.currentContent = data;
                $scope.lob = data;
                $scope.metadata = data.metadata;
                var mediaItems = data.media;
                var mainMedia = mediaItems[0]; // Considering First As main media.
                $scope.selectMedia(mainMedia,"contentDiv");    
        });
    };

    $scope.selectEnhanceTab = function(tab, contentId) {
        $scope.enhanceTab = tab;
        $scope.enhance.action = tab;
        $scope.interception = {};
        if(tab == 'transcripts' || tab == 'subtitles') {
            $timeout(function() {
                //if($scope.uploadObj[tab] == null) {
                $scope.uploadObj[tab] = $("#" + tab).uploadFile({
                    url: "/private/v1/content/createMedia/" + encodeURIComponent($('#courseId').val()),
                    formData: {
                        "from": "FILE"
                    }, //$scope.enhance,
                    fileName: "mediafile",
                    autoSubmit: false,
                    multiple: false,
                    maxFileCount: 1,
                    allowedTypes: "text,pdf,doc,docx",
                    showStatusAfterSuccess: false,
                    showCancel: false,
                    showAbort: false,
                    showProgress: true,
                    statusBarDiv: tab + "FileList",
                    onSelect: $scope.onEnhanceFileSelect,
                    onSuccess: $scope.onEnhanceUploadSuccess
                });
                //}
            }, 1000);

            $scope.enhanceFileCounter = 0;            
        }
    };

    $scope.onEnhanceFileSelect = function() {
        $('#uploadEnhanceFiles').show();
    };

    $scope.onEnhanceUploadSuccess = function(files, response, xhr) {
        $scope.enhanceFileCounter++;
        var enhanceItem = response;
        $scope.enhance.mediaIdentifier = $scope.mainMedia.mediaId;
        if ($scope.enhanceFileCounter == ($scope.uploadObj[$scope.enhance.action].fileCounter - 1)) {
            $http.post('/private/v1/content/addEnhanceMediaToContent/' + encodeURIComponent($scope.currentContent.identifier), {
                "enhanceData": $scope.enhance,
                "enhanceItem": enhanceItem
            }).success(function(err, data) {
                $scope.currentContent = data;
                $scope.lob = data;
                $window.location.replace('/studio/content/' + encodeURIComponent($('#courseId').val()));
            });
        }
    };

    $scope.uploadEnhanceFiles = function() {
        $scope.uploadObj[$scope.enhance.action].startUpload();
    };

    $scope.showAddConcept = function() {
        $('#addConcept').modal({
            keyboard: false
        });
        $scope.concepts = [];
        $http.get('/private/v1/content/getAllConcepts').success(
            function(concepts) {
                for (var key in concepts) {
                    $scope.concepts.push(concepts[key].title);
                }
            });
    };

    $scope.addConcept = function() {
        $http.post("/private/v1/content/addConcept/", {
            'conceptName': $scope.conceptName,
            "contentId": $scope.currentContent.identifier
        }).success(function(data) {
            $scope.currentContent = data;
            $scope.conceptName = "";
        });
        $('#addConcept').modal('hide');
    };

    $scope.onNewContentFileSelect = function() {
        $('#uploadNewContentFiles').show();
    };

    $scope.onNewContentUploadSuccess = function() {
        $scope.newContentFileCounter++;
        if ($scope.newContentFileCounter == ($scope.uploadNewContent.fileCounter - 1)) {
            document.location.href = '/studio/content/' + encodeURIComponent($('#courseId').val());
        }
    };

    $scope.uploadNewContentFiles = function() {
        $scope.uploadNewContent.startUpload();
    };

    $scope.addRepositoryItems = function() {
        $scope.selectedItems = new Array();
        $('#mediaItems input:checkbox').each(function() {
            var checked = $(this).is(':checked');
            if (checked) {
                var id = $(this).attr('id');
                for (var i in $scope.mediaItems) {
                    var media = $scope.mediaItems[i];
                    if (id == media.identifier) {
                        $scope.selectedItems.push(media);
                    }
                }
            }
        })
        $('#activityItems input:checkbox').each(function() {
            var checked = $(this).is(':checked');
            if (checked) {
                var id = $(this).attr('id');
                for (var i in $scope.activityItems) {
                    var media = $scope.activityItems[i];
                    if (id == media.identifier) {
                        $scope.selectedItems.push(media);
                    }
                }
            }
        })
        if ($scope.selectedItems.length > 0) {
            $('#fileList').html('');
            $('#importMedia').hide();
        }
    };

    $scope.createContent = function() {
        for (var i in $scope.selectedItems) {
            delete $scope.selectedItems[i]['$$hashKey'];
        }
        $http.post("/private/v1/content/create/" + encodeURIComponent($scope.courseId), $scope.selectedItems).success(function(data) {
            $window.location.replace('/studio/content/' + encodeURIComponent($scope.courseId));
        });
    };


    // New Content Media Upload Start 

    $scope.fileCounter = 0;
    $scope.newContentMediaItems = [];

     $scope.createNewContent = function() {
        $scope.mediaContentUploader.startUpload();
     };

    $scope.onFilesSelect = function() {
        return true;
    }

    $scope.onUploadSuccess = function(files, response, xhr) {
        $scope.fileCounter++;
        $scope.newContentMediaItems.push(response);
        if ($scope.fileCounter == ($scope.mediaContentUploader.fileCounter-1)) {
            $.post("/private/v1/content/createNew/"+encodeURIComponent($('#courseId').val()), {'mediaItems': $scope.newContentMediaItems, 'content': $scope.content})
            .success(function(data){
                newContentMediaItems =[];
                $window.location.replace('/studio/content/' + encodeURIComponent($('#courseId').val()));
            });
        }
    }; 

    $scope.showSelectMediaGadget = function(contentType, contentSubType) {
        $scope.content.formPage=2;
        var allowedTypes = $scope.getAllowedTypes(contentType, contentSubType);
        $scope.content.allowedTypes = allowedTypes;
        $timeout(function() {
            $(".ajax-upload-dragdrop").remove();
        }, 500);    
        $timeout(function() {
            $scope.mediaContentUploader = $("#fileuploader").uploadFile({
                url:"/private/v1/content/createMedia/" + encodeURIComponent($('#courseId').val()),
                formData : {"from" : "FILE"},
                fileName:"mediafile",
                autoSubmit:false,
                multiple:true,
                maxFileCount:1,
                allowedTypes: allowedTypes,
                showStatusAfterSuccess:false,
                showCancel:false,
                showAbort:false,
                showProgress:true,
                dragDropStr: "<span><b> (or) Drag & Drop files here</b></span>",
                statusBarDiv: 'fileList',
                onSelect : $scope.onFilesSelect,
                onSuccess: $scope.onUploadSuccess
            });
        }, 500);

    };

    // New Content Media Upload - END

    // Quiz - Start
    $scope.incrementQuizIndex = function() {
        $scope.quizIndex++;
    }

    $scope.decrementQuizIndex = function() {
      $scope.quizIndex--;
    };

    // Quiz - End

    //Interceptions - Start
    
    $scope.showInterceptions = function(conceptMedia, divId) {
        $scope.interception.action = 'VIEW';
        $scope.selectMedia(conceptMedia, divId);
    }

    $scope.showAddInterception = function() {
        $scope.interception.action = 'NEW';
    };

    $scope.showInterceptionMediaSelect = function() {
        $scope.interception.action = 'ADDMEDIA';
        $scope.content.contentType = 'lecture';
        var allowedTypes = 'video,doc,powerpoint,pdf';
        $scope.incpFileCounter = 0;
        $timeout(function() {
            $(".ajax-upload-dragdrop").remove();
        }, 500);    
        $timeout(function() {
            $scope.incpMediaUploader = $("#incpMediaUploader").uploadFile({
                url:"/private/v1/content/createMedia/" + encodeURIComponent($('#courseId').val()),
                formData : {"from" : "FILE"},
                fileName:"mediafile",
                autoSubmit:false,
                multiple:false,
                maxFileCount:1,
                allowedTypes: allowedTypes,
                showStatusAfterSuccess:false,
                showCancel:false,
                showAbort:false,
                showProgress:true,
                dragDropStr: "<span><b> (or) Drag & Drop files here</b></span>",
                statusBarDiv: 'incpMediaUploaderFileList',
                onSelect : $scope.onIncpFilesSelect,
                onSuccess: $scope.onIncpFileUploadSuccess
            });
        }, 500);
        $http.get('/private/v1/content/getAllMedia/').success(function(data) {
            $scope.mediaItems = new Array();
            $scope.mediaItems = data;
            $scope.repoSelectedItems = [];
        });
    };

    $scope.onIncpFilesSelect = function() {
        $('#uploadIncpMediaFiles').show();
        return true;
    };

    $scope.onIncpFileUploadSuccess = function(files, response, xhr) {
        $scope.incpFileCounter++;
        if($scope.incpFileCounter == ($scope.incpMediaUploader.fileCounter-1)) {

        }
    };

    $scope.addInterception = function() {
        var currentContentId = $scope.currentContent.identifier;
        console.log("$scope.interception.contentId",$scope.interception.contentId);
        var name = "";
        $http.get('/private/v1/content/getContent/' + encodeURIComponent($scope.interception.contentId)).success(function(data) {
            name = data.name;
            var interception = 
            {
                'name' : name,
                'contentId' : $scope.interception.contentId,
                'mediaId' : $scope.interception.contentMedia.mediaId, 
                'interceptionPoint' : $scope.interception.interceptionPoint
            };
            addInterception(currentContentId, interception);
        });
        
        
    }

    function addInterception(currentContentId, interception) {
        alert("Add interceptin function called with "+currentContentId+"::"+interception);
        $http.post('/private/v1/content/addInterception', {'contentId' : currentContentId, 'interception' : interception}).success(function(data) {
            $scope.currentContent = data;
            initInterception();
        });
    }
    //Interceptions - End
});
