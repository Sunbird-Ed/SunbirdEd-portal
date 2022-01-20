export const mockObject = {
  MockItem: {
    role: 'COURSE_MENTOR',
    orgId: '123456'
  },
  roleList: [{
    'roleName': 'Content Curation',
    'role': 'CONTENT_CURATION',
    'actions': [{
      'id': 'CONTENT_CURATION',
      'name': 'Content Curation',
      'urls': ['', 'a']
    }]
  }, {
    'roleName': 'Book Creator',
    'role': 'BOOK_CREATOR',
    'actions': [{
      'id': 'BOOK_CREATOR',
      'name': 'Book Creator',
      'urls': ['', 'a']
    }]
  }, {
    'roleName': 'Book Reviewer',
    'role': 'BOOK_REVIEWER',
    'actions': [{
      'id': 'BOOK_REVIEWER',
      'name': 'Book Reviewer',
      'urls': ['', 'a']
    }]
  }],
  userObj: {
    'id': 'api.user.read',
    'ver': 'v1',
    'ts': '2018-02-28 12:07:33:518+0000',
    'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'roles': [
      {
        'role': 'BOOK_REVIEWER',
        'createdDate': null,
        'updatedBy': '1405f334-ee59-42fc-befb-51986221881e',
        'createdBy': '08631a74-4b94-4cf7-a818-831135248a4a',
        'scope': [
          {
            'organisationId': '01269878797503692810'
          }
        ],
        'updatedDate': null
      },
      {
        'role': 'CONTENT_CREATOR',
        'createdDate': null,
        'updatedBy': '1405f334-ee59-42fc-befb-51986221881e',
        'createdBy': '08631a74-4b94-4cf7-a818-831135248a4a',
        'scope': [
          {
            'organisationId': '01269878797503692811'
          }
        ],
        'updatedDate': null
      },
      {
        'role': 'COURSE_MENTOR',
        'createdDate': null,
        'updatedBy': '1405f334-ee59-42fc-befb-51986221881e',
        'createdBy': '08631a74-4b94-4cf7-a818-831135248a4a',
        'scope': [
          {
            'organisationId': '01269878797503692811'
          }
        ],
        'updatedDate': null
      },
      {
        'role': 'COURSE_CREATOR',
        'createdDate': null,
        'updatedBy': '1405f334-ee59-42fc-befb-51986221881e',
        'createdBy': '08631a74-4b94-4cf7-a818-831135248a4a',
        'scope': [
          {
            'organisationId': '01269878797503692811'
          }
        ],
        'updatedDate': null
      }
    ],
    'userOrgDetails': {
      'PUBLIC': {
        'orgId': '01269878797503692810',
        'orgName': 'ORG_001'
      },
      'COURSE_MENTOR': {
        'orgId': '01269878797503692810', 'orgName': 'ORG_001'
      },
      'COURSE_CREATOR': {
        'orgId': '01269878797503692810', 'orgName': 'ORG_001'
      },
      'ORG_ADMIN': {
        'orgId': '01269878797503692810', 'orgName': 'ORG_001'
      }
    },
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
      'channel': 'ROOT_ORG'
    },
    'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'userName': 'ntptest102',
    'rootOrgId': '01269878797503692810',
    'userid': '874ed8a5-782e-4f6c-8f36-e0288455901e',
    'userOrgDetails': {
      'PUBLIC': {
        'orgId': '01269878797503692810',
        'orgName': 'ORG_001'
      },
      'COURSE_MENTOR': {
        'orgId': '01269878797503692810', 'orgName': 'ORG_001'
      },
      'COURSE_CREATOR': {
        'orgId': '01269878797503692810', 'orgName': 'ORG_001'
      },
      'ORG_ADMIN': {
        'orgId': '01269878797503692810', 'orgName': 'ORG_001'
      }
    },
  },
  mockUserrole : [
    {
      'actionGroups': [
        {
          'name': 'Course Mentor',
          'id': 'COURSE_MENTOR',
          'actions': []
        }
      ],
      'name': 'Course Mentor',
      'id': 'COURSE_MENTOR'
    },
    {
      'actionGroups': [
        {
          'name': 'Content Creation',
          'id': 'CONTENT_CREATION',
          'actions': []
        },
        {
          'name': 'Content Curation',
          'id': 'CONTENT_CURATION',
          'actions': []
        },
        {
          'name': 'Content Review',
          'id': 'CONTENT_REVIEW',
          'actions': []
        }
      ],
      'name': 'Content Reviewer',
      'id': 'CONTENT_REVIEWER'
    },
    {
      'actionGroups': [
        {
          'name': 'Program Designer',
          'id': 'PROGRAM_DESIGNER',
          'actions': []
        }
      ],
      'name': 'Program Designer',
      'id': 'PROGRAM_DESIGNER'
    },
    {
      'actionGroups': [
        {
          'name': 'System Administration',
          'id': 'SYSTEM_ADMINISTRATION',
          'actions': []
        },
        {
          'name': 'Org Management',
          'id': 'ORG_MANAGEMENT',
          'actions': []
        }
      ],
      'name': 'Admin',
      'id': 'ADMIN'
    },
    {
      'actionGroups': [
        {
          'name': 'Teacher Badge Issuer',
          'id': 'TEACHER_BADGE_ISSUER',
          'actions': []
        }
      ],
      'name': 'Teacher Badge Issuer',
      'id': 'TEACHER_BADGE_ISSUER'
    },
    {
      'actionGroups': [
        {
          'name': 'Report Admin',
          'id': 'REPORT_ADMIN',
          'actions': []
        }
      ],
      'name': 'Report Admin',
      'id': 'REPORT_ADMIN'
    },
    {
      'actionGroups': [
        {
          'name': 'Org Management',
          'id': 'ORG_MANAGEMENT',
          'actions': []
        },
        {
          'name': 'Membership Management',
          'id': 'MEMBERSHIP_MANAGEMENT',
          'actions': []
        }
      ],
      'name': 'Org Admin',
      'id': 'ORG_ADMIN'
    },
    {
      'actionGroups': [
        {
          'name': 'Book Creator',
          'id': 'BOOK_CREATOR',
          'actions': []
        }
      ],
      'name': 'Book Creator',
      'id': 'BOOK_CREATOR'
    },
    {
      'actionGroups': [
        {
          'name': 'Book Reviewer',
          'id': 'BOOK_REVIEWER',
          'actions': []
        }
      ],
      'name': 'Book Reviewer',
      'id': 'BOOK_REVIEWER'
    },
    {
      'actionGroups': [
        {
          'name': 'Official TextBook Badge Issuer',
          'id': 'OFFICIAL_TEXTBOOK_BADGE_ISSUER',
          'actions': []
        }
      ],
      'name': 'Official TextBook Badge Issuer',
      'id': 'OFFICIAL_TEXTBOOK_BADGE_ISSUER'
    },
    {
      'actionGroups': [
        {
          'name': 'Course Creator',
          'id': 'COURSE_CREATOR',
          'actions': []
        }
      ],
      'name': 'Course Creator',
      'id': 'COURSE_CREATOR'
    },
    {
      'actionGroups': [
        {
          'name': 'Course Admin',
          'id': 'COURSE_ADMIN',
          'actions': []
        }
      ],
      'name': 'Course Admin',
      'id': 'COURSE_ADMIN'
    },
    {
      'actionGroups': [
        {
          'name': 'Report Viewer',
          'id': 'REPORT_VIEWER',
          'actions': []
        }
      ],
      'name': 'Report Viewer',
      'id': 'REPORT_VIEWER'
    },
    {
      'actionGroups': [
        {
          'name': 'Membership Management',
          'id': 'MEMBERSHIP_MANAGEMENT',
          'actions': []
        }
      ],
      'name': 'Org Moderator',
      'id': 'ORG_MODERATOR'
    },
    {
      'actionGroups': [
        {
          'name': 'Public',
          'id': 'PUBLIC',
          'actions': []
        }
      ],
      'name': 'Public',
      'id': 'PUBLIC'
    },
    {
      'actionGroups': [
        {
          'name': 'Announcement Sender',
          'id': 'ANNOUNCEMENT_SENDER',
          'actions': []
        }
      ],
      'name': 'Announcement Sender',
      'id': 'ANNOUNCEMENT_SENDER'
    },
    {
      'actionGroups': [
        {
          'name': 'Program Manager',
          'id': 'PROGRAM_MANAGER',
          'actions': []
        }
      ],
      'name': 'Program Manager',
      'id': 'PROGRAM_MANAGER'
    },
    {
      'actionGroups': [
        {
          'name': 'Content Creation',
          'id': 'CONTENT_CREATION',
          'actions': []
        }
      ],
      'name': 'Content Creator',
      'id': 'CONTENT_CREATOR'
    },
    {
      'actionGroups': [
        {
          'name': 'Flag Reviewer',
          'id': 'FLAG_REVIEWER',
          'actions': []
        }
      ],
      'name': 'Flag Reviewer',
      'id': 'FLAG_REVIEWER'
    }
  ],
  userSearch : {
    'id': '',
    'ver': 'private',
    'ts': '2019-09-11 09:15:34:076+0000',
    'params': {
        'resmsgid': null,
        'msgid': '5e2b6418-a528-96d1-8c07-f634a37d723c',
        'err': null,
        'status': 'success',
        'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
        'response': {
            'count': 1,
            'content': [
                {
                    'lastName': null,
                    'maskedPhone': null,
                    'rootOrgName': 'Custodian org',
                    'roles': [
                        'PUBLIC'
                    ],
                    'channel': 'custodianNtpStageOrg',
                    'updatedDate': '2019-09-09 05:43:16:415+0000',
                    'prevUsedPhone': '',
                    'isDeleted': false,
                    'organisations': [
                        {
                            'organisationId': '0126632859575746566',
                            'updatedBy': null,
                            'orgName': 'Custodian org',
                            'addedByName': null,
                            'addedBy': null,
                            'roles': [
                                'PUBLIC'
                            ],
                            'approvedBy': null,
                            'updatedDate': null,
                            'userId': 'df9c5139-402c-4cd3-9b38-99da81f12f13',
                            'approvaldate': null,
                            'isDeleted': false,
                            'parentOrgId': null,
                            'hashTagId': '0126632859575746566',
                            'isRejected': null,
                            'id': '01284265554396774458',
                            'position': null,
                            'isApproved': null,
                            'orgjoindate': '2019-09-05 18:05:40:222+0000',
                            'orgLeftDate': null
                        }
                    ],
                    'maskedEmail': 'ra******@yopmail.com',
                    'id': 'df9c5139-402c-4cd3-9b38-99da81f12f13',
                    'tempPassword': null,
                    'email': 'ra******@yopmail.com',
                    'identifier': 'df9c5139-402c-4cd3-9b38-99da81f12f13',
                    'thumbnail': null,
                    'updatedBy': 'df9c5139-402c-4cd3-9b38-99da81f12f13',
                    'phoneVerified': false,
                    'profileSummary': null,
                    'locationIds': [

                    ],
                    'registryId': null,
                    'userName': 'rajtest11936',
                    'rootOrgId': '0126632859575746566',
                    'prevUsedEmail': '',
                    'firstName': 'rajtest1',
                    'emailVerified': true,
                    'lastLoginTime': null,
                    'tncAcceptedOn': '2019-09-09T05:43:00.100Z',
                    'createdDate': '2019-09-05 18:05:39:927+0000',
                    'framework': {
                        'gradeLevel': [
                            'Class 5',
                            'Class 6',
                            'Class 7',
                            'Class 8'
                        ],
                        'subject': [
                            'English',
                            'Social Science',
                            'Science'
                        ],
                        'id': [
                            'as_k-12'
                        ],
                        'medium': [
                            'English',
                            'Assamese'
                        ],
                        'board': [
                            'State (Assam)'
                        ]
                    },
                    'phone': '',
                    'createdBy': '8de85bc9-15c9-46ed-84a0-84ebfa7a1486',
                    'currentLoginTime': null,
                    'userType': 'OTHER',
                    'tncAcceptedVersion': 'v1',
                    'status': 1
                }
            ]
        }
    }
}
};
