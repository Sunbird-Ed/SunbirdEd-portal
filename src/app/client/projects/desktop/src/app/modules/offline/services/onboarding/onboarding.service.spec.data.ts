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
    }
};
