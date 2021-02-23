export const mockRes = {
  editorConfig: {
    context: {},
    config: {}
  },
  successResult: {
      'id': 'api.content.read',
      'ver': '1.0',
      'ts': '2018-04-10T13:02:45.415Z',
      'params': {
          'resmsgid': '76311b70-3cbf-11e8-8758-7f5b4fe67033',
          'msgid': '762582b0-3cbf-11e8-bfb0-2527c99bf99d',
          'status': 'successful',
          'err': null,
          'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
          'content': {
            'contentDisposition': 'inline',
            'contentType': 'PracticeResource',
            'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
            'framework': 'NCFCOPY',
            'identifier': 'do_1132132802225602561165',
            'languageCode': ['en'],
            'mimeType': 'application/vnd.sunbird.questionset',
            'objectType': 'Content',
            'primaryCategory': 'Practice Question Set',
            'status': 'Draft',
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
  }
};
