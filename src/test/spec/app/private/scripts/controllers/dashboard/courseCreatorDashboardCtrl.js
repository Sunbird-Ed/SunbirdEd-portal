'use strict'

describe('Controller:courseCreatorDashboardCtrl', function () {
  // load the controller's module
  beforeEach(module('playerApp'))

  beforeEach(inject(function ($rootScope, $controller) {
    $controller('AppCtrl', {
      $rootScope: $rootScope,
      $scope: $rootScope.$new()
    })
  }))

  var searchService,
    scope,
    rootScope,
    courseCreatorDashboard,
    courseDashboard,
    dashboardService,
    $q,
    deferred,
    timeout,
    createContoller,
    listOfCoursesCreatedByMeResoponse = {'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-10-03T07:28:19.590Z', 'params': {'resmsgid': '6df47260-a80c-11e7-957c-fd247bccbccc', 'msgid': '6def1b30-a80c-11e7-8721-cf66ba49ca1b', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'count': 12, 'content': [{'code': 'do_2123248512249446401377', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['Bengali'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-04T04:14:00.545+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-27T11:23:23.893+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_2123248512249446401377', 'createdFor': ['01231515334617497640', 'ORG_001'], 'creator': 'Content Creator For Demo', 'audience': ['Instructor'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1504498440545', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled Course', 'IL_UNIQUE_ID': 'do_2123248512249446401377', 'status': 'Draft', 'node_id': 65679, 'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_20051864/artifact/a2b1d5cf96ad28f15e79df61dbb21fdf_1478083821843.jpeg', 'keywords': [], 'description': 'Untitled Course', 'faculty': [], 'tutor': [], 'children': ['do_2122162678233579521298'], 'es_metadata_id': 'do_2123248512249446401377'}, {'code': 'org.sunbird.N1aCB2', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-06T07:31:20.161+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-06T07:31:20.161+0000', 'contentEncoding': 'gzip', 'contentType': 'LessonPlan', 'identifier': 'do_212326363792678912135', 'createdFor': ['01231515334617497640', 'ORG_001'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1504683080161', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled lesson plan', 'IL_UNIQUE_ID': 'do_212326363792678912135', 'status': 'Draft', 'node_id': 66259, 'es_metadata_id': 'do_212326363792678912135'}, {'subject': 'Hindi', 'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123165408517406721432/lessonws_1503484120499_do_2123165408517406721432_1.0.ecar', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'variants': '{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123165408517406721432/lessonws_1503484120567_do_2123165408517406721432_1.0_spine.ecar","size":972.0}}', 'mimeType': 'application/vnd.ekstep.ecml-archive', 'editorState': '{"plugin":{"noOfExtPlugins":2,"extPlugins":[{"plugin":"org.ekstep.contenteditorfunctions","version":"1.0"},{"plugin":"org.ekstep.keyboardshortcuts","version":"1.0"}]},"stage":{"noOfStages":1,"currentStage":"06e3b358-217b-441d-932a-543e81993478","selectedPluginObject":"106dbb78-e8db-4c9d-a4d3-47c4c60e9ad1"},"sidebar":{"selectedMenu":"settings"}}', 'objectType': 'Content', 'gradeLevel': ['Kindergarten'], 'appId': 'sunbird_portal', 'contentEncoding': 'gzip', 'artifactUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123165408517406721432/artifact/1503484120416_do_2123165408517406721432.zip', 'contentType': 'Worksheet', 'lastUpdatedBy': 'kiran', 'identifier': 'do_2123165408517406721432', 'audience': ['Learner'], 'visibility': 'Default', 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'lastPublishedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'prevState': 'Review', 'size': 1738, 'lastPublishedOn': '2017-08-23T10:28:40.499+0000', 'IL_FUNC_OBJECT_TYPE': 'ContentImage', 'name': 'LessonWS', 'status': 'Draft', 'code': 'org.sunbird.UMOHOj', 'flags': [''], 'description': 'dessd', 'lastFlaggedOn': '2017-08-23T13:00:32.655+0000', 'medium': 'Hindi', 'flaggedBy': ['kiran'], 'idealScreenSize': 'normal', 'createdOn': '2017-09-01T06:53:19.462+0000', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-30T11:16:51.432+0000', 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-08-23T10:28:40.824+0000', 'creator': 'Content Creator For Demo', 'createdFor': ['01231515334617497640'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'os': ['All'], 'pkgVersion': 1, 'versionKey': '1504248799462', 'idealScreenDensity': 'hdpi', 's3Key': 'ecar_files/do_2123165408517406721432/lessonws_1503484120499_do_2123165408517406721432_1.0.ecar', 'lastSubmittedOn': '2017-08-23T10:27:32.257+0000', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 2, 'IL_UNIQUE_ID': 'do_2123165408517406721432.img', 'node_id': 64074, 'es_metadata_id': 'do_2123165408517406721432'}, {'code': 'org.sunbird.gXscLI', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-29T06:34:34.044+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-29T06:34:34.044+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_2123206735793766401725', 'createdFor': ['01231515334617497640'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503988474044', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'c', 'IL_UNIQUE_ID': 'do_2123206735793766401725', 'status': 'Draft', 'node_id': 62475, 'es_metadata_id': 'do_2123206735793766401725'}, {'code': 'org.sunbird.tzhykP', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-29T06:29:32.429+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-29T06:29:32.429+0000', 'contentEncoding': 'gzip', 'contentType': 'Collection', 'identifier': 'do_2123206711085465601719', 'createdFor': ['01231515334617497640'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503988172429', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Collection1', 'IL_UNIQUE_ID': 'do_2123206711085465601719', 'status': 'Draft', 'node_id': 62469, 'es_metadata_id': 'do_2123206711085465601719'}, {'code': 'org.sunbird.TDr4Ms', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-29T06:27:27.179+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-29T06:27:27.179+0000', 'contentEncoding': 'gzip', 'contentType': 'Collection', 'identifier': 'do_2123206700824985601716', 'createdFor': ['01231515334617497640'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503988047179', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'c1', 'IL_UNIQUE_ID': 'do_2123206700824985601716', 'status': 'Draft', 'node_id': 62466, 'es_metadata_id': 'do_2123206700824985601716'}, {'code': 'org.sunbird.jH2Zfu', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.ecml-archive', 'idealScreenSize': 'normal', 'createdOn': '2017-08-29T05:49:34.205+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-29T05:49:55.173+0000', 'contentEncoding': 'gzip', 'contentType': 'Story', 'identifier': 'do_2123206514622873601693', 'createdFor': ['01231515334617497640'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503985795173', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 2, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'qwerr', 'IL_UNIQUE_ID': 'do_2123206514622873601693', 'status': 'Draft', 'node_id': 0, 'lastUpdatedBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'editorState': '{"plugin":{"noOfExtPlugins":2,"extPlugins":[{"plugin":"org.ekstep.contenteditorfunctions","version":"1.0"},{"plugin":"org.ekstep.keyboardshortcuts","version":"1.0"}]},"stage":{"noOfStages":1,"currentStage":"183b161c-0d8d-4306-9007-d8b59c682c9c","selectedPluginObject":"017bcb32-81ac-4aa8-820b-ad2537a39586"},"sidebar":{"selectedMenu":"settings"}}', 'me_totalTimespent': 5.75, 'me_totalInteractions': 8, 'me_totalSessionsCount': 2, 'me_averageInteractionsPerMin': 83.48, 'me_averageTimespentPerSession': 2.88, 'me_totalDevices': 1, 'me_averageSessionsPerDevice': 2, 'es_metadata_id': 'do_2123206514622873601693'}, {'subject': 'MATHS', 'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123165236346716161426/ayubbasha_23082017_1_1503482047537_do_2123165236346716161426_1.0.ecar', 'channel': '8668ff9d9571e4f31cf1b5ff633f0a8e', 'language': ['English', 'Bengali'], 'variants': '{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123165236346716161426/ayubbasha_23082017_1_1503482047768_do_2123165236346716161426_1.0_spine.ecar","size":175856.0}}', 'mimeType': 'application/vnd.ekstep.content-collection', 'objectType': 'Content', 'gradeLevel': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'], 'appId': 'ntp_portal', 'contentEncoding': 'gzip', 'mimeTypesCount': '{"application/vnd.ekstep.ecml-archive":2}', 'contentType': 'Collection', 'lastUpdatedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'identifier': 'do_2123165236346716161426', 'audience': ['Learner'], 'visibility': 'Default', 'toc_url': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123165236346716161426/artifact/do_2123165236346716161426toc.json', 'contentTypesCount': '{"Story":2}', 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'ageGroup': ['6-7', '7-8', '>10', '5-6', '8-10'], 'osId': 'org.ekstep.quiz.app', 'lastPublishedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'prevState': 'Review', 'size': 180281, 'lastPublishedOn': '2017-08-23T09:54:06.790+0000', 'IL_FUNC_OBJECT_TYPE': 'ContentImage', 'domain': ['numeracy'], 'name': 'AyubBasha_23082017_1', 'status': 'Draft', 'code': 'org.sunbird.N0DNaM', 'description': 'Test', 'medium': 'Bengali', 'idealScreenSize': 'normal', 'createdOn': '2017-09-01T12:12:41.094+0000', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-23T09:54:35.664+0000', 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-08-23T09:54:08.020+0000', 'creator': 'Content Creator For Demo', 'createdFor': ['01231515334617497640'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'os': ['All'], 'pkgVersion': 1, 'versionKey': '1504267961094', 'idealScreenDensity': 'hdpi', 's3Key': 'ecar_files/do_2123165236346716161426/ayubbasha_23082017_1_1503482047537_do_2123165236346716161426_1.0.ecar', 'lastSubmittedOn': '2017-08-23T09:53:14.226+0000', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'leafNodesCount': 2, 'compatibilityLevel': 1, 'IL_UNIQUE_ID': 'do_2123165236346716161426.img', 'node_id': 64239, 'children': ['do_2123144659903447041157', 'do_2122162678233579521298'], 'es_metadata_id': 'do_2123165236346716161426'}, {'code': 'org.sunbird.p6iKhl', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'description': 'Test1', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-23T09:49:59.535+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-23T09:49:59.535+0000', 'contentEncoding': 'gzip', 'contentType': 'Collection', 'identifier': 'do_2123165229017907201425', 'creator': 'Content Creator For Demo', 'createdFor': ['01231515334617497640'], 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503481799535', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'AyubBasha_23082017', 'IL_UNIQUE_ID': 'do_2123165229017907201425', 'status': 'Draft', 'node_id': 60895, 'es_metadata_id': 'do_2123165229017907201425'}]}}

  var zeroContentCreatedByMe = {
    id: 'api.v1.search',
    ver: '1.0',
    ts: '2017-09-22T11:42:07.455Z',
    params: {
      resmsgid: '0fecfef0-9f8b-11e7-b050-d9109721da9d',
      msgid: null,
      status: 'successful',
      err: null,
      errmsg: null
    },
    responseCode: 'OK',
    result: {count: 0, content: []}
  }

  var invalidResponse = {'id': 'api.sunbird.dashboard.course.consumption', 'ver': 'v1', 'ts': '2017-10-03 09:56:29:830+0000', 'params': {'resmsgid': null, 'msgid': '7637746d-a948-4c32-93a9-a384fb9608a4', 'err': 'UNAUTHORIZE_USER', 'status': 'SERVER_ERROR', 'errmsg': 'You are not authorized.'}, 'responseCode': 'CLIENT_ERROR', 'result': {}}
  var courseConsumptionData = {'id': 'api.sunbird.dashboard.course.consumption', 'ver': 'v1', 'ts': '2017-10-03 11:19:16:644+0000', 'params': {'resmsgid': null, 'msgid': '640e8d44-f86b-4fef-8a64-c270da84c818', 'err': null, 'status': 'success', 'errmsg': null}, 'responseCode': 'OK', 'result': {'period': '7d', 'series': {'course.consumption.time_spent': {'name': 'Timespent for content consumption', 'split': 'content.sum(time_spent)', 'time_unit': 'seconds', 'group_id': 'course.timespent.sum', 'buckets': [{'key': 1506424756638, 'key_name': '2017-09-26', 'value': 0.0}, {'key': 1506511156638, 'key_name': '2017-09-27', 'value': 0.0}, {'key': 1506597556638, 'key_name': '2017-09-28', 'value': 0.0}, {'key': 1506683956638, 'key_name': '2017-09-29', 'value': 0.0}, {'key': 1506770356638, 'key_name': '2017-09-30', 'value': 0.0}, {'key': 1506856756638, 'key_name': '2017-10-01', 'value': 0.0}, {'key': 1506943156638, 'key_name': '2017-10-02', 'value': 0.0}]}, 'course.consumption.content.users.count': {'name': 'Number of users by day', 'split': 'content.users.count', 'group_id': 'course.users.count', 'buckets': [{'key': 1506424756638, 'key_name': '2017-09-26', 'value': 0}, {'key': 1506511156638, 'key_name': '2017-09-27', 'value': 0}, {'key': 1506597556638, 'key_name': '2017-09-28', 'value': 0}, {'key': 1506683956638, 'key_name': '2017-09-29', 'value': 0}, {'key': 1506770356638, 'key_name': '2017-09-30', 'value': 0}, {'key': 1506856756638, 'key_name': '2017-10-01', 'value': 0}, {'key': 1506943156638, 'key_name': '2017-10-02', 'value': 0}]}}, 'course': {'courseId': 'do_2123207409836441601760'}, 'snapshot': {'course.consumption.time_spent.count': {'name': 'Total time of Content consumption', 'time_unit': 'seconds', 'value': 0.0}, 'course.consumption.time_per_user': {'name': 'User access course over time', 'value': 0}, 'course.consumption.users_completed': {'name': 'Total users completed the course', 'value': 0}, 'course.consumption.time_spent_completion_count': {'name': 'Average time per user for course completion', 'value': 0, 'time_unit': 'seconds'}}}}
  var failedCourseConsumptionResponse = {'id': 'api.sunbird.dashboard.course.consumption', 'ver': 'v1', 'ts': '2017-10-03 09:56:29:830+0000', 'params': {'resmsgid': null, 'msgid': '7637746d-a948-4c32-93a9-a384fb9608a4', 'err': 'UNAUTHORIZE_USER', 'status': 'SERVER_ERROR', 'errmsg': 'You are not authorized.'}, 'responseCode': 'CLIENT_ERROR', 'result': {}}
  var oneCourseCreatedByMeResponse = {'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-10-03T12:20:42.847Z', 'params': {'resmsgid': '468d06f0-a835-11e7-9540-dd4c0ac7eb23', 'msgid': '4686c560-a835-11e7-bd6c-9d0ff4b0760f', 'status': 'successful', 'err': null, 'errmsg': null}, 'responseCode': 'OK', 'result': {'count': 11, 'content': [{'code': 'org.sunbird.lsE3WP', 'channel': 'in.ekstep', 'description': 'Prod2', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-30T10:23:53.418+0000', 'objectType': 'Content', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-30T10:26:09.993+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_2123214940849602561867', 'creator': 'Content Creator For Demo', 'createdFor': ['01231515334617497640'], 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1504088769993', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 4, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Prod2', 'IL_UNIQUE_ID': 'do_2123214940849602561867', 'status': 'Live', 'node_id': 0, 'children': ['do_2122952599231856641325'], 'lastSubmittedOn': '2017-08-30T10:24:19.668+0000', 'lastUpdatedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'lastPublishedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123214940849602561867/prod2_1504088740705_do_2123214940849602561867_1.0.ecar', 'variants': '{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123214940849602561867/prod2_1504088741507_do_2123214940849602561867_1.0_spine.ecar","size":1430.0}}', 'pkgVersion': 1, 'prevState': 'Review', 's3Key': 'ecar_files/do_2123214940849602561867/prod2_1504088740705_do_2123214940849602561867_1.0.ecar', 'size': 4611516, 'lastPublishedOn': '2017-08-30T10:25:40.151+0000', 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-08-30T10:25:41.642+0000', 'toc_url': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123214940849602561867/artifact/do_2123214940849602561867toc.json', 'contentTypesCount': '{"Story":1}', 'leafNodesCount': 1, 'mimeTypesCount': '{"application/vnd.ekstep.ecml-archive":1}', 'me_averageRating': 0, 'me_totalSideloads': 0, 'me_totalDownloads': 2, 'me_totalComments': 0, 'me_totalRatings': 0, 'es_metadata_id': 'do_2123214940849602561867'}]}}

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$rootScope_, _$controller_, _searchService_, _$q_, _$timeout_, _dashboardService_) {
    rootScope = _$rootScope_
    scope = _$rootScope_.$new()
    searchService = _searchService_
    dashboardService = _dashboardService_,
    $q = _$q_
    timeout = _$timeout_
    deferred = _$q_.defer()

    createContoller = function () {
      return new _$controller_('courseCreatorDashboardCtrl', {
        $rootScope: rootScope,
        $scope: scope
      })
    }
  }))

  it('Should called search service', function () {
    spyOn(searchService, 'search').and.callThrough()
    searchService.search()
    expect(searchService.search).toBeDefined()
  })

  it('Should return list of courses createdByMe', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(listOfCoursesCreatedByMeResoponse)
    courseCreatorDashboard = createContoller()
    spyOn(courseCreatorDashboard, 'loadData').and.callThrough()
    courseCreatorDashboard.loadData()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseCreatorDashboard.getUpForReviewContent = response.result.content
    expect(courseCreatorDashboard.loadData).not.toBe(undefined)
  })

  // var request = {
  //   filters: {
  //     status: ["Live"],
  //     createdBy: $rootScope.userId,
  //     contentType: ["Course"]
  //   },
  //   sort_by: {
  //     lastUpdatedOn: "desc"
  //   }
  // };

  it('Should return only one course createdByMe', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(oneCourseCreatedByMeResponse)
    courseDashboard = createContoller()
    spyOn(courseDashboard, 'loadData').and.callThrough()
    courseDashboard.loadData()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseDashboard.getUpForReviewContent = response.result.content
    expect(courseDashboard.loadData).not.toBe(undefined)
  })

  it('onAfterCourseChange', function () {
    courseDashboard = createContoller()
    spyOn(courseDashboard, 'onAfterCourseChange').and.callThrough()
    courseDashboard.onAfterCourseChange('123', 'TestCourse')
  })

  it('onAfterFilterChange', function () {
    courseDashboard = createContoller()
    spyOn(courseDashboard, 'onAfterFilterChange').and.callThrough()
    courseDashboard.onAfterFilterChange('123')
  })

  it('Should initialize course dropdwon', function () {
    spyOn(courseCreatorDashboard, 'initDropdwon').and.callThrough()
    courseCreatorDashboard.initDropdwon()
  })

  it('Should display number of users by day', function () {
    spyOn(courseCreatorDashboard, 'nextGraph').and.callThrough()
    courseCreatorDashboard.nextGraph()
  })

  it('Should display timespent for content consumption', function () {
    spyOn(courseCreatorDashboard, 'previousGraph').and.callThrough()
    courseCreatorDashboard.previousGraph()
  })

  it('Should return course consumption dashboard data', function () {
    spyOn(dashboardService, 'getCourseDashboardData').and.returnValue(deferred.promise)
    deferred.resolve(courseConsumptionData)
    courseCreatorDashboard = createContoller()
    spyOn(courseCreatorDashboard, 'getCourseDashboardData').and.callThrough()
    courseCreatorDashboard.getCourseDashboardData()
    scope.$apply()
    var response = dashboardService.getCourseDashboardData().$$state.value
    expect(response).not.toBe(undefined)
    courseCreatorDashboard.getUpForReviewContent = response.result.content
    expect(courseCreatorDashboard.getCourseDashboardData).not.toBe(undefined)
  })

  it('Should return failed course consumption data', function () {
    spyOn(dashboardService, 'getCourseDashboardData').and.returnValue(deferred.promise)
    deferred.resolve(failedCourseConsumptionResponse)
    courseDashboard = createContoller()
    spyOn(courseDashboard, 'getCourseDashboardData').and.callThrough()
    courseDashboard.getCourseDashboardData()
    scope.$apply()
    var response = dashboardService.getCourseDashboardData().$$state.value
    expect(response).not.toBe(undefined)
    courseDashboard.getUpForReviewContent = response.result.content
    expect(courseDashboard.getCourseDashboardData).not.toBe(undefined)
  })

  it('Should return zero courses createdByMe', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(zeroContentCreatedByMe)
    courseCreatorDashboard = createContoller()
    spyOn(courseCreatorDashboard, 'loadData').and.callThrough()
    courseCreatorDashboard.loadData()
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseCreatorDashboard.getUpForReviewContent = response.result.content
    expect(courseCreatorDashboard.getUpForReviewContent).toBeDefined()
  })

  it('Should return errorMessage', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(invalidResponse)
    courseCreatorDashboard = createContoller()
    spyOn(courseCreatorDashboard, 'loadData').and.callThrough()
    courseCreatorDashboard.loadData(invalidResponse)
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseCreatorDashboard.courseCreatorDashboard = response.result.content
    // expect(courseCreatorDashboard.courseCreatorDashboard).toBeDefined();
    expect(courseCreatorDashboard.showErrors).not.toBe(undefined)
  })

  it('Should return errorMessage', function () {
    spyOn(searchService, 'search').and.returnValue(deferred.promise)
    deferred.resolve(invalidResponse)
    courseCreatorDashboard = createContoller()
    spyOn(courseCreatorDashboard, 'showErrors').and.callThrough()
    courseCreatorDashboard.showErrors(invalidResponse)
    scope.$apply()
    var response = searchService.search().$$state.value
    expect(response).not.toBe(undefined)
    courseCreatorDashboard.courseCreatorDashboard = response.result.content
    expect(courseCreatorDashboard.showErrors).not.toBe(undefined)
  })
})
