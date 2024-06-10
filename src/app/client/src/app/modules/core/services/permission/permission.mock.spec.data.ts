export const mockPermissionRes = {
    error: {
        'id': 'api.user.read',
        'ver': 'v1',
        'ts': '2018-02-28 12:07:33:518+0000',
        'params': {
            'resmsgid': null,
            'msgid': 'bdf695fd-3916-adb0-2072-1d53deb14aea',
            'err': null,
            'status': 'error',
            'errmsg': null
        },
        'responseCode': 'CLINTERROR',
        'result': {}
    },
    success: {
      'id': 'api.role.read',
      'ver': 'v1',
      'ts': '2018-03-13 17:26:17:044+0000',
      'params': {
        'resmsgid': null,
        'msgid': 'e392fb5f-729f-42b3-a74f-35df36938e9d',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'roles': [
          {
            'actionGroups': [
              {
                'name': 'Course Mentor',
                'id': 'COURSE_MENTOR',
                'actions': [
                  {}
                ]
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
                'actions': [
                  {
                    'urls': [
                      'v1/course/create'
                    ],
                    'name': 'createCourse',
                    'id': 'createCourse'
                  },
                  {
                    'urls': [],
                    'name': 'updateCourse',
                    'id': 'updateCourse'
                  },
                  {
                    'urls': [],
                    'name': 'createContent',
                    'id': 'createContent'
                  },
                  {
                    'urls': [],
                    'name': 'updateContent',
                    'id': 'updateContent'
                  }
                ]
              },
              {
                'name': 'Content Curation',
                'id': 'CONTENT_CURATION',
                'actions': [
                  {
                    'urls': [],
                    'name': 'flagCourse',
                    'id': 'flagCourse'
                  },
                  {
                    'urls': [],
                    'name': 'flagContent',
                    'id': 'flagContent'
                  }
                ]
              },
              {
                'name': 'Content Review',
                'id': 'CONTENT_REVIEW',
                'actions': [
                  {
                    'urls': [
                      '/v1/course/publish'
                    ],
                    'name': 'publishCourse',
                    'id': 'publishCourse'
                  },
                  {
                    'urls': [
                      '/v1/course/publish'
                    ],
                    'name': 'publishContent',
                    'id': 'publishContent'
                  }
                ]
              }
            ],
            'name': 'Content Reviewer',
            'id': 'CONTENT_REVIEWER'
          },
          {
            'actionGroups': [
              {
                'name': 'System Administration',
                'id': 'SYSTEM_ADMINISTRATION',
                'actions': [
                  {
                    'urls': [
                      '/v1/org/suspend'
                    ],
                    'name': 'suspendOrg',
                    'id': 'suspendOrg'
                  },
                  {
                    'urls': [
                      '/v1/user/block'
                    ],
                    'name': 'suspendUser',
                    'id': 'suspendUser'
                  },
                  {
                    'urls': [
                      '/v1/org/upload'
                    ],
                    'name': 'orgupload',
                    'id': 'orgupload'
                  }
                ]
              },
              {
                'name': 'Org Management',
                'id': 'ORG_MANAGEMENT',
                'actions': [
                  {
                    'urls': [],
                    'name': 'createOrg',
                    'id': 'createOrg'
                  },
                  {
                    'urls': [
                      '/v1/organisation/update'
                    ],
                    'name': 'updateOrg',
                    'id': 'updateOrg'
                  },
                  {
                    'urls': [],
                    'name': 'removeOrg',
                    'id': 'removeOrg'
                  },
                  {
                    'urls': [
                      '/v1/user/create'
                    ],
                    'name': 'createUser',
                    'id': 'createUser'
                  },
                  {
                    'urls': [],
                    'name': 'updateUser',
                    'id': 'updateUser'
                  }
                ]
              }
            ],
            'name': 'Admin',
            'id': 'ADMIN'
          },
          {
            'actionGroups': [
              {
                'name': 'Org Management',
                'id': 'ORG_MANAGEMENT',
                'actions': [
                  {
                    'urls': [],
                    'name': 'createOrg',
                    'id': 'createOrg'
                  },
                  {
                    'urls': [
                      '/v1/organisation/update'
                    ],
                    'name': 'updateOrg',
                    'id': 'updateOrg'
                  },
                  {
                    'urls': [],
                    'name': 'removeOrg',
                    'id': 'removeOrg'
                  },
                  {
                    'urls': [
                      '/v1/user/create'
                    ],
                    'name': 'createUser',
                    'id': 'createUser'
                  },
                  {
                    'urls': [],
                    'name': 'updateUser',
                    'id': 'updateUser'
                  }
                ]
              },
              {
                'name': 'Membership Management',
                'id': 'MEMBERSHIP_MANAGEMENT',
                'actions': [
                  {
                    'urls': [
                      '/v1/user/create'
                    ],
                    'name': 'addMember',
                    'id': 'addMember'
                  },
                  {
                    'urls': [],
                    'name': 'removeMember',
                    'id': 'removeMember'
                  },
                  {
                    'urls': [],
                    'name': 'suspendMember',
                    'id': 'suspendMember'
                  }
                ]
              }
            ],
            'name': 'Org Admin',
            'id': 'ORG_ADMIN'
          },
          {
            'actionGroups': [
              {
                'name': 'Course Creator',
                'id': 'COURSE_CREATOR',
                'actions': [
                  {}
                ]
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
                'actions': [
                  {}
                ]
              }
            ],
            'name': 'Course Admin',
            'id': 'COURSE_ADMIN'
          },
          {
            'actionGroups': [
              {
                'name': 'Public',
                'id': 'PUBLIC',
                'actions': [
                  {}
                ]
              }
            ],
            'name': 'Public',
            'id': 'PUBLIC'
          },
          {
            'actionGroups': [
              {
                'name': 'Content Creation',
                'id': 'CONTENT_CREATION',
                'actions': [
                  {
                    'urls': [
                      'v1/course/create'
                    ],
                    'name': 'createCourse',
                    'id': 'createCourse'
                  },
                  {
                    'urls': [],
                    'name': 'updateCourse',
                    'id': 'updateCourse'
                  },
                  {
                    'urls': [],
                    'name': 'createContent',
                    'id': 'createContent'
                  },
                  {
                    'urls': [],
                    'name': 'updateContent',
                    'id': 'updateContent'
                  }
                ]
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
                'actions': [
                  {}
                ]
              }
            ],
            'name': 'Flag Reviewer',
            'id': 'FLAG_REVIEWER'
          }
        ]
      }
    },
    rolelist: [
      {
          "name": "Book Creator",
          "id": "BOOK_CREATOR"
      },
      {
          "name": "Membership Management",
          "id": "MEMBERSHIP_MANAGEMENT"
      },
      {
          "name": "Flag Reviewer",
          "id": "FLAG_REVIEWER"
      },
      {
          "name": "Report Viewer",
          "id": "REPORT_VIEWER"
      },
      {
          "name": "Program Manager",
          "id": "PROGRAM_MANAGER"
      },
      {
          "name": "Program Designer",
          "id": "PROGRAM_DESIGNER"
      },
      {
          "name": "System Administration",
          "id": "SYSTEM_ADMINISTRATION"
      },
      {
          "name": "Content Curation",
          "id": "CONTENT_CURATION"
      },
      {
          "name": "Book Reviewer",
          "id": "BOOK_REVIEWER"
      },
      {
          "name": "Content Creator",
          "id": "CONTENT_CREATOR"
      },
      {
          "name": "Org Management",
          "id": "ORG_MANAGEMENT"
      },
      {
          "name": "Course Admin",
          "id": "COURSE_ADMIN"
      },
      {
          "name": "Org Moderator",
          "id": "ORG_MODERATOR"
      },
      {
          "name": "Public",
          "id": "PUBLIC"
      },
      {
          "name": "Admin",
          "id": "ADMIN"
      },
      {
          "name": "Course Mentor",
          "id": "COURSE_MENTOR"
      },
      {
          "name": "Content Reviewer",
          "id": "CONTENT_REVIEWER"
      },
      {
          "name": "Report Admin",
          "id": "REPORT_ADMIN"
      },
      {
          "name": "Org Admin",
          "id": "ORG_ADMIN"
      }
  ],
    roles:[
      'COURSE_MENTOR',
      'CONTENT_CREATOR',
      'COURSE_ADMIN',
      'BOOK_CREATOR',
      'ORG_ADMIN',
      'REPORT_ADMIN',
      'CONTENT_REVIEWER',
      'ADMIN',
      'PUBLIC'
    ],
    RolesAndPermissions:[
      {
        "roleName": "Book Creator",
        "role": "BOOK_CREATOR",
        'actions': [
          {
            'urls': [
              'v1/Book/create'
            ],
            'name': 'Book Creator',
            'id': 'BOOK_CREATOR'
          }
          
        ]
    },
    {
      "roleName": "Book Reviewer",
      "role": "BOOK_REVIEWER",
      'actions': [
        {
          'urls': [
            'v1/Book/review'
          ],
          'name': 'Book Reviewer',
          'id': 'BOOK_REVIEWER'
        }
        
      ]
  },
    {
        "roleName": "Content Creator",
        "role": "CONTENT_CREATOR",
        'actions': [
          {
            'urls': [
              'v1/course/create'
            ],
            'name': 'Course Creator',
            'id': 'CONTENT_CREATOR'
          }
          
        ]
    }
    ],
    WORKSPACEAUTHGARDROLES:[
      {
          "roles":["CONTENT_CREATOR","CONTENT_CREATION","CONTENT_REVIEWER","CONTENT_REVIEW","BOOK_CREATOR"],
          "roleName":"createRole","url":"workspace/content/create","tab":"CREATE"
      },
      {
          "roles":["ORG_ADMIN"],
          "roleName":"alltextbookRole","url":"workspace/content/alltextbooks","tab":"ALLTEXTBOOKS"
      },
      {
          "roles":["CONTENT_CREATOR","CONTENT_CREATION","CONTENT_REVIEWER","CONTENT_REVIEW","BOOK_CREATOR"],
          "roleName":"draftRole","url":"workspace/content/draft/1","tab":"DRAFTS"
      },
      {
          "roles":["CONTENT_CREATOR","CONTENT_CREATION","CONTENT_REVIEWER","CONTENT_REVIEW","BOOK_CREATOR"],
          "roleName":"inreviewRole","url":"/workspace/content/review/1","tab":"Review Submissions"
      },
      {
          "roles":["CONTENT_CREATOR","CONTENT_CREATION","CONTENT_REVIEWER","CONTENT_REVIEW","BOOK_CREATOR"],
          "roleName":"publishedRole","url":"workspace/content/published/1","tab":"PUBLISHED"
      },
      {
          "roles":["CONTENT_CREATOR","CONTENT_CREATION","CONTENT_REVIEWER","CONTENT_REVIEW"],
          "roleName":"alluploadsRole","url":"workspace/content/uploaded/1","tab":"All UPLOADS"
      },
      {
          "roles":["CONTENT_REVIEWER","CONTENT_REVIEW","BOOK_REVIEWER"],
          "roleName":"upForReviewRole","url":"workspace/content/upForReview/1","tab":"Up FOR REVIEW"
      },
      {
          "roles":["COURSE_MENTOR"],"roleName":"courseBatchRoles","url":"/workspace/content/batches/1","tab":"Course Batches"
      },
      {
          "roles":["FLAG_REVIEWER"],
          "roleName":"flagReviewerRole","url":"workspace/content/flagreviewer/1","tab":"FLAG REVIEWER"
      },
      {
          "roles":["FLAG_REVIEWER"],
          "roleName":"flaggedRole","url":"workspace/content/flagged/1","tab":"Flagged"
      },
      {
          "roles":["CONTENT_CREATOR","CONTENT_CREATION","CONTENT_REVIEWER","CONTENT_REVIEW","BOOK_CREATOR"],
          "roleName":"limitedPublishingRole","url":"workspace/content/upForReview/1","tab":"Limited Publishing"
      },
      {
          "roles":["CONTENT_CREATOR","CONTENT_CREATION","CONTENT_REVIEWER","CONTENT_REVIEW","BOOK_CREATOR"],
          "roleName":"collaboratingRole","url":"workspace/content/collaborating-on","tab":"Collaborating On"
      }
     ],
};

