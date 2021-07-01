export const mockRes = {
  editorConfig: {
    context: {},
    config: {}
  },
  successResult: {
    'id': 'api.content.read',
    'ver': '1.0',
    'ts': '2021-07-01T11:03:45.354Z',
    'params': {
        'resmsgid': '00ffc2a0-da5c-11eb-8f0d-5b69b763f5d8',
        'msgid': 'd1400790-324e-a5ff-9683-51db545b734c',
        'status': 'successful',
        'err': null,
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'content': {
            'mimeType': 'application/vnd.ekstep.content-collection',
            'objectType': 'Content',
            'primaryCategory': 'Course',
            'contentType': 'Course',
            'identifier': 'do_113312376536465408181',
            'languageCode': [
                'en'
            ],
            'status': 'Draft',
            'contentDisposition': 'inline',
            'targetFWIds': [
                'nit_k-12'
            ],
            'framework': 'nit_k-12',
            'createdBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
            'resourceType': 'Course'
        }
    }
  },
  frameworkSuccessResult: {
    'id': 'api.object.category.definition.read',
    'ver': '3.0',
    'ts': '2021-02-10T09:27:26ZZ',
    'params': {
      'resmsgid': '28c9ff32-dfd5-4e6b-abbc-cecf339dda59',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'objectCategoryDefinition': {
        'identifier': 'obj-cat:practice-question-set_questionset_all',
        'objectMetadata': {
          'config': {
            'sourcingSettings': {
              'collection': {
                'maxDepth': 0,
                'objectType': 'QuestionSet',
                'primaryCategory': 'Practice Question Set',
                'isRoot': true,
                'iconClass': 'fa fa-book',
                'children': {
                  'Question': []
                },
                'hierarchy': {}
              }
            }
          },
          'schema': {
            'properties': {
              'mimeType': {
                'type': 'string',
                'enum': [
                  'application/vnd.sunbird.questionset'
                ]
              }
            }
          }
        },
        'languageCode': [],
        'name': 'Practice Question Set',
      }
    }
  },
  questionsetSuccessResult: {
    'id': 'api.questionset.read',
    'ver': '3.0',
    'ts': '2021-07-01T12:28:24ZZ',
    'params': {
        'resmsgid': 'c5a3bf09-107c-49f4-ab30-0fb1f9914882',
        'msgid': null,
        'err': null,
        'status': 'successful',
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'questionset': {
            'mimeType': 'application/vnd.sunbird.questionset',
            'primaryCategory': 'Practice Question Set',
            'contentDisposition': 'inline',
            'identifier': 'do_1133131668609925121264',
            'languageCode': [
                'en'
            ],
            'framework': 'ekstep_ncert_k-12',
            'createdBy': '5a587cc1-e018-4859-a0a8-e842650b9d64',
            'status': 'Draft'
        }
    }
  }
};
