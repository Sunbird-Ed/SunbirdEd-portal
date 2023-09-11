import { FieldConfigInputType } from '@project-sunbird/common-form-elements-full';

export const mockRes = {
  orgSearch: {
    'id': 'api.org.search',
    'ver': 'v1',
    'ts': '2020-05-30 12:48:36:787+0000',
    'params': {
      'resmsgid': null,
      'msgid': null,
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'count': 3,
        'content': [{
          'dateTime': null,
          'preferredLanguage': null,
          'approvedBy': null,
          'channel': 'ROOT_ORG',
          'description': 'updating description',
          'updatedDate': '2019-02-14 09:38:01:769+0000',
          'addressId': null,
          'provider': 'someprovider1234',
          'locationId': '0123668622585610242',
          'orgCode': null,
          'theme': null,
          'id': '0123653943740170242',
          'communityId': null,
          'isApproved': null,
          'email': null,
          'slug': 'root_org',
          'identifier': '0123653943740170242',
          'thumbnail': null,
          'orgName': 'QA ORG',
          'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
          'locationIds': ['95fdafcd-5a63-44b7-b570-9ae87a6a7d04', '969dd3c1-4e98-4c17-a994-559f2dc70e18', '7608af61-285f-4e25-b644-3d40cc7d7e0d'],
          'externalId': 'someid1234',
          'isRootOrg': false,
          'rootOrgId': '0123131115383275520',
          'approvedDate': null,
          'imgUrl': null,
          'homeUrl': null,
          'orgTypeId': null,
          'isDefault': null,
          'contactDetail': [],
          'createdDate': '2017-10-31 10:43:48:600+0000',
          'createdBy': null,
          'parentOrgId': null,
          'hashTagId': '0123653943740170242',
          'noOfMembers': null,
          'status': null
        }, {
          'dateTime': null,
          'preferredLanguage': 'English',
          'approvedBy': null,
          'channel': 'ROOT_ORG',
          'description': 'Default Org',
          'updatedDate': '2019-02-14 09:33:26:398+0000',
          'addressId': null,
          'provider': null,
          'locationId': null,
          'orgCode': null,
          'theme': null,
          'id': '0125648776347320320',
          'communityId': null,
          'isApproved': null,
          'email': null,
          'slug': 'root_org',
          'identifier': '0125648776347320320',
          'thumbnail': null,
          'orgName': 'Sunbird',
          'updatedBy': null,
          'locationIds': ['95fdafcd-5a63-44b7-b570-9ae87a6a7d04', '7608af61-285f-4e25-b644-3d40cc7d7e0d', '969dd3c1-4e98-4c17-a994-559f2dc70e18'],
          'externalId': null,
          'isRootOrg': false,
          'rootOrgId': '0123131115383275520',
          'approvedDate': null,
          'imgUrl': 'N/A',
          'homeUrl': 'N/A',
          'orgTypeId': null,
          'isDefault': null,
          'contactDetail': [],
          'createdDate': '2018-08-09 07:03:18:742+0000',
          'createdBy': 'f443659f-12b0-424d-a849-93c29e87cfaf',
          'parentOrgId': null,
          'hashTagId': '0125648776347320320',
          'noOfMembers': null,
          'status': 1
        }, {
          'dateTime': null,
          'preferredLanguage': 'English',
          'keys': {
            'signKeys': ['5766', '5767'],
            'encKeys': ['5766', '5767']
          },
          'approvedBy': null,
          'channel': 'ROOT_ORG',
          'description': 'Andhra State Boardsssssss',
          'updatedDate': '2018-11-28 10:00:08:675+0000',
          'addressId': null,
          'provider': null,
          'locationId': null,
          'orgCode': 'sunbird',
          'theme': null,
          'id': 'ORG_001',
          'communityId': null,
          'isApproved': null,
          'email': 'support_dev@sunbird.org',
          'slug': 'sunbird',
          'identifier': 'ORG_001',
          'thumbnail': null,
          'orgName': 'Sunbird',
          'updatedBy': '1d7b85b0-3502-4536-a846-d3a51fd0aeea',
          'locationIds': ['969dd3c1-4e98-4c17-a994-559f2dc70e18'],
          'externalId': null,
          'isRootOrg': true,
          'rootOrgId': 'ORG_001',
          'approvedDate': null,
          'imgUrl': null,
          'homeUrl': null,
          'orgTypeId': null,
          'isDefault': true,
          'contactDetail': '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'},{\'phone\':\'+91213124234234\',\'email\':\'test1@test.com\'}]',
          'createdDate': null,
          'createdBy': null,
          'parentOrgId': null,
          'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
          'noOfMembers': 5,
          'status': 1
        }]
      }
    }
  },
  updateProfile: {
    'id': 'api.user.update',
    'ver': 'v1',
    'ts': '2020-05-30 13:06:57:025+0000',
    'params': {
      'resmsgid': null,
      'msgid': null,
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': 'SUCCESS',
      'errors': []
    }
  },
  checkValidationInput: {
    'code': 'udiseId',
    'dataType': 'text',
    'name': 'udiseId',
    'label': 'School UDISE ID/ Org ID',
    'description': 'Enter UDISE ID',
    'editable': true,
    'inputType': 'input',
    'required': true,
    'validation': [{
      'type': 'minlength',
      'value': '11',
      'message': 'Minimum length should be 11 numbers'
    }, {
      'type': 'maxlength',
      'value': '11',
      'message': 'Maximum length should be 11 numbers'
    }, {
      'type': 'pattern',
      'value': '^[0-9]*$',
      'message': 'Only 11 digit number is allowed'
    }],
    'displayProperty': 'Editable',
    'visible': true,
    'renderingHints': {
      'fieldColumnWidth': 'twelve'
    },
    'index': 4
  },
  stateData: {
    'id': 'api.location.search',
    'ver': 'v1',
    'ts': '2020-05-30 14:28:49:460+0000',
    'params': {
      'resmsgid': null,
      'msgid': null,
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': [{
        'code': '35',
        'name': 'Andaman & Nicobar Islands',
        'id': '246c6400-ef5a-4edf-a3d9-256b79ea8d1d',
        'type': 'state'
      }]
    }
  },
  userData: {
    'id': 'api.user.read',
    'ver': 'v2',
    'ts': '2020-05-30 14:39:47:371+0000',
    'params': {
      'resmsgid': null,
      'msgid': null,
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'tcStatus': null,
        'maskedPhone': null,
        'rootOrgName': 'CustROOTOrg10',
        'subject': [],
        'channel': 'custchannel',
        'language': [],
        'updatedDate': '2020-05-30 14:39:40:993+0000',
        'managedBy': null,
        'flagsValue': 2,
        'id': 'efc09040-1ae3-40c5-b8d3-4e7fbce7b772',
        'recoveryEmail': '',
        'identifier': 'efc09040-1ae3-40c5-b8d3-4e7fbce7b772',
        'thumbnail': null,
        'profileVisibility': {
          'lastName': 'public',
          'webPages': 'private',
          'jobProfile': 'private',
          'address': 'private',
          'education': 'private',
          'gender': 'private',
          'profileSummary': 'public',
          'subject': 'private',
          'language': 'private',
          'avatar': 'private',
          'userName': 'public',
          'skills': 'private',
          'firstName': 'public',
          'badgeAssertions': 'private',
          'phone': 'private',
          'countryCode': 'private',
          'dob': 'private',
          'grade': 'private',
          'location': 'private',
          'email': 'private'
        },
        'updatedBy': 'efc09040-1ae3-40c5-b8d3-4e7fbce7b772',
        'accesscode': null,
        'externalIds': [{
          'idType': 'declared-ext-id',
          'provider': 'ROOT_ORG',
          'id': 'test ext id ss'
        }, {
          'idType': 'declared-school-name',
          'provider': 'ROOT_ORG',
          'id': 'test school 123s'
        }, {
          'idType': 'declared-school-udise-code',
          'provider': 'ROOT_ORG',
          'id': '09876543453'
        }, {
          'idType': 'declared-email',
          'provider': 'ROOT_ORG',
          'id': 'asd@yopmail.com'
        },
        {
          'idType': 'declared-state',
          'provider': 'ROOT_ORG',
          'id': '29'
        }],
        'registryId': null,
        'roleList': [{
          'name': 'Content Curation',
          'id': 'CONTENT_CURATION'
        }, {
          'name': 'Content Creator',
          'id': 'CONTENT_CREATOR'
        }, {
          'name': 'Official TextBook Badge Issuer',
          'id': 'OFFICIAL_TEXTBOOK_BADGE_ISSUER'
        }, {
          'name': 'Admin',
          'id': 'ADMIN'
        }, {
          'name': 'Course Mentor',
          'id': 'COURSE_MENTOR'
        }, {
          'name': 'Org Admin',
          'id': 'ORG_ADMIN'
        }, {
          'name': 'Content Review',
          'id': 'CONTENT_REVIEW'
        }, {
          'name': 'Flag Reviewer',
          'id': 'FLAG_REVIEWER'
        }, {
          'name': 'Announcement Sender',
          'id': 'ANNOUNCEMENT_SENDER'
        }, {
          'name': 'System Administration',
          'id': 'SYSTEM_ADMINISTRATION'
        }, {
          'name': 'Book Creator',
          'id': 'BOOK_CREATOR'
        }, {
          'name': 'Course Creator',
          'id': 'COURSE_CREATOR'
        }, {
          'name': 'Report Viewer',
          'id': 'REPORT_VIEWER'
        }, {
          'name': 'Flag Reviewer',
          'id': 'FLAG_REVIEWER '
        }, {
          'name': 'Membership Management',
          'id': 'MEMBERSHIP_MANAGEMENT'
        }, {
          'name': 'Content Creation',
          'id': 'CONTENT_CREATION'
        }, {
          'name': 'Book Reviewer',
          'id': 'BOOK_REVIEWER'
        }, {
          'name': 'Teacher Badge Issuer',
          'id': 'TEACHER_BADGE_ISSUER'
        }, {
          'name': 'Org Management',
          'id': 'ORG_MANAGEMENT'
        }, {
          'name': 'Course Admin',
          'id': 'COURSE_ADMIN'
        }, {
          'name': 'Org Moderator',
          'id': 'ORG_MODERATOR'
        }, {
          'name': 'Public',
          'id': 'PUBLIC'
        }, {
          'name': 'Content Reviewer',
          'id': 'CONTENT_REVIEWER'
        }, {
          'name': 'Report Admin',
          'id': 'REPORT_ADMIN'
        }],
        'rootOrgId': '01285019302823526477',
        'prevUsedEmail': '',
        'firstName': 'Sourav',
        'tncAcceptedOn': '2020-05-30T06:22:59.157Z',
        'phone': '',
        'dob': null,
        'grade': [],
        'currentLoginTime': null,
        'userType': 'OTHER',
        'status': 1,
        'lastName': null,
        'tncLatestVersion': 'v1',
        'gender': null,
        'roles': ['PUBLIC'],
        'prevUsedPhone': '',
        'stateValidated': false,
        'badgeAssertions': [],
        'isDeleted': false,
        'organisations': [{
          'updatedBy': null,
          'organisationId': '01285019302823526477',
          'orgName': 'CustROOTOrg10',
          'addedByName': null,
          'addedBy': null,
          'roles': ['PUBLIC'],
          'approvedBy': null,
          'channel': 'custchannel',
          'locationIds': [],
          'updatedDate': null,
          'userId': 'efc09040-1ae3-40c5-b8d3-4e7fbce7b772',
          'approvaldate': null,
          'isDeleted': false,
          'parentOrgId': null,
          'hashTagId': '01285019302823526477',
          'isRejected': null,
          'locations': [],
          'position': null,
          'id': '013032002404712448423',
          'orgjoindate': '2020-05-30 06:22:55:842+0000',
          'isApproved': null,
          'orgLeftDate': null
        }],
        'provider': null,
        'countryCode': '+91',
        'tncLatestVersionUrl': 'https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html',
        'maskedEmail': 'so******@techjoomla.com',
        'tempPassword': null,
        'email': 'so******@techjoomla.com',
        'rootOrg': {
          'dateTime': null,
          'preferredLanguage': null,
          'keys': {},
          'channel': 'custchannel',
          'approvedBy': null,
          'description': null,
          'updatedDate': null,
          'addressId': null,
          'orgType': null,
          'provider': 'custchannel',
          'orgCode': null,
          'locationId': null,
          'theme': null,
          'id': '01285019302823526477',
          'isApproved': null,
          'communityId': null,
          'slug': 'custchannel',
          'email': null,
          'identifier': '01285019302823526477',
          'thumbnail': null,
          'updatedBy': null,
          'orgName': 'CustROOTOrg10',
          'address': {},
          'locationIds': [],
          'externalId': 'custexternalid',
          'isRootOrg': true,
          'rootOrgId': '01285019302823526477',
          'imgUrl': null,
          'approvedDate': null,
          'orgTypeId': null,
          'homeUrl': null,
          'isDefault': null,
          'createdDate': '2019-09-16 09:40:27:984+0000',
          'parentOrgId': null,
          'createdBy': null,
          'hashTagId': '01285019302823526477',
          'noOfMembers': null,
          'status': 1
        },
        'defaultProfileFieldVisibility': 'private',
        'profileSummary': null,
        'phoneVerified': false,
        'tcUpdatedDate': null,
        'userLocations': [{
          'code': '2902',
          'name': 'Bagalkot',
          'id': '5187eae1-621d-4a44-96df-fd728cc5ba41',
          'type': 'district',
          'parentId': '969dd3c1-4e98-4c17-a994-559f2dc70e18'
        }, {
          'code': '29',
          'name': 'Karnataka',
          'id': '969dd3c1-4e98-4c17-a994-559f2dc70e18',
          'type': 'state'
        }],
        'recoveryPhone': '',
        'userName': 'sourav_sd1b',
        'userId': 'efc09040-1ae3-40c5-b8d3-4e7fbce7b772',
        'promptTnC': false,
        'emailVerified': true,
        'framework': {},
        'createdDate': '2020-05-30 06:22:55:836+0000',
        'createdBy': null,
        'location': null,
        'tncAcceptedVersion': 'v1',
        'declarations': [
          {
            'persona': 'volunteer',
            'errorType': null,
            'orgId': '013016492159606784174',
            'status': 'PENDING',
            'info': {
              'declared-email': 'dev-user-10@yopmail.com',
              'declared-ext-id': 'EKL12345',
              'declared-phone': '8867003222',
              'declared-school-name': 'Ekstep dev school',
              'declared-school-udise-code': '12312312311',
              'type': 'Kendria Vidhyalaya 1',
              'location':'test',
              'district':'test'
            }
          }
        ],
      }
    }
  },
  tncConfig: {
    'id': 'api',
    'params': {
      'status': 'success',
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'id': 'tncConfig',
        'field': 'tncConfig',
        'value': '{"latestVersion":"v4","v4":{"url":"http://test.com/tnc.html"}}'
      }
    }
  },
  tncConfigIncorrectData: {
    'id': 'api',
    'params': {
      'status': 'success',
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'id': 'tncConfig',
        'field': 'tncConfig',
        'value': '{"latestVersion":"v4","v4":{"url":}}'
      }
    }
  }, successResponse: {
    responseCode: 'OK'
  },
  externalId: [
    {
      'idType': 'declared-ext-id',
      'provider': 'tp',
      'id': 'p'
    },
    {
      'idType': 'declared-school-name',
      'provider': 'tp',
      'id': '2222'
    }, {
      'idType': 'declared-state',
      'provider': 'tp',
      'id': '29'
    }
  ],
  personas: [
    {
      'code': 'persona',
      'dataType': 'text',
      'name': 'persona',
      'label': 'Persona',
      'description': 'Select persona',
      'range': [
        {
          'label': 'Teacher',
          'value': 'teacher',
          'index': 1
        },
        {
          'label': 'Admin',
          'value': 'admin',
          'index': 2
        },
        {
          'label': 'Volunteer',
          'value': 'volunteer',
          'index': 3
        }
      ],
      'index': 1
    }
  ],
  tenantsList: [
    {
      'code': 'tenants',
      'name': 'tenants',
      'label': 'Tenants',
      'range': [
        {
          'label': 'Andhra Pradesh',
          'value': '01232241426855526450',
          'index': 1
        },
        {
          'label': 'CBSE',
          'value': '013016492159606784174',
          'index': 3
        }
      ]
    }
  ],
  teacherDetailForm: [
    {
      'code': 'declared-phone',
      'dataType': 'number',
      'name': 'phone',
      'label': 'Mobile Number',
      'visible': true,
      'index': 2
    },
    {
      'code': 'declared-email',
      'dataType': 'text',
      'name': 'email',
      'label': 'Email Address',
      'visible': true,
      'index': 3
    },
    {
      'code': 'declared-school-name',
      'dataType': 'text',
      'name': 'school',
      'label': 'Andhra pradesh School name',
      'visible': true,
      'index': 4
    },
    {
      'code': 'declared-school-udise-code',
      'dataType': 'text',
      'name': 'udiseId',
      'label': 'Andhra pradesh UDISE ID',
      'visible': true,
      'index': 5
    },
    {
      'code': 'declared-ext-id',
      'dataType': 'text',
      'name': 'teacherId',
      'label': 'Andhra pradesh teacher ID',
      'visible': true,
      'index': 6
    },
    {
      'code': 'tnc',
      'dataType': 'text',
      'name': 'tnc',
      'description': '',
      'visible': true,
      'index': 7
    }
  ],
  personaTenantForm: [
    {
      'code': 'persona',
      'type': 'select',
      'templateOptions': {
        'label': 'I am a',
        'placeHolder': 'Select persona',
        'options': [
          {
            'value': 'teacher',
            'label': 'Teacher'
          },
          {
            'value': 'other',
            'label': 'Other'
          }
        ]
      },
      'validations': [
        {
          'type': 'required',
          'value': true,
          'message': 'Persona is required'
        }
      ]
    },
    {
      'code': 'tenant',
      'type': 'select',
      'templateOptions': {
        'label': 'with',
        'placeHolder': 'Select tenants',
        'options': [
          {
            'label': 'Andhra Pradesh',
            'value': '012320771042492416102'
          },
          {
            'label': 'Assam',
            'value': '01254289984278528046'
          },
          {
            'label': 'Bihar',
            'value': '01259339426316288054'
          }
        ],
        'validations': [
          {
            'type': 'required',
            'value': true,
            'message': 'Persona is required'
          }
        ]
      }
    }
  ],
  phoneConfig: {
    'code': 'declared-phone',
    'fieldName': 'Mobile Number',
    'type': FieldConfigInputType.INPUT,
    'templateOptions': {
      'labelHtml': {
        'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
        'values': {
          '$0': 'PHONE_PLACEHOLDER'
        }
      },
      'placeHolder': 'ENTER_PHONE_POPUP_TITLE',
      'prefix': '+91 -'
    },
    'asyncValidation': {
      'marker': 'MOBILE_OTP_VALIDATION',
      'message': 'PLEASE_VALIDATE_YOUR_MOBILE_NUMBER',
      'trigger': 'validate'
    }
  },
  declaredLatestFormValue: {
    'externalIds': '',
    'children': {
      'externalIds': {
        'declared-phone': '8698645680',
        'declared-email': 'pdf_test@yopmail.com',
        'declared-school-name': 'abcd',
        'declared-school-udise-code': 'cdd',
        'declared-ext-id': 'cdd'
      }
    }
  },
  tenantPersonaLatestFormValue: {
    'persona': 'teacher',
    'tenant': '01259339426316288054'
  },
  declarationFormConfig: [
    {
      'code': 'name',
      'type': 'label',
      'templateOptions': {
        'labelHtml': {
          'contents': '<p>$0:&nbsp;$1</p>',
          'values': {
            '$0': 'NAME',
            '$1': ''
          }
        }
      }
    },
    {
      'code': 'state',
      'type': 'label',
      'templateOptions': {
        'labelHtml': {
          'contents': '<p>$0:&nbsp;$1</p>',
          'values': {
            '$0': 'STATE',
            '$1': ''
          }
        }
      }
    },
    {
      'code': 'district',
      'type': 'label',
      'templateOptions': {
        'labelHtml': {
          'contents': '<p>$0:&nbsp;$1</p>',
          'values': {
            '$0': 'DISTRICT',
            '$1': ''
          }
        }
      }
    },
    {
      'code': 'externalIds',
      'type': 'nested_group',
      'children': [
        {
          'code': 'declared-phone',
          'fieldName': 'Mobile Number',
          'type': 'input',
          'templateOptions': {
            'labelHtml': {
              'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
              'values': {
                '$0': 'PHONE_PLACEHOLDER'
              }
            },
            'placeHolder': 'ENTER_PHONE_POPUP_TITLE',
            'prefix': '+91 -'
          },
          'validations': [
            {
              'type': 'required',
              'value': true,
              'message': 'ERROR_PHONE_REQUIRED'
            },
            {
              'type': 'pattern',
              'value': '^[6-9*][0-9*]{9}$',
              'message': 'ERROR_PHONE_INVALID'
            }
          ],
          'asyncValidation': {
            'marker': 'MOBILE_OTP_VALIDATION',
            'message': 'PLEASE_VALIDATE_YOUR_MOBILE_NUMBER',
            'trigger': 'validate'
          }
        },
        {
          'code': 'declared-email',
          'fieldName': 'Email Address',
          'type': 'input',
          'templateOptions': {
            'placeHolder': 'EMAIL_PLACEHOLDER',
            'labelHtml': {
              'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
              'values': {
                '$0': 'EMAIL_ID_PLACEHOLDER'
              }
            }
          },
          'validations': [
            {
              'type': 'pattern',
              'value': '^[A-Za-z0-9._*%+-]+@[A-Za-z0-9.-]+\\.[a-z]{2,}$',
              'message': 'ERROR_EMAIL_INVALID'
            }
          ],
          'asyncValidation': {
            'marker': 'EMAIL_OTP_VALIDATION',
            'message': 'PLEASE_VALIDATE_YOUR_EMAIL_ADDRESS',
            'trigger': 'validate'
          }
        },
        {
          'code': 'declared-school-name',
          'fieldName': 'School/Organization name',
          'type': 'input',
          'templateOptions': {
            'label': 'SCHOOL_OR_ORG_NAME',
            'placeHolder': 'ENTER_SCHOOL_NAME'
          }
        },
        {
          'code': 'declared-school-udise-code',
          'fieldName': 'School UDISE ID/Org ID',
          'type': 'input',
          'templateOptions': {
            'label': 'SCHOOL_UDISE_ID_OR_ORG_ID',
            'placeHolder': 'ENTER_UDISE_ID'
          }
        },
        {
          'code': 'location',
          'fieldName': 'School location',
          'type': 'input',
          'templateOptions': {
            'dataSrc':{
                  'marker':'LOCATION_LIST',
                  'params':{
                    'id':'state'
                  }
            },
            'label': 'LOCATION',
            'placeHolder': 'ENTER_LOCATION'
          }
        },
        {
          'code': 'district',
          'fieldName': 'School district',
          'type': 'input',
          'templateOptions': {
            'dataSrc':{
                  'marker':'LOCATION_LIST',
                  'params':{
                    'id':'district'
                  }
            },
            'label': 'LOCATION',
            'placeHolder': 'ENTER_LOCATION'
          }
        },
        {
          'code': 'declared-ext-id',
          'fieldName': 'Your ID from State/Board/Org',
          'type': 'input',
          'templateOptions': {
            'labelHtml': {
              'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
              'values': {
                '$0': 'ENTER_ID_AS_REQUESTED_BY_STATE_BOARD_ORG'
              }
            },
            'placeHolder': 'ENTER_ID'
          },
          'validations': [
            {
              'type': 'required',
              'value': true,
              'message': 'ID_IS_REQUIRED'
            },
            {
              'type': 'pattern',
              'value': '^[A-Za-z0-9]*$',
              'message': 'SPECIAL_CHARACTERS_NOT_SUPPORTED'
            }
          ]
        }
      ],
      'templateOptions': {}
    },
    {
      'code': 'tnc',
      'type': 'checkbox',
      'templateOptions': {
        'labelHtml': {
          'contents': '<span>$tnc <u><a href="$url">$0</a></u></span>',
          'values': {
            '$tnc': 'SELF_DECLARE_TEACHER_TNC',
            '$url': 'url',
            '$0': 'PRIVACY_POLICY'
          }
        }
      },
      'validations': [
        {
          'type': 'required',
          'value': true,
          'message': ''
        }
      ]
    }
  ],
  mobileFormElement: {
    'code': 'declared-phone',
    'fieldName': 'Mobile Number',
    'type': 'input',
    'templateOptions': {
      'labelHtml': {
        'contents': '<span>$0&nbsp;<span class="required-asterisk">*</span></span>',
        'values': {
          '$0': 'PHONE_PLACEHOLDER'
        }
      },
      'placeHolder': 'ENTER_PHONE_POPUP_TITLE',
      'prefix': '+91 -'
    },
    'validations': [
      {
        'type': 'required',
        'value': true,
        'message': 'ERROR_PHONE_REQUIRED'
      },
      {
        'type': 'pattern',
        'value': '^[6-9*][0-9*]{9}$',
        'message': 'ERROR_PHONE_INVALID'
      }
    ],
    'asyncValidation': {
      'marker': 'MOBILE_OTP_VALIDATION',
      'message': 'PLEASE_VALIDATE_YOUR_MOBILE_NUMBER',
      'trigger': 'validate'
    },
    'default': '8698645680'
  }
};
