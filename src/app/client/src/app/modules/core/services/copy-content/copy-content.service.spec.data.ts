export const mockRes = {
  successResponse: {
    'id': 'api.content.copy', 'ver': '1.0', 'ts': '2018-05-10T13:05:11.500Z',
    'params': {
      'resmsgid': 'c5a868c0-5452-11e8-9914-ed9930b78ac6', 'msgid': 'c54b2d90-5452-11e8-88b6-8fabc6768caf',
      'status': 'successful', 'err': null, 'errmsg': null
    }, 'responseCode': 'OK',
    'result': { 'node_id': { 'do_112499832726183936117': 'do_1125006439303577601155' } }
  },
  errorResponse: {
    'id': 'api.content.copy', 'ver': '1.0', 'ts': '2018-05-11T06:18:44.053Z',
    'params': {
      'resmsgid': '28051050-54e3-11e8-bec4-958720230bdb',
      'msgid': null, 'status': 'failed', 'err': 'ERR_GRAPH_ADD_NODE_VALIDATION_FAILED',
      'errmsg': 'Validation Errors'
    }, 'responseCode': 'SERVER_ERROR', 'result': {}
  },
  contentData: {
    'template code': 'org.ekstep.ordinal.story', 'keywords': ['elephant'], 'methods': [], 'code': 'code', 'framework': 'NCF',
    'description': 'Elephant and the Monkey', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.ecml-archive',
    'body': '{}', 'createdOn': '2016-03-28T09:13:19.470+0000', 'appIcon': '', 'gradeLevel': ['Grade 1', 'Grade 2'],
    'collections': [], 'children': [], 'usesContent': [], 'artifactUrl': '', 'lastUpdatedOn': '',
    'contentType': 'Story', 'item_sets': [], 'owner': 'EkStep', 'identifier': 'domain_14302',
    'audience': ['Learner'], 'visibility': 'Default', 'libraries': [], 'mediaType': 'content',
    'ageGroup': ['6-7', '8-10'], 'osId': 'org.ekstep.quiz.app', 'languageCode': 'en', 'userId': 's', 'userName': 'sourav',
    'versionKey': '1497009185536', 'tags': ['elephant'], 'concepts': [], 'createdBy': 'EkStep',
    'name': 'Elephant and the Monkey', 'me_averageRating': 'd', 'publisher': 'EkStep', 'usedByContent': [], 'status': 'Live', 'path': '',
    'primaryCategory': 'Learning Resource'
  },
  userData: {
    'firstName': 'Sourav',
    'lastName': 'Dey',
    'organisationNames' : ['Sunbird'],
    'organisationIds' : ['ORG_001'],
    'userId' : '8454cb21-3ce9-4e30-85b5-fade097880d8'
  },
  copyContentSuccess: {
      'id': 'api.course.create',
      'ver': 'v1',
      'ts': '2020-05-15 13:09:33:042+0000',
      'params': {
        'resmsgid': null,
        'msgid': null,
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'versionKey': '1589548170308',
        'identifier': 'do_11302157861002444811',
        'course_id': 'do_11302157861002444811'
      }
    },
    copyCourseContentData : {
      identifier: 'do_112598807704158208111',
      name: 'Demo course',
      description: '',
      framework: 'NCFCOPY',
      children: [{
        'ownershipType': [
          'createdBy'
        ],
        'parent': 'do_11303070829060915211',
        'code': '8981daac-6d18-4322-81b3-5da1c284119b',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'description': 'test',
        'language': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'idealScreenSize': 'normal',
        'createdOn': '2020-05-28T10:45:47.259+0000',
        'objectType': 'Content',
        'visibility': 'Parent',
        'selected': true
      }]
    }
};
