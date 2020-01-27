export const onboarding_location_test = {
    filters: {
        state: {
            'code': 'FT_State_Code-1553105654910',
            'name': 'state_location_nameYn3sEugPju',
            'id': 'b6381e02-5a79-45ec-8e1a-a2e74fc29da3',
            'type': 'state'
        },
        district: {
            'code': 'FT_District_Code-1553105653081',
            'name': 'state_location_nameicXqsmPn3V',
            'id': 'bc3a0e4c-c203-4fd5-a8b7-3bb39c2a5e4b',
            'type': 'district',
            'parentId': 'b6381e02-5a79-45ec-8e1a-a2e74fc29da3'
        }
    },
    statesList: {
        'id': 'api.location.search',
        'ver': '1.0',
        'ts': '2019-11-23T11:03:57.740Z',
        'params': {
            'resmsgid': '2aa54e34-2318-412f-8985-f6c79829ca93',
            'msgid': '526e5c18-bbfa-4236-8808-6a31a2e68265',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': [
                {
                    'code': '1',
                    'name': 'test_state_1',
                    'id': 'f138e9c2-adae-4e5b-ab3c-0527ff6a2b5f',
                    'type': 'state'
                },
                {
                    'code': '29',
                    'name': 'test_state_2',
                    'id': '4a6d77a1-6653-4e30-9be8-93371b6b53b5',
                    'type': 'state'
                },
            ]
        }
    },
    districtList: {
        'id': 'api.location.search',
        'ver': '1.0',
        'ts': '2019-11-23T11:11:25.444Z',
        'params': {
            'resmsgid': '6415fba5-1ced-4b4f-8229-6d508b20ec8d',
            'msgid': '44fefbfe-492e-4cdd-98f8-ca3d999d23e1',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': [
                {
                    'code': '2907',
                    'name': 'test_district_1',
                    'id': 'cde02789-5803-424b-a3f5-10db347280e9',
                    'type': 'district',
                    'parentId': '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
                },
                {
                    'code': '2909',
                    'name': 'test_district_2',
                    'id': '3ac37fb2-d833-45bf-a579-a2656b0cce62',
                    'type': 'district',
                    'parentId': '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
                },
                {
                    'code': '2918',
                    'name': 'test_district_3',
                    'id': 'ed622a46-17bb-42c0-b0a0-50c02b38a05c',
                    'type': 'district',
                    'parentId': '4a6d77a1-6653-4e30-9be8-93371b6b53b5'
                }
            ]
        }
    },
    saveLocation: {
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
    error: {
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
    tenantInfo: {
        'appLogo': '/appLogo.png',
        'favicon': '/favicon.ico',
        'logo': '/logo.png',
        'titleName': 'Sunbird'
    },
    resourceBundle: {
        frmelmnts: {
          lbl: {
            continue: 'Continue'
          }
        },
        messages: {
          emsg: {
            m0021: 'Unable to save location. please try again after some time.',
          },
          smsg: {
            m0057: 'Location saved successfully...'
          },
          imsg: {
            m0075: 'Your Location',
            // tslint:disable-next-line:max-line-length
            m0074: 'Your location details helps us to suggest content that is useful to you. Is the location given correct? if not, select your correct location and click Submit'
          }
        }
      },
    deviceLocation: {
      'id': 'analytics.device-profile',
      'ver': '1.0',
      'ts': '2019-11-28T05:55:49.020+00:00',
      'params': {
        'resmsgid': '5469091e-1dc3-431e-8c73-9ab89e0e7b2f',
        'status': 'successful',
        'client_key': null
      },
      'responseCode': 'OK',
      'result': {
        'ipLocation': {
          'state': 'test_state_1',
          'district': 'test_district_1'
        }
      }
    },
  location_read_error : {
    'id': 'api.location.read',
    'ver': '1.0',
    'ts': '2019-12-05T06:50:26.429Z',
    'params': {
        'resmsgid': '5a2ace60-6d49-4f72-8f4c-1dd8b5aaa562',
        'msgid': '0c18f83a-caa7-413d-b868-813595783903',
        'status': 'failed',
        'err': 'ERR_DATA_NOT_FOUND',
        'errmsg': 'Data not found'
    },
    'responseCode': 'RESOURCE_NOT_FOUND',
    'result': {}
  },
  location_read_success: {
    'result': {
      'state': {
        'code': 'FT_State_Code-1544604001076',
        'name': 'state_location_nameJMRUXuUbT6',
        'id': 'bd47e788-e92e-4d12-9f26-b9eb9a4b70a5',
        'type': 'state'
      },
      'city': {
        'code': 'FT_District_Code-1544603939757',
        'name': 'state_location_nameFniQB7lOZt',
        'id': '8f3f79e8-a52f-42bb-a1f8-af6b3f0e57d8',
        'type': 'district',
        'parentId': 'bd47e788-e92e-4d12-9f26-b9eb9a4b70a5'
      }
    }
  }
};


