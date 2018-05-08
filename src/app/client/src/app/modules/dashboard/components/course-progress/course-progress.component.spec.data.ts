export const mockUserData = {
  frombeginng: {
  'id': 'api.dashboard.progress.course',
  'ver': 'v1',
  'ts': '2018-04-30 06:49:04:929+0000',
  'params': {
     'resmsgid': null,
     'msgid': '19d7d645-7464-3292-425e-332ee47f97b8',
     'err': null,
     'status': 'success',
     'errmsg': null
  },
  'responseCode': 'OK',
  'result': {
     'period': 'fromBegining',
     'series': {
        'course.progress.users_enrolled.count': {
           'name': 'List of users enrolled for the course',
           'split': 'content.sum(time_spent)',
           'buckets': [
              {
                 'userName': 'usernov17',
                 'user': 'ac918519-f8b8-4150-bd90-56ead42454d0'
              }
           ]
        },
        'course.progress.course_progress_per_user.count': {
           'name': 'List of users enrolled for the course',
           'split': 'content.sum(time_spent)',
           'buckets': [
              {
                 'enrolledOn': '2018-04-20 17:14:32:655+0000',
                 'lastAccessTime': null,
                 'org': null,
                 'progress': 0,
                 'batchEndsOn': '2018-05-12',
                 'userName': 'usernov17',
                 'user': 'ac918519-f8b8-4150-bd90-56ead42454d0'
              }
           ]
        }
     }
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
      'description': 'Sunbird',
      'updatedDate': '2017-08-24 06:02:10:846+0000',
      'addressId': null,
      'orgType': null,
      'provider': null,
      'orgCode': 'sunbird',
      'theme': null,
      'id': 'ORG_001',
      'communityId': null,
      'isApproved': null,
      'slug': 'sunbird',
      'identifier': 'ORG_001',
      'thumbnail': null,
      'orgName': 'Sunbird',
      'updatedBy': 'user1',
      'externalId': null,
      'isRootOrg': true,
      'rootOrgId': null,
      'approvedDate': null,
      'imgUrl': null,
      'homeUrl': null,
      'isDefault': null,
      'contactDetail':
          '[{\'phone\':\'213124234234\',\'email\':\'test@test.com\'},{\'phone\':\'+91213124234234\',\'email\':\'test1@test.com\'}]',
      'createdDate': null,
      'createdBy': null,
      'parentOrgId': null,
      'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d',
      'noOfMembers': 1,
      'status': null
  },
  'identifier': '874ed8a5-782e-4f6c-8f36-e0288455901e',
  'profileSummary': 'asdd',
  'tcUpdatedDate': null,
  'avatar': 'https://sunbirddev.blob.core.windows.net/user/874ed8a5-782e-4f6c-8f36-e0288455901e/File-01242833565242982418.png',
  'userName': 'ntptest102',
  'rootOrgId': 'ORG_001',
  'userId': '874ed8a5-782e-4f6c-8f36-e0288455901e',
  'emailVerified': null,
  'firstName': 'Cretation',
  'lastLoginTime': 1519809987692,
  'createdDate': '2017-10-31 10:47:04:723+0000',
  'createdBy': '5d7eb482-c2b8-4432-bf38-cc58f3c23b45'
},
dashboardError: {
  error: {
      'id': 'api.dashboard.progress.coursex', 'ver': '1.0', 'ts': '2018-02-26 09:22:46:452+0000',
      'params': {
          'resmsgid': '9b3bef40-1ad6-11e8-98b8-5deaf514b022', 'msgid': null, 'status': 'failed', 'err': '',
          'errmsg': 'Timeperiod is invalid'
      }, 'responseCode': 'CLIENT_ERROR', 'result': {}
  }
},
getBatchRes :
  {
      'id': 'api.course.batch.search',
      'ver': 'v1',
      'ts': '2018-04-30 09:28:35:176+0000',
      'params': {
         'resmsgid': null,
         'msgid': 'a240648f-5008-473f-857b-b20a74421c34',
         'err': null,
         'status': 'success',
         'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
         'response': {
            'count': 2,
            'content': [
               {
                  'identifier': '01248661735846707228',
                  'createdFor': [
                     '0123673542904299520',
                     '0123673689120112640',
                     'ORG_001'
                  ],
                  'courseAdditionalInfo': {
                     'courseName': '29 course',
                     'leafNodesCount': '1',
                     'description': '',
                     'courseLogoUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content
                     /do_112470675618004992181/artifact/1ef4769e36c4d18cfd9832cd7cb5d03e_1475774424986.thumb.jpeg`,
                     'tocUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/
                     do_112470675618004992181/artifact/do_112470675618004992181toc.json`,
                     'status': 'Live'
                  },
                  'endDate': '2018-07-13',
                  'description': 'test',
                  'countIncrementDate': '2018-04-20 20:00:01:531+0000',
                  'countDecrementDate': null,
                  'updatedDate': '2018-04-20 20:00:01:531+0000',
                  'participant': {
                     'ac918519-f8b8-4150-bd90-56ead42454d0': true
                  },
                  'countIncrementStatus': true,
                  'createdDate': '2018-04-20 17:16:42:032+0000',
                  'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                  'courseCreator': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                  'hashTagId': '01248661735846707228',
                  'mentors': [

                  ],
                  'name': 'Test 2 batch',
                  'countDecrementStatus': false,
                  'id': '01248661735846707228',
                  'enrollmentType': 'invite-only',
                  'courseId': 'do_112470675618004992181',
                  'startDate': '2018-04-20',
                  'status': 1
               },
               {
                  'identifier': '01248661388792627227',
                  'createdFor': [
                     '0123673542904299520',
                     '0123673689120112640',
                     'ORG_001'
                  ],
                  'courseAdditionalInfo': {
                     'courseName': '29 course',
                     'leafNodesCount': '1',
                     'description': '',
                     'courseLogoUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/
                     do_112470675618004992181/artifact/1ef4769e36c4d18cfd9832cd7cb5d03e_1475774424986.thumb.jpeg`,
                     'tocUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/
                     do_112470675618004992181/artifact/do_112470675618004992181toc.json`,
                     'status': 'Live'
                  },
                  'endDate': '2018-05-12',
                  'description': 'test',
                  'countIncrementDate': '2018-04-20 20:00:01:286+0000',
                  'countDecrementDate': null,
                  'updatedDate': '2018-04-20 20:00:01:286+0000',
                  'participant': {
                     'ac918519-f8b8-4150-bd90-56ead42454d0': true
                  },
                  'countIncrementStatus': true,
                  'createdDate': '2018-04-20 17:14:08:271+0000',
                  'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                  'courseCreator': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                  'hashTagId': '01248661388792627227',
                  'mentors': [

                  ],
                  'name': 'Test batch',
                  'countDecrementStatus': false,
                  'id': '01248661388792627227',
                  'enrollmentType': 'invite-only',
                  'courseId': 'do_112470675618004992181',
                  'startDate': '2018-04-20',
                  'status': 1
               }
            ]
         }
      }
   },
  getBatchResZero :
      {
      'id': 'api.course.batch.search',
      'ver': 'v1',
      'ts': '2018-04-30 09:28:35:176+0000',
      'params': {
         'resmsgid': null,
         'msgid': 'a240648f-5008-473f-857b-b20a74421c34',
         'err': null,
         'status': 'success',
         'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
         'response': {
            'count': 0,
            'content': []
         }
      }
   },
   getBatchResOne :
   {
      'id': 'api.course.batch.search',
      'ver': 'v1',
      'ts': '2018-04-30 09:28:35:176+0000',
      'params': {
         'resmsgid': null,
         'msgid': 'a240648f-5008-473f-857b-b20a74421c34',
         'err': null,
         'status': 'success',
         'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
         'response': {
            'count': 1,
            'content': [{
              'identifier': '01248661735846707228',
              'createdFor': [
                 '0123673542904299520',
                 '0123673689120112640',
                 'ORG_001'
              ],
              'courseAdditionalInfo': {
                 'courseName': '29 course',
                 'leafNodesCount': '1',
                 'description': '',
                 'courseLogoUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content
                 /do_112470675618004992181/artifact/1ef4769e36c4d18cfd9832cd7cb5d03e_1475774424986.thumb.jpeg`,
                 'tocUrl': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/
                 do_112470675618004992181/artifact/do_112470675618004992181toc.json`,
                 'status': 'Live'
              },
              'endDate': '2018-07-13',
              'description': 'test',
              'countIncrementDate': '2018-04-20 20:00:01:531+0000',
              'countDecrementDate': null,
              'updatedDate': '2018-04-20 20:00:01:531+0000',
              'participant': {
                 'ac918519-f8b8-4150-bd90-56ead42454d0': true
              },
              'countIncrementStatus': true,
              'createdDate': '2018-04-20 17:16:42:032+0000',
              'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
              'courseCreator': '874ed8a5-782e-4f6c-8f36-e0288455901e',
              'hashTagId': '01248661735846707228',
              'mentors': [

              ],
              'name': 'Test 2 batch',
              'countDecrementStatus': false,
              'id': '01248661735846707228',
              'enrollmentType': 'invite-only',
              'courseId': 'do_112470675618004992181',
              'startDate': '2018-04-20',
              'status': 1
           }]
         }
      }
   },

populateCourseDashboardDataRes: {
  'id': 'api.dashboard.progress.course',
  'ver': 'v1',
  'ts': '2018-04-30 10:55:57:684+0000',
  'params':  {
     'resmsgid': null,
     'msgid': '22c05a4c-5ffc-22f4-434d-c7f0c7f1cd5c',
     'err': null,
     'status': 'success',
     'errmsg': null
  },
  'responseCode': 'OK',
  'result':  {
     'period': 'fromBegining',
     'series':  {
        'course.progress.users_enrolled.count':  {
           'name': 'List of users enrolled for the course',
           'split': 'content.sum(time_spent)',
           'buckets': [
              {
                 'userName': 'usernov17',
                 'user': 'ac918519-f8b8-4150-bd90-56ead42454d0'
              }
           ]
        },
        'course.progress.course_progress_per_user.count':  {
           'name': 'List of users enrolled for the course',
           'split': 'content.sum(time_spent)',
           'buckets': [
              {
                 'enrolledOn': '2018-04-20 17:16:42:404+0000',
                 'lastAccessTime': null,
                 'org': null,
                 'progress': 0,
                 'batchEndsOn': '2018-07-13',
                 'userName': 'usernov17',
                 'user': 'ac918519-f8b8-4150-bd90-56ead42454d0'
              }
           ]
        }
     }
  }
}

};
