export const enrolledBatch = {
    'id': 'api.course.batch.read', 'ver': 'v1', 'ts': '2018-05-30 03:32:04:000+0000',
    'params': { 'resmsgid': null, 'msgid': '6ed12357-0075-5766-1151-996c48bf714e', 'err': null, 'status': 'success', 'errmsg': null },
    'responseCode': 'OK', 'result': {
      'response': {
        'identifier': '01250836468775321655', 'participant': { 'ac918519-f8b8-4150-bd90-56ead42454d0': true }, 'createdFor': ['ORG_001'],
        'courseAdditionalInfo': {
          'courseName': 'logu-test-may-21', 'leafNodesCount': '3', 'description': 'test',
          'courseLogoUrl': 'https://ekstep-public-4117ad59083b2a_1475430290462.thumb.jpeg',
          'tocUrl': 'https://do_1125083286221291521153toc.json', 'status': 'Live'
        }, 'endDate': '2018-05-28T18:30:00.000Z', 'description': 'cccccc', 'countIncrementDate': '2018-05-21 12:00:02:439+0000',
        'updatedDate': '2018-05-21 12:00:02:439+0000', 'countIncrementStatus': true, 'createdDate': '2018-05-21 10:41:09:529+0000',
        'createdBy': '6d4da241-a31b-4041-bbdb-dd3a898b3f85', 'courseCreator': '6d4da241-a31b-4041-bbdb-dd3a898b3f85',
        'hashTagId': '01250836468775321655', 'mentors': [], 'name': 'fffff', 'countDecrementStatus': false, 'id': '01250836468775321655',
        'enrollmentType': 'open', 'courseId': 'do_1125083286221291521153', 'startDate': '2018-05-21T10:40:43.781Z', 'status': 1
      }
    }
  };

  export const enrolledBatchWithCertificate = {
    'id': 'api.course.batch.read', 'ver': 'v1', 'ts': '2018-05-30 03:32:04:000+0000',
    'params': { 'resmsgid': null, 'msgid': '6ed12357-0075-5766-1151-996c48bf714e', 'err': null, 'status': 'success', 'errmsg': null },
    'responseCode': 'OK', 'result': {
      'response': {
        'cert_templates': {'template_22': {'description' : 'This course certificate is only for Rajasthan users scoring 80% or above'}},
        'identifier': '01250836468775321655', 'participant': { 'ac918519-f8b8-4150-bd90-56ead42454d0': true }, 'createdFor': ['ORG_001'],
        'courseAdditionalInfo': {
          'courseName': 'logu-test-may-21', 'leafNodesCount': '3', 'description': 'test',
          'courseLogoUrl': 'https://ekstep-public-4117ad59083b2a_1475430290462.thumb.jpeg',
          'tocUrl': 'https://do_1125083286221291521153toc.json', 'status': 'Live'
        }, 'endDate': '2018-05-28T18:30:00.000Z', 'description': 'cccccc', 'countIncrementDate': '2018-05-21 12:00:02:439+0000',
        'updatedDate': '2018-05-21 12:00:02:439+0000', 'countIncrementStatus': true, 'createdDate': '2018-05-21 10:41:09:529+0000',
        'createdBy': '6d4da241-a31b-4041-bbdb-dd3a898b3f85', 'courseCreator': '6d4da241-a31b-4041-bbdb-dd3a898b3f85',
        'hashTagId': '01250836468775321655', 'mentors': [], 'name': 'fffff', 'countDecrementStatus': false, 'id': '01250836468775321655',
        'enrollmentType': 'open', 'courseId': 'do_1125083286221291521153', 'startDate': '2018-05-21T10:40:43.781Z', 'status': 1
      }
    }
  };
export  const allBatchDetails = {
    'id': 'api.course.batch.search', 'ver': 'v1', 'ts': '2018-05-30 04:02:30:798+0000',
    'params': {
      'resmsgid': null, 'msgid': '389dd8c0-bb69-bbaf-778a-eedde7994e25', 'err': null,
      'status': 'success', 'errmsg': null
    }, 'responseCode': 'OK', 'result': {
      'response': {
        'count': 2,
        'content': [{
          'identifier': '01248661735846707228', 'createdFor': ['0123673542904299520', '0123673689120112640',
            'ORG_001'], 'courseAdditionalInfo': {
              'courseName': '29 course', 'leafNodesCount': '1',
              'description': '', 'courseLogoUrl': 'https://ekstep-public-de32cd7cb5d03e_1475774424986.thumb.jpeg',
              'tocUrl': 'https://ekstep-public-deact/do_112470675618004992181toc.json', 'status': 'Live'
            },
          'endDate': '2018-07-13', 'description': 'test', 'countIncrementDate': '2018-04-20 20:00:01:531+0000',
          'countDecrementDate': null, 'updatedDate': '2018-04-20 20:00:01:531+0000',
          'participant': { 'ac918519-f8b8-4150-bd90-56ead42454d0': true }, 'countIncrementStatus': true,
          'createdDate': '2018-04-20 17:16:42:032+0000', 'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
          'courseCreator': '874ed8a5-782e-4f6c-8f36-e0288455901e', 'hashTagId': '01248661735846707228',
          'mentors': [], 'name': 'Test 2 batch', 'countDecrementStatus': false, 'id': '01248661735846707228',
          'enrollmentType': 'invite-only', 'courseId': 'do_112470675618004992181', 'startDate': '2018-04-20',
          'status': 1
        }, {
          'identifier': '01248661388792627227', 'createdFor': ['0123673542904299520', '0123673689120112640', 'ORG_001'],
          'courseAdditionalInfo': {
            'courseName': '29 course', 'leafNodesCount': '1', 'description': '',
            'courseLogoUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/e_1475774424986.thumb.jpeg',
            'tocUrl': 'https://ekstep-public-dev/artifact/do_112470675618004992181toc.json', 'status': 'Live'
          },
          'endDate': '2018-05-12', 'description': 'test', 'countIncrementDate': '2018-04-20 20:00:01:286+0000',
          'countDecrementDate': null, 'updatedDate': '2018-04-20', 'participant': { 'ac918519-f8b8-4150-bd90-56ead42454d0': true },
          'countIncrementStatus': true, 'createdDate': '2018-04-20 17:14:08:271+0000', 'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
          'courseCreator': '874ed8a5-782e-4f6c-8f36-e0288455901e', 'hashTagId': '01248661388792627227', 'mentors': [], 'name': 'Test batch',
          'countDecrementStatus': false, 'id': '01248661388792627227', 'enrollmentType': 'invite-only',
          'courseId': 'do_112470675618004992181', 'startDate': '2018-04-20', 'status': 1
        }]
      }
    }
  };
export const userSearch = {
    'id': 'api.user.search',
    'ver': 'v1',
    'ts': '2018-05-30 04:02:31:099+0000',
    'params': {
      'resmsgid': null,
      'msgid': '86688b26-d8de-4009-9de3-ce1e4bb0fee2',
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
            'lastName': 'Pandith',
            'webPages': [
              {
                'type': 'fb',
                'url': 'https://www.facebook.com/kk'
              },
              {
                'type': 'twitter',
                'url': 'https://www.twitter.com/vaishnavi'
              },
              {
                'type': 'in',
                'url': 'https://www.linkedin.com/in/harish'
              },
              {
                'type': 'blog',
                'url': 'https://staging.open-sunbird.org/private'
              }
            ],
            'tcStatus': null,
            'education': [
              {
                'updatedBy': null,
                'yearOfPassing': 2012,
                'degree': 'lrkejklrjlk',
                'updatedDate': null,
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'addressId': null,
                'duration': null,
                'courseName': null,
                'createdDate': '2018-05-24 12:33:16:520+0000',
                'isDeleted': null,
                'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'boardOrUniversity': 'asdas',
                'grade': 'asdas',
                'percentage': 0,
                'name': 'asdasd',
                'id': '01251053933230489617'
              }
            ],
            'gender': 'Male',
            'subject': [
              'Environmental Studies',
              'Chemistry',
              'Economics',
              'English',
              'Biology'
            ],
            'roles': [
              'PUBLIC',
              'BOOK_CREATOR',
              'COURSE_MENTOR',
              'FLAG_REVIEWER',
              'CONTENT_CREATOR',
              'TEACHER_BADGE_ISSUER'
            ],
            'channel': null,
            'language': [
              'English',
              'Kannada',
              'Gujarati',
              'Hindi',
              'Marathi'
            ],
            'updatedDate': '2018-05-29 05:47:46:617+0000',
            'skills': [
              {
                'skillName': 'fsdf',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  },
                  {
                    'endorseDate': '2018-05-15',
                    'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69'
                  },
                  {
                    'endorseDate': '2018-05-16',
                    'userId': '97255811-5486-4f01-bad1-36138d0f5b8a'
                  },
                  {
                    'endorseDate': '2018-05-16',
                    'userId': '63b0870c-f370-4f96-842d-f6a7fa2db1df'
                  },
                  {
                    'endorseDate': '2018-05-21',
                    'userId': 'b2479136-8608-41c0-b3b1-283f38c338ed'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 4,
                'id': '1f4146f9e6397bfe60ba737b65edbe230cfb03795c94c7f2d7e8f3ab428eea76',
                'skillNameToLowercase': 'fsdf',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'akka',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  },
                  {
                    'endorseDate': '2018-05-15',
                    'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 1,
                'id': '08583338c64c11f0a1b019121e9ccb41515eacec9a7ba29d597d454fefe023cd',
                'skillNameToLowercase': 'akka',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'kafka',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  },
                  {
                    'endorseDate': '2018-05-16',
                    'userId': '97255811-5486-4f01-bad1-36138d0f5b8a'
                  },
                  {
                    'endorseDate': '2018-05-23',
                    'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 2,
                'id': '8b1b5581fb953629ae10618e69c8da0024bca572497e38966c0e5995783f5f8e',
                'skillNameToLowercase': 'kafka',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'asllfhsal',
                'addedAt': '2017-12-22',
                'endorsersList': [
                  {
                    'endorseDate': '2017-12-22',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  },
                  {
                    'endorseDate': '2018-05-23',
                    'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 1,
                'id': '7b6f24f8c6dec58164ea925fb651b174f8f27172918322cd9bfa946b19cfca77',
                'skillNameToLowercase': 'asllfhsal',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'asfajsfh',
                'addedAt': '2017-12-22',
                'endorsersList': [
                  {
                    'endorseDate': '2017-12-22',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': 'ad13fd78a449af835396cf928aeb3d022e0efcd872eb24fc28838a2b76381480',
                'skillNameToLowercase': 'asfajsfh',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'sdf',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '30b3bd8408cd1e967939dde52cc5126a8b246b2e2da0d31eabfba079cecd329a',
                'skillNameToLowercase': 'sdf',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'angular',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '5035d2cb030e852b3efc3e424d5cea0064cbc560e8bc476706e998e96e00a826',
                'skillNameToLowercase': 'angular',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'asflashf',
                'addedAt': '2017-12-22',
                'endorsersList': [
                  {
                    'endorseDate': '2017-12-22',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '9faf91d6013d03aea4857fb53036390f5801cfbb352837e52ba7e8fac808c02a',
                'skillNameToLowercase': 'asflashf',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'sdfs',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '5261d1d1d001c2bd4e0ae6873d634a3ac849f67490c377cb41f789f435e732f4',
                'skillNameToLowercase': 'sdfs',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'jfjfjffffffffffffff',
                'addedAt': '2018-04-02',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-02',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': 'a428caa80617e02ee4fd8f7ac71f8f7df199eb22b6645ce8d62508f3e114c427',
                'skillNameToLowercase': 'jfjfjffffffffffffff',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'afjalskf',
                'addedAt': '2017-12-22',
                'endorsersList': [
                  {
                    'endorseDate': '2017-12-22',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '4b86db3b9a9e4b7678280e01e092f24cbce702f13740e71358e59beeec7c92f1',
                'skillNameToLowercase': 'afjalskf',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'sdfsdf',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '9511cf61e3df23f8ea76005fdf6c774ff4753c3398a4cbc2dd130a05d50aae92',
                'skillNameToLowercase': 'sdfsdf',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'xxczc',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': 'adc2129d5a11590ebea24ba8f0d71d67f407d853b54adcf5f0e61adff631c980',
                'skillNameToLowercase': 'xxczc',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'dbbvvb',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '19df25411639da0c09c73cf5ab1748089a0fcd46fbbef87b8f8f72c9f3f3ae21',
                'skillNameToLowercase': 'dbbvvb',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'as',
                'addedAt': '2017-12-22',
                'endorsersList': [
                  {
                    'endorseDate': '2017-12-22',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '31b1bc68f2f7b4e4c4c6d1f636d06b70072a4bb2a69235fcb27fd7e9f1dae184',
                'skillNameToLowercase': 'as',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'dsdsa',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '8cfbffac1c1044b41961019fb7eb5e25f6347315a60809fad73c4e7a426fcdc6',
                'skillNameToLowercase': 'dsdsa',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'apis design',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '505160e896fc859c888ee2343a61c32aad9eaca391d8dbbb2f40fac8f6fb8853',
                'skillNameToLowercase': 'apis design',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'java',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': '632788cdf7cf05b94f93acc601af6a3f2817d79bb78f1e2338492812ea4c7db7',
                'skillNameToLowercase': 'java',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'bnn',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 0,
                'id': 'd4ea88d0c3914737fd3f217fd585813969c04f92f2de3ca4e10848aff82ec085',
                'skillNameToLowercase': 'bnn',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'test',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  },
                  {
                    'endorseDate': '2018-05-23',
                    'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 1,
                'id': 'a29ffe2bb001fa6233773931ffe012bcf6b93b47ce6bb9515290f8f267669517',
                'skillNameToLowercase': 'test',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              },
              {
                'skillName': 'big',
                'addedAt': '2018-04-14',
                'endorsersList': [
                  {
                    'endorseDate': '2018-04-14',
                    'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
                  },
                  {
                    'endorseDate': '2018-05-23',
                    'userId': '3b34c469-460b-4c20-8756-c5fce2de9e69'
                  }
                ],
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'endorsementcount': 1,
                'id': '2e186656f29cf3ab894389c1ec16f1fd55bedd914574fa9083c6bba0195b5e70',
                'skillNameToLowercase': 'big',
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c'
              }
            ],
            'badgeAssertions': [],
            'isDeleted': null,
            'organisations': [
              {
                'organisationId': '0123673542904299520',
                'updatedBy': null,
                'addedByName': 'I4Z7pa6g5C7f6Wn4zJhMn9poWCJz80IxYcwhIoOcIBWQgj2SZmWT6a+wzaAmCWueMEdPmZuRg==',
                'addedBy': '16517913-ae66-4b78-be8a-325da74e561c',
                'roles': [
                  'PUBLIC',
                  'CONTENT_CREATOR',
                  'TEACHER_BADGE_ISSUER',
                  'COURSE_MENTOR',
                  'BOOK_CREATOR'
                ],
                'approvedBy': null,
                'updatedDate': null,
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'approvaldate': null,
                'isDeleted': false,
                'isRejected': false,
                'id': '0123673629008527360',
                'position': null,
                'isApproved': false,
                'orgjoindate': '2017-11-03 05:32:47:795+0000',
                'orgLeftDate': null
              },
              {
                'organisationId': '0123673689120112640',
                'updatedBy': null,
                'addedByName': 'bD+oZDoya/tnM46j7Mxt3tjrSP0zYFDk88XNaBLgXAjO6rZITNk3DT6a+wzaAmCWueMEdPmZuRg==',
                'addedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'roles': [
                  'PUBLIC',
                ],
                'approvedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'updatedDate': null,
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'approvaldate': '2017-11-03 05:42:02:541+0000',
                'isDeleted': false,
                'isRejected': false,
                'id': '0123673696439746562',
                'position': null,
                'isApproved': true,
                'orgjoindate': '2017-11-03 05:42:02:540+0000',
                'orgLeftDate': null
              }
            ],
            'countryCode': null,
            'id': '159e93d1-da0c-4231-be94-e75b0c226d7c',
            'tempPassword': null,
            'email': 'su************@gmail.com',
            'phoneverified': null,
            'identifier': '159e93d1-da0c-4231-be94-e75b0c226d7c',
            'thumbnail': null,
            'updatedBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
            'address': [
              {
                'country': null,
                'updatedBy': null,
                'city': 'aaaa',
                'updatedDate': null,
                'userId': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'zipcode': null,
                'addType': 'permanent',
                'createdDate': '2018-05-25 10:19:53:908+0000',
                'isDeleted': null,
                'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
                'addressLine1': 'aaaa',
                'addressLine2': null,
                'id': '01251118557804953650',
                'state': null
              }
            ],
            'jobProfile': [],
            'profileSummary': '',
            'tcUpdatedDate': null,
            'avatar': 'https://sunbirddev.blob.core.windows.net/user/159e93d1-da0c-4231-be94-e75b0c226d7c/File-01251117043891404837.png',
            'rootOrgId': 'ORG_001',
            'emailVerified': null,
            'firstName': 'Sunil',
            'lastLoginTime': null,
            'createdDate': '2017-11-03 05:28:41:536+0000',
            'createdBy': '',
            'phone': '******7878',
            'dob': '1982-01-01',
            'grade': [
              'Grade 3',
              'Grade 5',
              'Grade 2',
              'Grade 1',
              'Grade 4'
            ],
            'currentLoginTime': null,
            'location': 'Bangalore',
            'status': 1
          }
        ]
      }
    }
  };
