export const onboarding = {

    read_user_not_present: {
        'id': 'api.desktop.user.read',
        'ver': '1.0',
        'ts': '2019-11-27T05:34:12.466Z',
        'params': {
            'resmsgid': '01a67bec-c686-40ca-bbe1-752f0ad4f202',
            'msgid': '4998e642-6d62-428b-b1c7-a94d7472bc59',
            'status': 'failed',
            'err': 'ERR_DATA_NOT_FOUND',
            'errmsg': 'User not found with name guest'
        },
        'responseCode': 'RESOURCE_NOT_FOUND',
        'result': {}
    },
    create_user: {
        'id': 'api.desktop.user.create',
        'ver': '1.0',
        'ts': '2019-11-27T05:37:58.648Z',
        'params': {
            'resmsgid': 'a296793f-6e64-472f-bc53-777755c247ce',
            'msgid': '69bdb38b-6fec-4a56-b47a-d2356b31aebe',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'id': 'f41b4370-5bd9-491b-9638-c5773507a555'
        }
    },
    read_user_present: {
            'result': {
              'framework': {
                'id': '505c7c48ac6dc1edc9b08f21db5a571d',
                'board': 'Test framework',
                'medium': [
                  'TEST_MEDIUM'
                ],
                'gradeLevel': [
                  'KG'
                ]
              },
              'formatedName': 'guest',
              'name': 'guest',
              '_id': 'f41b4370-5bd9-491b-9638-c5773507a555',
              'location': {
                'doc': {
                  'state': {
                    'code': '29',
                    'name': 'tes_state_2',
                    'id': '4a6d77a1-6653-4e30-9be8-93371b6b53b5',
                    'type': 'state'
                  },
                  'city': {
                    'code': '2907',
                    'name': 'tes_district_1',
                    'id': 'cde02789-5803-424b-a3f5-10db347280e9',
                    'type': 'district',
                    'parentId': '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
                  }
                }
              }
            }
    },

     frameworkCategories : [
       {
      'identifier': 'as_k-12_topic_science_l1con_90',
      'code': 'science_l1Con_90',
      'translations': '{\'as\':\'পোহৰ\'}',
      'name': 'Light',
      'description': 'Light',
      'category': 'topic',
      'status': 'Live',
      'associations': [
        {
            'identifier': 'as_k-12_topic_science_l1con_90',
            'code': 'science_l1Con_90',
            'translations': '{\'as\':\'পোহৰ\'}',
            'name': 'Light',
            'description': 'Light',
            'category': 'topic',
            'status': 'Live'
        },
      ]
    }
    ],
    category: 'gradeLevel',
    update_user_request_body: {
      'request': {
          'framework': {
              'board': 'State (Karnataka)',
              'medium': ['English'],
              'gradeLevel': ['Class 10'],
              'subjects': []
          },

          'identifier': '9783dc11-206c-4a3e-917a-cf4853ce23a2'
      }
  },
  success_update_user: {
    'id': 'api.desktop.user.update',
    'ver': '1.0',
    'ts': '2019-12-19T12:50:57.390Z',
    'params': {
        'resmsgid': '010d00e3-2f64-4d6e-8b72-56bdd782d6c8',
        'msgid': '8e67e664-1d7c-44a4-83ef-daf0415ec6e6',
        'status': 'successful',
        'err': null,
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'identifier': '9783dc11-206c-4a3e-917a-cf4853ce23a2'
    }
},
error_update_user: {
        'id': 'api.desktop.user.update',
        'ver': '1.0',
        'ts': '2019-12-19T12:52:08.561Z',
        'params': {
            'resmsgid': 'c17703c2-1362-477c-9495-346c9da45787',
            'msgid': '1ff811ec-45a6-455f-a121-05f60c978086',
            'status': 'failed',
            'err': 'ERR_BAD_REQUEST',
            'errmsg': 'Error while processing the request '
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
},
};
