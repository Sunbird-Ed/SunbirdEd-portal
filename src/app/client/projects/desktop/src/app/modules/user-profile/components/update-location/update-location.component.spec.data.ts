export const location_Data = {

    success_state_details: {
        'id': 'api.location.search',
        'ver': '1.0',
        'ts': '2019-12-14T09:12:58.758Z',
        'params': {
            'resmsgid': '6e1c6cd7-2fa7-4876-878b-c1625fe53e8f',
            'msgid': '2593c5ad-38ee-4988-9d3e-fcedf0f87fb4',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': [
                {
                    'code': '29',
                    'name': 'test_state_1',
                    'id': '4a6d77a1-6653-4e30-9be8-93371b6b53b5',
                    'type': 'state'
                },
                {
                    'code': '9',
                    'name': 'test_state_2',
                    'id': 'f1fe9665-bf2e-43cd-9063-57b0f330144b',
                    'type': 'state'
                },
                {
                    'code': '28',
                    'name': 'test_state_3',
                    'id': 'f62a597d-17bd-499e-9565-734e3d5562a3',
                    'type': 'state'
                }
            ]
        }
    },
    success_districts_details:
    {
        'id': 'api.location.search',
        'ver': '1.0',
        'ts': '2019-12-14T09:35:58.918Z',
        'params': {
            'resmsgid': '537a6fdc-5df2-4256-b098-5da8a93caaed',
            'msgid': '02392f86-1a1b-4ec7-99d9-f55a9b517f24',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': [
                {
                    'code': '2918',
                    'name': 'test_district_3',
                    'id': 'ed622a46-17bb-42c0-b0a0-50c02b38a05c',
                    'type': 'district',
                    'parentId': '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
                },
                {
                    'code': '2925',
                    'name': 'test_district_4',
                    'id': '28f72589-ea1c-47ab-9fb3-80cd6f9504a2',
                    'type': 'district',
                    'parentId': '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
                }
            ]
        }
    },
    success_update_location: {
        'id': 'api.location.save',
        'ver': '1.0',
        'ts': '2019-11-23T11:19:42.475Z',
        'params': {
            'resmsgid': '80815f7f-a6d3-42fa-9594-b2ae2d373835',
            'msgid': '9c1b0de0-ff92-4301-8e7e-dd7e561a1b34',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': true
    },
    error_save_location: {
        'error': {
            'id': 'api.location.save',
            'ver': '1.0',
            'ts': '2019-10-25T09:39:51.560Z',
            'params': {
                'resmsgid': '9652a082-9677-4ccf-91e9-f138fd80c410',
                'msgid': 'c246387b-a3a6-4a98-b150-73b1bbab7665',
                'status': 'failed',
                'err': 'ERR_INTERNAL_SERVER_ERROR',
                'errmsg': 'Error while processing the request'
            },
            'responseCode': 'INTERNAL_SERVER_ERROR',
            'result': {}
        }
    },

    resourceBundle: {
        messages: {
            smsg: {
                m0057: 'Location updated successfully...'
            },
            emsg: {
                m0021: 'Unable to update location. Please try again after some time'
            }
        }
    },
    update_location_api_body: {
        state: {
            code: '9',
            id: 'f1fe9665-bf2e-43cd-9063-57b0f330144b',
            name: 'test_state_2',
            type: 'state'
        },
        city: {
            code: '2918',
            id: 'ed622a46-17bb-42c0-b0a0-50c02b38a05c',
            name: 'test_district_3',
            parentId: '4a6d77a1-6653-4e30-9be8-93371b6b53b5',
            type: 'district',

        }

    },
    get_state_details_api_body: {
        'request':
        {
            'filters':
                { 'type': 'state' }
        }
    },
    get_district_details_api_body:
    {
        'request':
        {
            'filters': {
                'parentId': 'f1fe9665-bf2e-43cd-9063-57b0f330144b',
                'type': 'district'
            }
        }
    },
    user_details: {
        'result': {
            'framework': {
                'board': 'State (Karnataka)',
                'medium': [
                    'English'
                ],
                'gradeLevel': [
                    'Class 10'
                ],
                'subjects': [
                    'Science'
                ]
            },
            'formatedName': 'guest',
            'name': 'guest',
            'createdOn': 1576752553104,
            'updatedOn': 1576762226683,
            'identifier': '9783dc11-206c-4a3e-917a-cf4853ce23a2',
            '_id': '9783dc11-206c-4a3e-917a-cf4853ce23a2',
            'location': {
                'state': {
                    'code': '9',
                    'name': 'test_state_2',
                    'id': 'f1fe9665-bf2e-43cd-9063-57b0f330144b',
                    'type': 'state'
                },
                'city': {
                    'code': '2918',
                    'name': 'test_district_3',
                    'id': 'ed622a46-17bb-42c0-b0a0-50c02b38a05c',
                    'type': 'district',
                    'parentId': '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
                }
            }
        }
    }

};
