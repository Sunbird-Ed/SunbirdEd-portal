app.directive('ngEnter', function() {
    return function(scope, element, attrs) {
        element.bind("keydown keypress", function(event) {
            if (event.which === 13) {
                scope.$apply(function() {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});

app.service('InteractionService', ['$http', '$q', '$rootScope', function($http, $q, $rootScope) {

    this.interactionFilter = {concepts:[]};

    this.postToService = function(url, data) {
        var deferred = $q.defer();
        $http.post(url, data).success(function(resp) {
            if (!resp.error)
                deferred.resolve(resp);
            else
                deferred.reject(resp.error);
        });
        return deferred.promise;
    }
    this.getFromService = function(url, data) {
        var deferred = $q.defer();
        $http.get(url, data).success(function(resp) {
            if (!resp.error)
                deferred.resolve(resp);
            else
                deferred.reject(resp.error);
        });
        return deferred.promise;
    }

    this.getInteractions = function(query, scope) {
        return this.postToService('/private/v1/interactions/list', query);
    }
    this.getInteraction = function(interaction) {
        return this.getFromService('/private/v1/interactions/' + interaction.interactionId + '/' + encodeURIComponent(interaction.courseId));
    }
    this.saveInteraction = function(interaction) {
        return this.postToService('/private/v1/interactions', interaction);
    }
    this.answerInteraction = function(data) {
        return this.postToService('/private/v1/interactions/answer', data);
    }
    this.commentInteraction = function(data) {
        return this.postToService('/private/v1/interactions/comment', data);
    }
    this.interactionAction = function(data) {
        return this.postToService('/private/v1/interactions/action', data);
    }
    this.tagInteraction = function(data) {
        return this.postToService('/private/v1/interactions/tag', data);
    }
    this.searchInteractions = function(data) {
        return this.postToService('/private/v1/interactions/search', data);
    }
    this.updateMetadata = function(data) {
        return this.postToService('/private/v1/interactions/updateMetadata', data);
    }
    this.rate = function(data) {
        return this.postToService('/private/v1/interactions/rate', data);
    }
    this.follow = function(data) {
        return this.postToService('/private/v1/interactions/follow', data);
    }
    this.actionsMetadata = function(forumType) {
        return this.postToService('/private/v1/interactions/actionsMetadata', {forumType: forumType});
    }
    this.getSets = function(data) {
        return this.postToService('/private/v1/interactions/sets', data);
    }
    this.getSet = function(data) {
        return this.postToService('/private/v1/interactions/set', data);
    }
    this.checkRole = function(data) {
        return this.postToService('/private/v1/interactions/checkRole', data);
    }
    this.createSet = function(data) {
        return this.postToService('/private/v1/interactions/createSet', data);
    }
    this.updateSet = function(data) {
        return this.postToService('/private/v1/interactions/updateSet', data);
    }
    this.addInteractionToSet = function(data) {
        return this.postToService('/private/v1/interactions/addInteractionToSet', data);
    }
    this.removeInteractionFromSet = function(data) {
        return this.postToService('/private/v1/interactions/removeInteractionFromSet', data);
    }
    this.deleteSet = function(data) {
        return this.postToService('/private/v1/interactions/deleteSet', data);
    }
    this.getMyStudents = function(courseId) {
        return this.getFromService('/private/v1/coaching/senderList/' + encodeURIComponent(courseId));
    }
}]);

app.controller('BaseInteractionController',['$scope', '$http', '$timeout', '$rootScope', 'InteractionService', '$stateParams', 'CourseBrowserService', '$state', function($scope, $http, $timeout, $rootScope, service, $stateParams, cbService, $state) {

    $scope.conceptsList = cbService.conceptsList;
    $scope.allLectures = cbService.serializedTOC;
    $scope.environment = 'Forums';
    $rootScope.courseTitle = cbService.toc.name;
    $rootScope.learningElementTitle = cbService.toc.name;
    $scope.interactions = [];
    $scope.comments = [];
    $scope.interactionTitle;
    $scope.interactionPost;
    $scope.commentPost;
    $scope.interactionFromList;
    $scope.selectedInteraction;
    $scope.interactionError = function(error) {
        $scope.pageLoadComplete = true;
        return undefined;
    };
    $scope.interactionUpdate = undefined;
    $rootScope.interactionsSearch = {
        order: 'topRated',
        filter: '',
        query: ''
    };
    $scope.pageLoadComplete = false;

    $scope.getElementName = function(elementId) {
        if(!elementId) return '';
        elementId = cbService.removeFedoraPrefix(elementId);
        var element;
        if (cbService.moduleMap[elementId]) {
            element = cbService.moduleMap[elementId];
        } else if (cbService.lessonMap[elementId]) {
            element = cbService.lessonMap[elementId];
        } else if (cbService.lectureMap[elementId]) {
            element = cbService.lectureMap[elementId];
        }
        if(element) {
            return element.name;
        }
        return '';
    }

    $scope.hasMore = false;
    $scope.showMoreLoading = false;
    var MAX_INTERACTIONS = 500;
    $scope.showMore = function() {
        $scope.showMoreLoading = true;
        var offset = $scope.interactions.length + 1;
        $scope._searchInteractions(offset, true);
    }

    $scope.canShowMore = function(response) {
        if(response && null != response && response.length == 20) {
            $scope.hasMore = true;
        } else {
            $scope.hasMore = false;
        }
        if($scope.interactions.length >= MAX_INTERACTIONS) {
            $scope.hasMore = false;
        }
        $scope.showMoreLoading = false;
    }

    $rootScope.searchInteractions = function() {
        $scope._searchInteractions(0, false);
    }

    $scope.saveInteraction = function() {
        var questionTitle = $.trim($('#askQuestionTxt').val());
        var questionBody = $.trim($('#askQuestionTxtArea').val());
        $('#validateMessage').addClass('hide');
        if(questionTitle == '' || questionBody == '' || !$scope.selectedLecture){
            $('html,body').scrollTop(0);
            $('#validateMessage').html('Please fill all the fields').removeClass('hide');
            return false;
        }
        if($scope.metadata.interactionType == 'TutorQA' && $scope.showStudentsDD && !$scope.to) {
            $('html,body').scrollTop(0);
            $('#validateMessage').html('Please fill all the fields').removeClass('hide');
            return false;
        }

        $('#saveInteractions').html('Posting...').attr('disabled', true);
        var intObject = {
            title: $scope.interactionTitle,
            post: $scope.interactionPost,
            metadata: {},
            courseId: $scope.courseId
        }
        $scope.setSaveMetadata(intObject);
        service.saveInteraction(intObject).then(function(response) {
            $('#saveInteractions').html('Post Question').attr('disabled', false);
            $('#askQuestionTxt, #askQuestionTxtArea').val('');
            $('.wmd-preview').html('');
            $scope.interactionPost = '';
            $scope.showAddQuestion = false;
            $timeout(function(){$('#writeIcon').trigger('click');}, 10);
            response.INTERACTION.elementName = $scope.getElementName(response.INTERACTION.contextMetadata.learningElementId);
            if(response.INTERACTION.concepts && response.INTERACTION.concepts.length > 0) {
                response.INTERACTION.conceptNames = [];
                response.INTERACTION.concepts.forEach(function(id) {
                    response.INTERACTION.conceptNames.push({id: id, concept: $rootScope.conceptTitleMap[id]});
                });
            }
            response.INTERACTION.userName = response.INTERACTION.systemMetadata.userName;
            response.INTERACTION.createdDate = response.INTERACTION.systemMetadata.createdDate;
            $scope.interactions.splice(0, 0, response.INTERACTION);
        }, $scope.interactionError);
    }

    $scope.answerInteraction = function(interaction, scope) {
        var answerObject = {
            title: 'RE:' + interaction.title,
            post: scope.comment,
            interaction: interaction
        }

        service.answerInteraction(answerObject).then(function(response) {
            response.responseValueObjects.COMMENT.post = scope.comment;
            if(!response.responseValueObjects.COMMENT.metadata) {
                response.responseValueObjects.COMMENT.metadata = {};
            }
            $('.wmd-input').val('');
            if(!interaction.comments) interaction.comments = [];
            interaction.comments.push(response.responseValueObjects.COMMENT);
            $scope.updateSummary(interaction, 'commentsCount', true);
            $scope.addActionHash(interaction, 'answer');
            $scope.highlightCode();
        }, $scope.interactionError);
    }

    $scope.commentInteraction = function(comment, interaction) {
        var commentObject = {
            title: 'RE:' + interaction.title,
            post: comment,
            interaction: interaction,
            rootInteractionId: $scope.selectedInteraction.interactionId,
            courseId: $scope.courseId
        }
        service.commentInteraction(commentObject).then(function(response) {
            if(!interaction.postComments) interaction.postComments = [];
            response.responseValueObjects.COMMENT.post = comment;
            interaction.postComments.push(response.responseValueObjects.COMMENT);
            interaction._comment = '';
            $scope.addActionHash(interaction, 'commentOnPost');
        }, $scope.interactionError);
    }

    $scope.askQuestion = function() {
        if($scope.showSearch) {
            $scope.showSearch = !$scope.showSearch;
            $('#listFilters').slideToggle();
            $('#advancedSearchIcon').toggleClass('fa-toggle-down');
            $('#advancedSearchIcon').toggleClass('fa-close');
        }
        $scope.showAddQuestion = !$scope.showAddQuestion;
        $timeout(function() {
            $('#askQuestion').slideToggle('slow');
            $('#writeIcon').toggleClass('fa-close');
            $('#writeIcon').toggleClass('fa-edit');
        }, 100);
    }

    $scope.$on('showInteractions', function(e) {
        $scope.showInteractions();
    });

    $scope.getActionsMetadata = function() {
        if(null == $rootScope.actionsMetadata) {
            service.actionsMetadata($scope.metadata.interactionType).then(function(data) {
                $rootScope.actionsMetadata = data;
            });
        }
    }

    $scope.updateSummary = function(post, property, increment) {
        var isInteraction = (post.contextMetadata.type == 'interaction');
        if(!post.summaries) {
            post.summaries = {};
        }
        if(isInteraction && !$scope.interactionFromList.summaries)
            $scope.interactionFromList.summaries = {};
        if (!post.summaries[property]) {
            post.summaries[property] = 0;
            if(isInteraction)
                $scope.interactionFromList.summaries[property] = 0;
        }
        if (increment) {
            post.summaries[property] += 1;
            if(isInteraction) $scope.interactionFromList.summaries[property] += 1;
        } else {
            post.summaries[property] -= 1;
            if(isInteraction) $scope.interactionFromList.summaries[property] -= 1;
        }
    }

    $scope.addActionHash = function(post, action) {
        $scope.selectedInteraction.actionsHash.push($scope.getActionHash(post, $scope.selectedInteraction, action));
    }

    $scope.removeActionHash = function(post, action) {
        var hash = $scope.getActionHash(post, $scope.selectedInteraction, action);
        var index = $scope.selectedInteraction.actionsHash.indexOf(hash);
        $scope.selectedInteraction.actionsHash.splice(index, 1);
    }

    $scope.action = function(actionName, interaction, actionValue, actionMsg) {
        actionValue = actionValue || "true";
        var actionObj = {
            interactionId: $scope.selectedInteraction.interactionId,
            action: actionName,
            actionValue: actionValue,
            actionMsg: actionMsg || "",
            courseId: $scope.courseId
        }
        if (interaction.commentId) {
            actionObj.commentId = interaction.commentId;
        }
        service.interactionAction(actionObj).then(function(response) {
            interaction.metadata[actionName] = (actionValue == 'true');
        }, $scope.interactionError);
    };

    $scope.flag = function(actionName, interaction, actionValue, actionMsg) {
        $scope.action(actionName, interaction, actionValue, actionMsg);
    };

    $scope.markAnswered = function(post, interaction, answered) {
        if(answered) {
            $scope.action('markAsAnswered', post, "true");
            $scope.action('markAsAnswered', interaction, "true");
            $scope.addActionHash(interaction, 'markAsAnswered');
        } else {
            $scope.action('markAsAnswered', post, "false");
            $scope.action('markAsAnswered', interaction, "false");
            $scope.removeActionHash(interaction, 'markAsAnswered');
        }
    }

    $scope.follow = function(interaction, follow) {
        var data = {
            interactionId: interaction.interactionId,
            courseId: $scope.courseId,
            follow: follow
        }
        if(follow) {
            $scope.updateSummary(interaction, 'followCount', true);
            $scope.addActionHash(interaction, 'follow');
        } else {
            $scope.updateSummary(interaction, 'followCount', false);
            $scope.removeActionHash(interaction, 'follow');
        }
        service.follow(data).then(function(response) {}, $scope.interactionError);
    }

    $scope.rate = {
        data: {
            upVote: false,
            courseId: $scope.courseId,
            commentId: undefined,
            interactionId: undefined
        },
        up: function(interaction) {
            $scope.rate.data.upVote = true;
            $scope.rate.rate(interaction);
        },
        down: function(interaction) {
            $scope.rate.data.upVote = false;
            $scope.rate.rate(interaction);
        },
        rate: function(interaction) {
            $scope.rate.data.interactionId = $scope.selectedInteraction.interactionId;
            if (interaction.commentId) {
                $scope.rate.data.commentId = interaction.commentId;
            } else {
                $scope.rate.data.commentId = undefined;
            }
            $scope.updateSummary(interaction, 'rateCount', true);
            $scope.addActionHash(interaction, 'rate');
            service.rate($scope.rate.data).then(function(response) {}, $scope.interactionError);
        }
    }

    $scope.tag = function(tagName, interaction) {
        var args = {
            interaction: interaction,
            tag: tagName,
            courseId: $scope.courseId
        }
        service.tagInteraction(args).then(function(response) {
            //@TODO: update interaction details
        }, $scope.interactionError);
    }

    /** SV - Generic action evaluater. Please do not modify */
    $scope.defaultActionEvaluation = function(post, interaction, scope, action) {

        var actionMetadata = $scope.getActionMetadata(post.contextMetadata.type + '_' + action);
        if(!actionMetadata || null == actionMetadata) {
            $scope.setActionState(scope, 'hidden');
            return;
        }
        if(!$scope.userCan(action, actionMetadata)) {
            scope.userHasAccess = false;
            return;
        }
        scope.userHasAccess = true;

        scope.userIntRole = $scope.getUserInteractionRole(post, interaction);
        var intRole = actionMetadata.roles[scope.userIntRole];
        if(!intRole) {
            return;
        }

        if(intRole.access) {
            switch(actionMetadata.occurrenceType) {
                case 'PerUser':
                    var rateHash = $scope.getActionHash(post, interaction, action);
                    var counts = $scope.actionHashCounts(interaction.actionsHash);
                    var userActed = false;
                    if(counts[rateHash] && counts[rateHash] >= actionMetadata.occurrence) {
                        userActed = true;
                    }
                    if(userActed) {
                        $scope.setActionState(scope, intRole.actionDisplayState);
                    } else {
                        $scope.setActionState(scope, intRole.accessDisplayState);
                    }
                    break;
                case 'PerPost':
                    if(post.contextMetadata[action]) {
                        $scope.setActionState(scope, intRole.actionDisplayState);
                    } else {
                        $scope.setActionState(scope, intRole.accessDisplayState);
                    }
                    break;
                case 'PerInteraction':
                    if(interaction.contextMetadata[action]) {
                        $scope.setActionState(scope, intRole.actionDisplayState);
                    } else {
                        $scope.setActionState(scope, intRole.accessDisplayState);
                    }
                    break;
                case 'Any':
                    $scope.setActionState(scope, intRole.accessDisplayState);
                    break;
            }
        } else {
            $scope.setActionState(scope, intRole.accessDisplayState);
        }
    }

    $scope.userCan = function(action, actionMetadata) {
        if($rootScope.actionsMetadata.privileges && $rootScope.actionsMetadata.privileges[action]) {
            return $rootScope.actionsMetadata.privileges[action];
        } else if(actionMetadata && typeof actionMetadata.defaultUserPrivilege != 'undefined') {
            return actionMetadata.defaultUserPrivilege;
        }
        return false;
    }

    $scope.getUserInteractionRole = function(post, interaction) {
        var userRole = $scope.actionsMetadata.interactionRole;
        if(interaction.isOwner) {
            userRole = 'interactionOwner';
        }
        if(post.isOwner) {
            userRole = 'postOwner';
        }
        if(userRole == null || userRole == '' || typeof userRole == 'undefined') {
            userRole = 'user';
        }
        return userRole;
    }

    $scope.getActionMetadata = function(action) {
        return $rootScope.actionsMetadata.actions[action];
    }

    $scope.getActionHash = function(post, interaction, action) {
        var uid = decode64(interaction.uid);
        var hash = CryptoJS.MD5(uid + '~' + (post.contextMetadata.type == 'interaction' ? post.interactionId : post.commentId) + '~' + action);
        return CryptoJS.enc.Base64.stringify(hash);
    }

    $scope.setActionState = function(scope, state) {
        switch(state.toLowerCase()) {
            case 'hidden':
                scope.hidden = true;
                break;
            case 'enabled':
                scope.enabled = true;
                break;
            case 'disabled':
                scope.disabled = true;
                break;
            case 'editable':
                scope.editable = true;
                break;
        }
    }

    $scope.actionHashCounts = function(actionsHash) {
        var counts = {};
        for (var i = 0; i < actionsHash.length; i++) {
            counts[actionsHash[i]] = (counts[actionsHash[i]] + 1) || 1;
        }
        return counts;
    }

    $scope.highlightCode = function() {
        $timeout(function() {
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });
        }, 1000);
    }

    $scope.selectInteraction = function(interaction) {
        if(null == $rootScope.actionsMetadata) {
            service.actionsMetadata($scope.metadata.interactionType).then(function(data) {
                $rootScope.actionsMetadata = data;
                $scope.getInteraction(interaction);
            });
        } else {
            $scope.getInteraction(interaction);
        }
    }

    $scope.getInteraction = function(interaction) {
        $scope.loadingInteraction = true;
        $scope.comments = [];
        interaction.courseId = $scope.courseId;
        $scope.interactionFromList = interaction;
        service.getInteraction(interaction).then(function(response) {
            $scope.selectedInteraction = response;
            if(!cbService.currentItem.id || null == cbService.currentItem.id) {
                if($scope.selectedInteraction.contextMetadata.learningElementId) {
                    cbService.currentItem.id = cbService.removeFedoraPrefix($scope.selectedInteraction.contextMetadata.learningElementId);
                }
            }
            $scope.highlightCode();
            $scope.pageLoadComplete = true;
            $timeout(function() {
                $('.dropdown-menu textarea').click(function(e) {
                    e.stopPropagation();
                });
            }, 100);
            var elementTitle = 'Q:' + $scope.selectedInteraction.title;
            if(elementTitle.length > 70) {
                elementTitle = elementTitle.substr(0, 70) + '...';
            }
            $rootScope.learningElementTitle = elementTitle.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g, "'");
            $scope.loadingInteraction = false;
        }, $scope.interactionError);
    }

    // Date picker
    $scope.datepicker = {
        fromOpened: false,
        toOpened: false,
        dateOptions: {
            formatYear: 'yy',
            startingDay: 1,
            showWeeks: false
        }
    }
    $scope.open = function($event, type) {
        $event.preventDefault();
        $event.stopPropagation();
        if(type == 'from') $scope.datepicker.fromOpened = true;
        if(type == 'to') $scope.datepicker.toOpened = true;
    };

    $scope.disableKeyDown = function($event) {
        $event.preventDefault();
        $event.stopPropagation();
    }

    $scope.showSearchForm = function() {
        if($scope.showAddQuestion) {
            $scope.showAddQuestion = !$scope.showAddQuestion;
            $('#askQuestion').slideToggle();
            $('#writeIcon').toggleClass('fa-close');
            $('#writeIcon').toggleClass('fa-edit');
        }
        $scope.showSearch = !$scope.showSearch;
        $('#listFilters').slideToggle('slow');
        $('#advancedSearchIcon').toggleClass('fa-toggle-down');
        $('#advancedSearchIcon').toggleClass('fa-close');
    }

}]);