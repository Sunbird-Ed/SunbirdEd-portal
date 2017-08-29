'use strict';

/**
 * @ngdoc service
 * @name playerApp.contentStateService
 * @description
 * # contentStateService
 * Service in the playerApp.
 */
angular.module('playerApp')
        .service('contentStateService', ['$filter', '$rootScope', 'httpServiceJava', 'config', 
            'uuid4', 'dataService', function ($filter, $rootScope, httpServiceJava, config, uuid4, dataService) {
            var localContentState = localContentState || {};
            var self = this;
            this.init = function () {
                org.sunbird.portal.eventManager.addEventListener('sunbird:telemetry:flush', self.updateContentState);
                org.sunbird.portal.eventManager.addEventListener('sunbird:player:telemetry', self.updateContentState);
            };
            // getContentState

            this.getContentsStateFromAPI = function (req) {
                return httpServiceJava.post(config.URL.COURSE.USER_CONTENT_STATE_READ, req);
            };

            this.updateContentStateInServer = function (req) {
                return httpServiceJava.patch(config.URL.COURSE.USER_CONTENT_STATE_UPDATE, req);
            };
            this.prepareContentObject = function (data) {
                var content = {
                    contentId: $rootScope.contentId, // data['gdata']['id'],
                    status: 1,
                    lastAccessTime: $filter('date')(new Date(data.ets), 'yyyy-MM-dd HH:mm:ss:sssZ'),
                    courseId: _.find(data.cdata, { type: 'course' }).id,
                    batchId: $rootScope.enrolledCourseIds[_.find(data.cdata, { type: 'course' }).id].batchId
                };
                var contentStatusData = _.find(localContentState[content.courseId].contents, { contentId: content.contentId });
                if (contentStatusData && contentStatusData.status > content.status) {
                    content.status = contentStatusData.status;
                }
                if (data.eid === 'OE_END' && data.edata && data.edata.eks && data.edata.eks.progress) {
                    content.progress = parseInt(data.edata.eks.progress);
                    if (data.edata.eks.progress == 100) {
                        content.status = 2;
                    }
                }
                return content;
            };

            this.getContentsState = function (req, callback) {
                // accepts only one course id and multiple contentids

                if (_.isEmpty(localContentState) || !localContentState[req.request.courseIds[0]]) {
                    var courseId = req.request.courseIds[0];
                    localContentState[courseId] = {};
                    localContentState[courseId].contents = [];
                    this.getContentsStateFromAPI(req).then(function (res) {
                        if (res && res.responseCode === 'OK') {
                            localContentState[courseId].contents = res.result.contentList;
                        }
                        callback(localContentState[courseId].contents);
                    }, function () {
                        callback(localContentState[courseId].contents);
                    });
                } else {
                    callback(localContentState[req.request.courseIds[0]].contents);
                }
            };
            // Listen to the Events

            self.updateContentState = function (e, data) {
                if (data && (data.eid === 'OE_START' || data.eid === 'OE_END') && dataService.getData('isTrackingEnabled') == true) {
                    var content = self.prepareContentObject(data);
                    var prevContentStatus = -1;
                    // local updated
                    if (localContentState[content.courseId] && localContentState[content.courseId].contents) {
                        var obj = _.find(localContentState[content.courseId].contents, { contentId: content.contentId, courseId: content.courseId });
                        var i = _.findIndex(localContentState[content.courseId].contents, { contentId: content.contentId, courseId: content.courseId });
                        if (obj) {
                            localContentState[content.courseId].contents[i].progress = (content.progress && obj.progress && parseInt(obj.progress) < content.progress) ? content.progress : localContentState[content.courseId].contents[i].progress;
                            localContentState[content.courseId].contents[i].lastAccessTime = content.lastAccessTime;
                            prevContentStatus = localContentState[content.courseId].contents[i].status;
                            localContentState[content.courseId].contents[i].status = content.status;
                        } else if (i === -1) {
                            localContentState[content.courseId].contents.push(content);
                        }
                    }
                    localContentState[content.courseId].currentContent = content.contentId;
                    // update in API
                    var req = {
                        id: uuid4.generate(),
                        ts: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss:sssZ'),
                        params: {

                        },
                        request: {
                            userId: $rootScope.userId,
                            contents: [content]
                        }
                    };
                    console.log('called flush');
                    // dont check response for now
                    if (prevContentStatus < content.status) {
                        self.updateContentStateInServer(req).then(function (res) {});
                    }
                }
            };
        }]);
