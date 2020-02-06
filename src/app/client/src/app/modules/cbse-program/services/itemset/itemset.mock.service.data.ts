export const mockItemsetData = {
    readSuccess : {
        'id': 'api.itemset.read',
        'ver': '3.0',
        'ts': '2020-01-29T09:31:01ZZ',
        'params': {
          'resmsgid': '86f26ba7-911a-4593-87c7-9ce731d42ac9',
          'msgid': null,
          'err': null,
          'status': 'successful',
          'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
          'itemset': {
            'owner': 'Reviewer User',
            'identifier': 'do_112945617008697344116',
            'lastStatusChangedOn': '2020-01-29T05:25:13.779+0000',
            'code': '2965cabd-3a11-21f0-1f13-d385a82e8180',
            'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'description': 'Practice QuestionSet',
            'language': [
              'English'
            ],
            'type': 'materialised',
            'languageCode': [
              'en'
            ],
            'createdOn': '2020-01-29T05:25:13.779+0000',
            'version': 2,
            'appId': 'local.sunbird.portal',
            'name': 'Practice QuestionSet - VSA',
            'lastUpdatedOn': '2020-01-29T07:12:18.190+0000',
            'items': [
              {
                'identifier': 'do_112945669636603904165',
                'name': 'vsa_NCFCOPY',
                'description': null,
                'objectType': 'AssessmentItem',
                'relation': 'hasSequenceMember',
                'status': 'Draft'
              }
            ],
            'status': 'Draft'
          }
        }
    },
    createBody : {
      'request': {
        'itemset': {
          'code': '974f1c7e-b5e9-a4dd-c851-7863e3e7cc48',
          'name': 'Practice QuestionSet',
          'description': 'Practice QuestionSet',
          'language': [
            'English'
          ],
          'owner': 'Content Creactor',
          'items': [
            {
              'identifier': 'do_2129464889424691201366'
            }
          ]
        }
      }
    },
    createSuccess : {
      'id': 'api.itemset.create',
      'ver': '3.0',
      'ts': '2020-01-30T10:58:50ZZ',
      'params': {
        'resmsgid': '231935bb-2eac-4ca3-b204-1cd6cf2d36e7',
        'msgid': null,
        'err': null,
        'status': 'successful',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'identifier': 'do_212946488775065600137'
      }
    },
    reviewSuccess : {
      'id': 'api.itemset.review',
      'ver': '3.0',
      'ts': '2020-01-30T11:05:39ZZ',
      'params': {
        'resmsgid': '78a0f5c4-d836-4a75-8e2d-d8a24c6ebf8c',
        'msgid': null,
        'err': null,
        'status': 'successful',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'identifier': 'do_212946488775065600137'
      }
    },
    updateBody : {
      'name': 'Practice QuestionSet',
      'items': [
        {
          'identifier': 'do_2129457523845857281259'
        },
        {
          'identifier': 'do_2129464939599872001368'
        },
        {
          'identifier': 'do_2129464939599872001368'
        }
      ]
    },
    updateSuccess: {
      'id': 'api.itemset.update',
      'ver': '3.0',
      'ts': '2020-01-30T11:09:23ZZ',
      'params': {
        'resmsgid': 'b5ca35eb-83fc-46d0-94ad-da4e00b39136',
        'msgid': null,
        'err': null,
        'status': 'successful',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'identifier': 'do_212945752384716800123'
      }
    }
};
