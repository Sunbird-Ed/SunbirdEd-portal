export const mockResponseData = {
    validateCertificateCodeData: {
        'related': null,
        'version': null,
        'endorsement': null,
        'id': 'http://localhost:8080/_schemas/Certificate/8c8b9c91-8cdb-44c2-9365-5f443282c3dd',
        'type': [
          'Assertion',
          'Extension',
          'extensions:CertificateExtension'
        ],
        'issuedOn': '2019-08-31T12:52:25Z',
        'recipient': {
          'related': null,
          'version': null,
          'endorsement': null,
          'identity': '9845978851',
          'type': [
            'phone'
          ],
          'hashed': false,
          'salt': null,
          'components': null,
          'name': 'Aishwarya',
          'photo': null,
          'dob': null,
          'gender': null,
          'tag': null,
          'urn': null,
          'url': null,
          '@context': 'http://localhost:8080/_schemas/context.json'
        },
        'badge': {
          'related': null,
          'version': null,
          'endorsement': null,
          'id': 'http://localhost:8080/_schemas/Badge.json',
          'type': [
            'BadgeClass'
          ],
          'name': 'Sunbird installation',
          'description': 'Certificate of Appreciation in National Level ITI Grading',
          'image': 'https://certs.example.gov/o/dgt/HJ5327VB1247G',
          'criteria': null,
          'issuer': {
            'context': 'http://localhost:8080/_schemas/context.json',
            'related': null,
            'version': null,
            'endorsement': null,
            'id': 'http://localhost:8080/_schemas/Issuer.json',
            'type': [
              'Issuer'
            ],
            'name': 'NIIT',
            'email': null,
            'url': null,
            'publicKey': null
          },
          'alignment': null,
          '@context': 'http://localhost:8080/_schemas/context.json'
        },
        'image': null,
        'evidence': {
          'related': null,
          'version': null,
          'endorsement': null,
          'id': 'http://localhost:8080/_schemas/Certificate/8c8b9c91-8cdb-44c2-9365-5f443282c3dd',
          'type': [
            'Evidence',
            'Extension',
            'extensions:AssessedEvidence'
          ],
          'narrative': null,
          'name': null,
          'description': null,
          'genre': null,
          'audience': null,
          'subject': null,
          'assessment': {
            'related': null,
            'version': null,
            'endorsement': null,
            'type': [
              'Extension',
              'extensions:Assessment'
            ],
            'value': 21.0,
            '@context': 'http://localhost:8080/_schemas/context.json'
          },
          'assessedBy': '2019-2-14',
          'assessedOn': null,
          'signature': null,
          '@context': 'http://localhost:8080/_schemas/extensions/AssessedEvidence/context.json'
        },
        'expires': '2019-09-30T12:52:25Z',
        'verification': {
          'related': null,
          'version': null,
          'endorsement': null,
          'type': [
            'SignedBadge'
          ],
          'verificationProperty': null,
          'startsWith': null,
          'allowedOrigins': null,
          '@context': null
        },
        'narrative': null,
        'revoked': false,
        'revocationReason': null,
        'awardedThrough': null,
        'signatory': null,
        'printUri': null,
        'validFrom': '2019-06-21',
        'signature': null,
        '@context': 'http://localhost:8080/_schemas/context.json'
      },
    preferenceReadAPiResponse: {
      'id': 'api.org.preferences.read',
      'params': {
        'resmsgid': null,
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
          'key': 'certRules',
          'orgId': 'od1'
        }
      }
    },
    batchDetailsApiResponse: {
      'id': 'api.course.batch.read',
      'ver': 'v1',
      'ts': '2020-08-20 17:54:35:831+0000',
      'params': {
        'resmsgid': null,
        'msgid': 'fa4ce6ff-aaec-6775-3177-621587488cd7',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'response': {
          'identifier': '01307963768800870441',
          'createdFor': [
            '0124784842112040965'
          ],
          'endDate': null,
          'description': '',
          'updatedDate': '2020-08-07 08:45:33:726+0000',
          'batchId': '01307963768800870441',
          'createdDate': '2020-08-05 13:41:56:665+0000',
          'createdBy': 'ab467e6e-1f32-453c-b1d8-c6b5fa6c7b9e',
          'mentors': [],
          'name': 'Sudip Mukherjee',
          'id': '01307963768800870441',
          'enrollmentType': 'open',
          'courseId': 'do_21307528604532736012398',
          'enrollmentEndDate': null,
          'startDate': '2020-08-05',
          'status': 1
        }
      }
    }
};
