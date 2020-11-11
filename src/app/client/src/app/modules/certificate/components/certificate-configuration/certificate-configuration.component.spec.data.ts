export const response = {
  mockData: {
    data: [
      {
        'code': 'certTypes',
        'dataType': 'text',
        'name': 'certTypes',
        'label': 'Certificate type',
        'description': 'Select certificate',
        'editable': true,
        'inputType': 'select',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
          'fieldColumnWidth': 'twelve'
        },
        'range': [
          {
            'type': 'Completion certificate',
            'status': 2
          }
        ],
        'index': 1
      },
      {
        'code': 'issueTo',
        'dataType': 'text',
        'name': 'issueTo',
        'label': 'Issue certificate to',
        'description': 'Select',
        'editable': true,
        'inputType': 'select',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
          'fieldColumnWidth': 'twelve'
        },
        'range': [
          {
            'type': 'All',
            'rootOrgId': ''
          },
          {
            'type': 'My state teacher',
            'rootOrgId': ''
          }
        ],
        'index': 2
      }
    ]
  },
  criteria: {
    'user': {
      'rootOrgId': 'ORG_001'
    },
    'enrollment': {
      'status': 2
    }
  },
  courseData: {
    'id': 'api.course.hierarchy',
    'ver': '1.0',
    'ts': '2020-08-24T11:08:46.398Z',
    'params': {
      'resmsgid': '2df72de0-e5fa-11ea-ace0-211bfb284501',
      'msgid': 'ea66a664-b688-c0b5-df68-9aad02358023',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result' : {
      'content' : {
        'appIcon': 'https://ntpstagingall.blob.core.windows.net/ntp-content-staging/content/do_2127645021030563841271/artifact/download_1557833776003.thumb.jpg',
        'contentType': 'Course',
        'name': 'vk-3.0Course3007',
      }
    }
  },

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
  batchDataWithCertificate: {
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
        'endDate': null,
        'description': '',
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
  certTemplateListData: {
    'id': 'api.org.preferences.read',
    'ver': 'v2',
    'ts': '2020-08-24 11:08:46:270+0000',
    'params': {
      'resmsgid': null,
      'msgid': 'e5bea365-c922-7eb2-0f97-8e61fe82c5cb',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'updatedBy': '18150cf9-b839-4ccd-956a-66e359f22278',
        'data': {
          'code': 'teamplate',
          'dataType': 'text',
          'name': 'template',
          'label': '',
          'description': 'certs templates list',
          'inputType': 'template',
          'index': 1,
          'range': [
            {
              'name': 'sunbirdtemplate',
              'displayName': '',
              'value': 'https://sunbirddev.blob.core.windows.net/e-credentials/svgcerts/cert.svg',
              'index': 1
            },
            {
              'name': 'template_21',
              'displayName': '',
              'value': 'https://sunbirddev.blob.core.windows.net/e-credentials/svgcerts/cert.svg',
              'index': 2
            }
          ]
        },
        'createdBy': '18150cf9-b839-4ccd-956a-66e359f22278',
        'updatedOn': 1597640350253,
        'createdOn': 1597592093137,
        'key': 'certList',
        'orgId': 'od1'
      }
    }
  },
  certRulesData: {
    'id': 'api.org.preferences.read',
    'ver': 'v2',
    'ts': '2020-08-25 15:26:17:543+0000',
    'params': {
      'resmsgid': null,
      'msgid': '1db734d8-a580-222b-91e1-1d0cfbe55108',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'updatedBy': null,
        'data': {
          'templateName': 'certRules',
          'action': 'save',
          'fields': [
            {
              'code': 'certTypes',
              'dataType': 'text',
              'name': 'certTypes',
              'label': 'Certificate type',
              'description': 'Select certificate',
              'editable': true,
              'inputType': 'select',
              'required': true,
              'displayProperty': 'Editable',
              'visible': true,
              'renderingHints': {
                'fieldColumnWidth': 'twelve'
              },
              'range': [
                {
                  'name': 'Completion certificate',
                  'value': {
                    'enrollment': {
                      'status': 2
                    }
                  }
                },
                {
                  'name': 'Merit certificate',
                  'value': {
                    'score': '>= 60'
                  }
                }
              ],
              'index': 1
            },
            {
              'code': 'issueTo',
              'dataType': 'text',
              'name': 'issueTo',
              'label': 'Issue certificate to',
              'description': 'Select',
              'editable': true,
              'inputType': 'select',
              'required': true,
              'displayProperty': 'Editable',
              'visible': true,
              'renderingHints': {
                'fieldColumnWidth': 'twelve'
              },
              'range': [
                {
                  'name': 'All',
                  'value': {
                    'user': {
                      'rootid': ''
                    }
                  }
                },
                {
                  'name': 'My state teacher',
                  'rootOrgId': ''
                }
              ],
              'index': 2
            }
          ]
        },
        'createdBy': '18150cf9-b839-4ccd-956a-66e359f22278',
        'updatedOn': null,
        'createdOn': 1597591999662,
        'key': 'certRules',
        'orgId': 'od1'
      }
    }
  },
  certAddSuccess: {
    'id': 'api.course.batch.cert.template.add',
    'ver': 'v1',
    'ts': '2020-08-26 16:57:48:922+0000',
    'params': {
      'resmsgid': null,
      'msgid': '55e3bad3-a0fb-0a18-0949-d658cf9e2f9e',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': 'SUCCESS'
    }
  },
  userMockData: {

    'lastName': 'User',
    'loginId': 'ntptest102',
    'regOrgId': '0123653943740170242',
    'roles': [
      'public'
    ],
    'rootOrg': {
      'dateTime': null,
      'preferredLanguage': 'English',
      'approvedBy': null,
      'channel': 'ROOT_ORG',
    },
    'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'userName': 'ntptest102',
    'rootOrgId': 'ORG_001',
    'userid': '874ed8a5-782e-4f6c-8f36-e0288455901e',
  }
};

