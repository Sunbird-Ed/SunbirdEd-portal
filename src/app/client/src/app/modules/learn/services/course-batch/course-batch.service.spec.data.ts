export const mockData = {
    batchData: {
        'id': 'api.course.batch.read',
        'ver': 'v1',
        'ts': '2020-08-24 11:08:46:289+0000',
        'params': {
          'resmsgid': null,
          'msgid': '8dc7dc3d-82b9-311b-f610-8ccefded4460',
          'err': null,
          'status': 'success',
          'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
          'response': {
            'identifier': '01307963745936998440',
            'createdFor': [
              '0124784842112040965'
            ],
            'endDate': null,
            'description': '',
            'cert_templates': {
              'template_21': {
                'identifier': 'mock_cert_identifier',
                'data' : `{'artifactUrl': 'https://cert.svg',}`,
                'criteria': {
                  'user': {
                    'rootOrgId': '0124784842112040965'
                  },
                  'enrollment': {
                    'status': 2
                  },
                  'score': {
                    '>=': 40
                  }
                },
                'name': 'Course completion certificate',
                'notifyTemplate': {
                  'emailTemplateType': 'defaultCertTemp',
                  'subject': 'Completion certificate',
                  'stateImgUrl': 'https://s.png',
                  'regards': 'Minister of Gujarat',
                  'regardsperson': 'Chairperson'
                },
                'issuer': {
                  'name': 'Research and Training',
                  'url': 'https://gcert/'
                },
                'signatoryList': [
                  {
                    'image': 'https://signature-523237__340.jpg',
                    'name': 'CEO',
                    'id': 'CEO',
                    'designation': 'CEO'
                  }
                ]
              }
            },
            'batchId': '01307963745936998440',
            'createdDate': '2020-08-05 13:37:52:083+0000',
            'createdBy': 'ab467e6e-1f32-453c-b1d8-c6b5fa6c7b9e',
            'mentors': [],
            'name': 'Sudip Mukherjee',
            'id': '01307963745936998440',
            'enrollmentType': 'open',
            'courseId': 'do_21307528604532736012398',
            'enrollmentEndDate': null,
            'startDate': '2020-08-05',
            'status': 1
          }
        }
      },
      batchDataNew: {
        'id': 'api.course.batch.read',
        'ver': 'v1',
        'ts': '2020-08-24 11:08:46:289+0000',
        'params': {
          'resmsgid': null,
          'msgid': '8dc7dc3d-82b9-311b-f610-8ccefded4460',
          'err': null,
          'status': 'success',
          'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
          'response': {
            'identifier': '01307963745936998440',
            'createdFor': [
              '0124784842112040965'
            ],
            'endDate': null,
            'description': '',
            'cert_templates': {
              'template_21': {
                'identifier': 'mock_cert_identifier',
                'data' : `{'artifactUrl': 'https://cert.svg',}`,
                'description':'certificate for completion',
                'criteria': {
                  'user': {
                    'rootOrgId': '0124784842112040965'
                  },
                  'enrollment': {
                    'status': 2
                  },
                  'score': {
                    '>=': 40
                  }
                },
                'name': 'Course completion certificate',
                'notifyTemplate': {
                  'emailTemplateType': 'defaultCertTemp',
                  'subject': 'Completion certificate',
                  'stateImgUrl': 'https://s.png',
                  'regards': 'Minister of Gujarat',
                  'regardsperson': 'Chairperson'
                },
                'issuer': {
                  'name': 'Research and Training',
                  'url': 'https://gcert/'
                },
                'signatoryList': [
                  {
                    'image': 'https://signature-523237__340.jpg',
                    'name': 'CEO',
                    'id': 'CEO',
                    'designation': 'CEO'
                  }
                ]
              }
            },
            'batchId': '01307963745936998440',
            'createdDate': '2020-08-05 13:37:52:083+0000',
            'createdBy': 'ab467e6e-1f32-453c-b1d8-c6b5fa6c7b9e',
            'mentors': [],
            'name': 'Sudip Mukherjee',
            'id': '01307963745936998440',
            'enrollmentType': 'open',
            'courseId': 'do_21307528604532736012398',
            'enrollmentEndDate': null,
            'startDate': '2020-08-05',
            'status': 1
          }
        }
      },
      userProfile: {
        'maskedPhone': '******2507',
        'rootOrgName': 'CustROOTOrg10',
        'roleOrgMap':{
          'CONTENT_CREATOR':'CustROOTOrg10'
        },
        'identifier': 'd8bfe598-21c8-4c9c-b335-a3f75a97a988',
        'thumbnail': null,
        'profileVisibility': {},
        'rootOrgId': '01285019302823526477',
        'prevUsedEmail': '',
        'firstName': 'dev-user13',
        'userName': 'devuser13',
        'userId': 'd8bfe598-21c8-4c9c-b335-a3f75a97a988',
        'promptTnC': false,
        'emailVerified': true
      },
      userProfileNew: {
        'maskedPhone': '******2507',
        'id': 'd8bfe598-21c8-4c9c-b335-a3f75a97a988',
        'recoveryEmail': '',
        'roleOrgMap':{
          'CONTENT_CREATOR':['01285019302823526477']
        },
        'identifier': 'd8bfe598-21c8-4c9c-b335-a3f75a97a988',
        'thumbnail': null,
        'profileVisibility': {},
        'rootOrgId': '01285019302823526477',
        'userName': 'devuser13',
        'userId': 'd8bfe598-21c8-4c9c-b335-a3f75a97a988',
        'promptTnC': false,
        'emailVerified': true
      },

};