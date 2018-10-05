export const Response = {
    collectionData: {
    'id': 'api.content.read',
    'ver': '1.0',
    'ts': '2018-06-13T13:17:40.031Z',
    'params': {
      'resmsgid': '25dcacf0-6f0c-11e8-8ab5-d3aR0c85aab3a',
      'msgid': '25d6b980-6f0c-11e8-a2ba-e1b2012d0735',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'content': {
        'code': 'Test_QA',
        'keywords': [
          'QA_Content'
        ],
        'methods': [],
        'description': 'Test_QA',
        'language': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.ecml-archive',
        'createdOn': '2017-03-10T09:22:12.728+0000',
        'gradeLevel': [
          'Grade 1'
        ],
        'collections': [
          {
            'identifier': 'do_112199033074647040125',
            'name': 'TextBook3-CollectionParentLive',
            'objectType': 'Content',
            'relation': 'hasSequenceMember',
            'description': 'Books for learning about colours, animals, fruits, vegetables, shapes',
            'index': null,
            'status': null,
            'depth': null,
            'mimeType': null,
            'visibility': null,
            'compatibilityLevel': null
          },
          {
            'identifier': 'do_112199017862299648121',
            'name': 'TextBook3-CollectionParentLive',
            'objectType': 'Content',
            'relation': 'hasSequenceMember',
            'description': 'Books for learning about colours, animals, fruits, vegetables, shapes',
            'index': null,
            'status': null,
            'depth': null,
            'mimeType': null,
            'visibility': null,
            'compatibilityLevel': null
          }
        ],
        'children': [],
        'usesContent': [],
        'artifactUrl': 'https://ekstep-public-dev./artifact/uploadcontent_1489137771342.zip',
        'lastUpdatedOn': '2017-05-24T17:32:39.568+0000',
        'contentType': 'Story',
        'item_sets': [],
        'identifier': 'do_112199016306507776117',
        'audience': [
          'Learner'
        ],
        'visibility': 'Default',
        'libraries': [],
        'mediaType': 'content',
        'osId': 'org.ekstep.quiz.app',
        'ageGroup': [
          '5-6'
        ],
        'languageCode': 'en',
        'versionKey': '1496989757647',
        'tags': [
          'QA_Content'
        ],
        'concepts': [],
        'name': 'Content2EcmlStory',
        'status': 'Live'
      }
    }
  },
createBatch: {
    'id': 'api.course.batch.create',
    'ver': 'v1',
    'ts': '2018-09-26 23:39:58:706+0000',
    'params': {
      'resmsgid': null,
      'msgid': '64f7dff5-6601-0508-1626-07c9737c5cb0',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
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
        'courseLogoUrl': 'https://e_112470675618004992181/artifact/1ef4769e36c4d18cfd9832cd7cb5d03e_1475774424986.thumb.jpeg',
        'tocUrl': 'https://ekstep-pub112470675618004992181/artifact/do_112470675618004992181toc.json',
        'status': 'Live'
      },
      'endDate': '2018-07-13T18:29:59.999Z',
      'description': 'test',
      'countIncrementDate': '2018-04-20 20:00:01:531+0000',
      'countDecrementDate': null,
      'updatedDate': '2018-04-20 20:00:01:531+0000',
      'participant': {
        'ac918519-f8b8-4150-bd90-56ead42454d0': true,
        '27d5a117-e1a1-4202-8476-6be21fd76a5c': true
      },
      'countIncrementStatus': true,
      'createdDate': '2018-04-20 17:16:42:032+0000',
      'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
      'courseCreator': '874ed8a5-782e-4f6c-8f36-e0288455901e',
      'hashTagId': '01248661735846707228',
      'mentors': [
        'b2479136-8608-41c0-b3b1-283f38c338ed',
        '15dedad5-1332-4618-824f-63d859a662fd',
        '9d76c081-fbf6-45e0-adb7-64013fe41a64',
        '6d4da241-a31b-4041-bbdb-dd3a898b3f85',
        '874ed8a5-782e-4f6c-8f36-e0288455901e',
        '80736bb1-9c64-488f-9902-d6fbfcd3e7ed',
        '97255811-5486-4f01-bad1-36138d0f5b8a'
      ],
      'name': 'Test 2 batch',
      'countDecrementStatus': false,
      'id': '01248661735846707228',
      'enrollmentType': 'invite-only',
      'courseId': 'do_112470675618004992181',
      'startDate': '2018-04-20T18:29:59.999Z',
      'status': 1
  }
  },
  getBatchDetails: {
    'id': 'api.course.batch.read',
    'ver': 'v1',
    'ts': '2018-09-26 23:54:48:547+0000',
    'params': {
      'resmsgid': null,
      'msgid': '5314b59a-d2c1-f90f-fdb8-fa9c0db30cc5',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'identifier': '01259879952143155267',
        'createdFor': [
          '01232004891662745660',
          '01232002070124134414',
          '012315809814749184151'
        ],
        'courseAdditionalInfo': {
          'courseName': 'Testing with 60 charsTesting with 60 charsTesting with 60 chars characters',
          'leafNodesCount': '1',
          'description': 'Testing to see if this breaks',
          'courseLogoUrl': 'https://ekstep-public-qa.s3-ap49/artifact/course_icon_1_1505730143591.thumb.png',
          'tocUrl': 'https://ekstep-public-qa.s3-ap-south-152009216001249/artifact/do_2123567152009216001249toc.json',
          'status': 'Live'
        },
        'endDate': '2018-10-10',
        'description': '',
        'countIncrementStatus': false,
        'createdDate': '2018-09-26 05:18:44:358+0000',
        'createdBy': '659b011a-06ec-4107-84ad-955e16b0a48a',
        'courseCreator': 'd4dbcab1-4f99-4edc-8dc6-a8f66149cfbe',
        'hashTagId': '01259879952143155267',
        'mentors': [
          'd882967f-b3e1-456b-b984-d800470837ab'
        ],
        'name': 'new tests',
        'countDecrementStatus': false,
        'id': '01259879952143155267',
        'enrollmentType': 'invite-only',
        'courseId': 'do_2123567152009216001249',
        'startDate': '2018-09-26',
        'status': 1
      }
    }
  },
  update: {
    'id': 'api.course.batch.update',
    'ver': 'v1',
    'ts': '2018-09-26 23:57:32:732+0000',
    'params': {
      'resmsgid': null,
      'msgid': '1ebf6500-5290-056e-cf4c-590150122a12',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': 'SUCCESS'
    }
  }
};
