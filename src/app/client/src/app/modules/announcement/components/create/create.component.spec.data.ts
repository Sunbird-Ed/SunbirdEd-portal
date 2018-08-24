export const mockRes = {
    getLocationDetails: {
        'createdDate': '12/12/12', 'updatedBy': '7y7gh123', 'userCount': 123, 'createdBy': '123456',
        'userCountTTL': '2345', 'topic': '12345', 'location': 'Pune', 'id': '12345',
        'updatedDate': '12/12/12', 'type': '123', 'rootOrgId': 'ORG_001', 'selected': false
    },
    resourceBundle: {
        'messages': {
            'smsg': {
                'moo41': 'Announcement cancelled successfully...'
            },
            'emsg': {
                'm0005': 'Something went wrong, please try in some time....',
                'm0006': 'Please select recipient(s)'
            },
            'imsg': {
                'm0020': 'location is removed sucessfully'
            }
        }
    },
    resendAnnouncement: {
        'id': '39873400-da6a-11e7-9964-e746dd8d0631',
        'from': 'test user',
        'type': 'Circular',
        'title': 'Test title for announcement 90',
        'description': 'Test description for announcement 90',
        'links': [
            'http://yahoo.com'
        ],
        'attachments': [
            {
                'name': 'alarm.png',
                'mimetype': 'image/png',
                'size': '67kb',
                'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0123900729938247680.png'
            },
            {
                'name': 'clock.jpg',
                'mimetype': 'image/jpeg',
                'size': '9.4kb',
                'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0123900700072509443.jpg'
            }
        ],
        'createdDate': '2017-12-06 15:15:42:464+0530',
        'status': 'cancelled',
        'read': null,
        'received': null,
        'target': {
            'geo': {
                'ids': [
                    '0123668627050987529'
                ]
            }
        }
    },
    announcementTypes: {
        'announcementTypes': [
            {
                'id': '9b20d8f4-c5db-11e7-abc4-cec278b6b50a',
                'name': 'Order'
            },
            {
                'id': '9b20d7f0-c5db-11e7-abc4-cec278b6b50a',
                'name': 'News'
            },
            {
                'id': '9b20d566-c5db-11e7-abc4-cec278b6b50a',
                'name': 'Circular'
            }
        ]
    },
    createSucess: {
        'id': 'api.plugin.announcement.definitions',
        'ver': '1.0',
        'ts': '2018-08-22 06:53:19:784+0000',
        'params': {
          'resmsgid': '0dccba80-a5d8-11e8-ad3d-4f47d211fa79',
          'msgid': null,
          'status': 'successful',
          'err': '',
          'errmsg': ''
        },
        'responseCode': 'OK',
        'result': {
          'announcementTypes': [
            {
              'id': '4bdd8d30-290b-11e8-ac8c-1f1286d95adc',
              'name': 'Cr Type test function'
            },
            {
              'id': '9b20d566-c5db-11e7-abc4-cec278b6b50a',
              'name': 'Circular'
            },
            {
              'id': 'a451fbd0-331b-11e8-81de-759d93f6fff8',
              'name': 'General'
            }
          ]
        }
      },
      userdata: {
        'err': null,
        'userProfile': {
          'missingFields': [],
          'updatedDate': '2018-07-09 16:07:35:977+0000',
          'completeness': 100,
          'id': '159e93d1-da0c-4231-be94-e75b0c226d7c',
          'identifier': '159e93d1-da0c-4231-be94-e75b0c226d7c',
          'rootOrgId': 'ORG_001',
          'firstName': 'Sunil',
          'phone': '******7878',
          'dob': '1982-01-01',
          'status': 1,
          'lastName': 'Pandith',
          'gender': 'Male',
          'email': 'su************@gmail.com',
          'phoneverified': null,
          'profileSummary': '.aa .   ',
          'userName': 'sunil1as990',
          'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c',
          'emailVerified': null,
          'lastLoginTime': 1534920693649,
          'createdDate': '2017-11-03 05:28:41:536+0000',
          'createdBy': '',
          'location': 'Bangaloree',
          'rootOrgAdmin': false
        }
      }
};
