
export const CourseHierarchyGetMockResponse = {
  'id': 'ekstep.learning.content.hierarchy',
  'ver': '2.0',
  'ts': '2018-05-07T07:20:27ZZ',
  'params': {
    'resmsgid': '0ea98baa-5a9e-49fd-a568-7967bc1e0ab8',
    'msgid': null,
    'err': null,
    'status': 'successful',
    'errmsg': null
  },
  'result': {
    'content': {
      'identifier': 'do_212347136096788480178'
    }
  }
};

export const telemetryInteractMockData = {
  'context': {
    'env': 'explore-course',
    'cdata': []
  },
  'edata': {
    'id': 'join-training-popup-close',
    'type': 'click',
    'pageid': 'explore-course-toc'
  },
  'object': {
    'id': 'do_212347136096788480178',
    'type': 'Course',
    'ver': '1.0',
    'rollup': {
      'l1': 'do_212347136096788480178'
    }
  }
};

export const coursePlayerMockData = {
  curriculum: [
    {
      'mimeType': 'application/vnd.ekstep.ecml-archive',
      'count': 1
    },
    {
      'mimeType': 'application/vnd.android.package-archive',
      'count': 2
    },
    {
      'mimeType': 'application/vnd.ekstep.html-archive',
      'count': 2
    },
    { mimeType: 'video', count: 1 }
  ],
  courseHierarchy: {
    'copyright': 'Sunbird',
    'lastStatusChangedOn': '2020-05-26T09:40:57.789+0000',
    'originData': {
      'name': 'VSV - Training Course - May 15',
      'copyType': 'deep',
      'license': 'CC BY 4.0',
      'organisation': [
        'CBSE ORG'
      ]
    },
    'c_sunbird_dev_private_batch_count': 0,
    'licenseterms': 'By creating and uploading content on SUNBIRD, you consent to publishing this content under the Creative Commons Framework, specifically under the CC-BY-SA 4.0 license.',
    'organisation': [
      'Sunbird'
    ],
    'children': [
      {
        'ownershipType': [
          'createdBy'
        ],
        'parent': 'do_1130292569979781121111',
        'copyright': 'CBSE ORG',
        'code': 'do_1130292569984860161117',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'language': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'idealScreenSize': 'normal',
        'createdOn': '2020-05-26T09:31:13.448+0000',
        'objectType': 'Content',
        'children': [
          {
            'ownershipType': [
              'createdBy'
            ],
            'copyright': 'Sunbird',
            'previewUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/ecml/do_112974024033230848123-latest',
            'year': '2020',
            'plugins': [
              {
                'identifier': 'org.ekstep.stage',
                'semanticVersion': '1.0'
              },
              {
                'identifier': 'org.ekstep.questionset',
                'semanticVersion': '1.0'
              },
              {
                'identifier': 'org.ekstep.navigation',
                'semanticVersion': '1.0'
              },
              {
                'identifier': 'org.ekstep.questionset.quiz',
                'semanticVersion': '1.0'
              },
              {
                'identifier': 'org.ekstep.iterator',
                'semanticVersion': '1.0'
              },
              {
                'identifier': 'org.ekstep.questionunit',
                'semanticVersion': '1.1'
              },
              {
                'identifier': 'org.ekstep.questionunit.mcq',
                'semanticVersion': '1.3'
              },
              {
                'identifier': 'org.ekstep.questionunit.mtf',
                'semanticVersion': '1.2'
              },
              {
                'identifier': 'org.ekstep.keyboard',
                'semanticVersion': '1.1'
              },
              {
                'identifier': 'org.ekstep.questionunit.ftb',
                'semanticVersion': '1.1'
              },
              {
                'identifier': 'org.ekstep.questionunit.sequence',
                'semanticVersion': '1.1'
              },
              {
                'identifier': 'org.ekstep.questionunit.reorder',
                'semanticVersion': '1.1'
              }
            ],
            'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_112974024033230848123/question-font-fix_1583744142976_do_112974024033230848123_1.0.ecar',
            'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'questions': [
              {
                'identifier': 'do_11294912471196467212',
                'name': 'Test Question',
                'objectType': 'AssessmentItem',
                'relation': 'associatedTo',
                'status': 'Live'
              },
              {
                'identifier': 'do_112692370093793280122',
                'name': 'VSV FTB Solar system related questions',
                'objectType': 'AssessmentItem',
                'relation': 'associatedTo',
                'status': 'Live'
              },
              {
                'identifier': 'do_112692357142544384112',
                'name': 'VSV MTF Match the animals',
                'objectType': 'AssessmentItem',
                'relation': 'associatedTo',
                'description': 'Score = 3',
                'status': 'Live'
              },
              {
                'identifier': 'do_112692374295117824129',
                'name': 'VSV Reorder Form the sentance using below words',
                'objectType': 'AssessmentItem',
                'relation': 'associatedTo',
                'status': 'Live'
              },
              {
                'identifier': 'do_112692371845742592125',
                'name': 'VSV Sequence Order of the planets in the solar system(Order starts from closest to sun)',
                'objectType': 'AssessmentItem',
                'relation': 'associatedTo',
                'status': 'Live'
              }
            ],
            'organisation': [
              'Sunbird'
            ],
            'language': [
              'English'
            ],
            'variants': {
              'spine': {
                'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_112974024033230848123/question-font-fix_1583744143538_do_112974024033230848123_1.0_spine.ecar',
                'size': 8973
              }
            },
            'mimeType': 'application/vnd.ekstep.ecml-archive',
            'editorState': '{"plugin":{"noOfExtPlugins":12,"extPlugins":[{"plugin":"org.ekstep.contenteditorfunctions","version":"1.2"},{"plugin":"org.ekstep.keyboardshortcuts","version":"1.0"},{"plugin":"org.ekstep.richtext","version":"1.0"},{"plugin":"org.ekstep.iterator","version":"1.0"},{"plugin":"org.ekstep.navigation","version":"1.0"},{"plugin":"org.ekstep.reviewercomments","version":"1.0"},{"plugin":"org.ekstep.questionunit.mtf","version":"1.2"},{"plugin":"org.ekstep.questionunit.mcq","version":"1.3"},{"plugin":"org.ekstep.keyboard","version":"1.1"},{"plugin":"org.ekstep.questionunit.reorder","version":"1.1"},{"plugin":"org.ekstep.questionunit.sequence","version":"1.1"},{"plugin":"org.ekstep.questionunit.ftb","version":"1.1"}]},"stage":{"noOfStages":1,"currentStage":"65553c86-68d8-4197-b44c-163a1a9048ea","selectedPluginObject":"44b8b4d6-e4d9-4bc0-8093-65542904063c"},"sidebar":{"selectedMenu":"settings"}}',
            'gradeLevel': [
              'Grade 1'
            ],
            'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112974024033230848123/artifact/31a2q-ellql-removebg-preview_1579859887101.thumb.png',
            'appId': 'dev.sunbird.portal',
            'contentEncoding': 'gzip',
            'artifactUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112974024033230848123/artifact/1583744142367_do_112974024033230848123.zip',
            'lockKey': 'c5e4816c-5fd5-4cab-9c05-7208d5f9bc5d',
            'contentType': 'Resource',
            'lastUpdatedBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
            'identifier': 'do_112974024033230848123',
            'audience': [
              'Learner'
            ],
            'visibility': 'Default',
            'consumerId': 'cf23772b-d1ff-4868-8bc6-8448b7aa25c5',
            'mediaType': 'content',
            'osId': 'org.ekstep.quiz.app',
            'lastPublishedBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
            'version': 2,
            'prevState': 'Review',
            'license': 'CC BY 4.0',
            'size': 1254957,
            'lastPublishedOn': '2020-03-09T08:55:42.967+0000',
            'name': 'Question font fix',
            'status': 'Live',
            'totalQuestions': 5,
            'code': 'org.sunbird.OIzZvI',
            'prevStatus': 'Processing',
            'description': 'Enter description for Resource',
            'streamingUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/ecml/do_112974024033230848123-latest',
            'medium': [
              'Kannada'
            ],
            'posterImage': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112942212192747520120/artifact/31a2q-ellql-removebg-preview_1579859887101.png',
            'idealScreenSize': 'normal',
            'createdOn': '2020-03-09T08:39:28.121+0000',
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-03-09T08:55:28.433+0000',
            'SYS_INTERNAL_LAST_UPDATED_ON': '2020-03-09T08:55:49.253+0000',
            'dialcodeRequired': 'No',
            'creator': 'Mentor First User',
            'createdFor': [
              'ORG_001'
            ],
            'lastStatusChangedOn': '2020-03-09T08:55:49.227+0000',
            'os': [
              'All'
            ],
            'totalScore': 8,
            'pkgVersion': 1,
            'versionKey': '1583744128433',
            'idealScreenDensity': 'hdpi',
            's3Key': 'ecar_files/do_112974024033230848123/question-font-fix_1583744142976_do_112974024033230848123_1.0.ecar',
            'framework': 'NCFCOPY',
            'lastSubmittedOn': '2020-03-09T08:43:06.468+0000',
            'createdBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
            'compatibilityLevel': 2,
            'board': 'CBSE',
            'resourceType': 'Learn',
            'index': 1,
            'depth': 2,
            'parent': 'do_1130292569984860161117'
          },
          {
            'previewUrl': 'https://www.youtube.com/watch?v=56MDJ9tD6MY',
            'keywords': [
              'www',
              'Story',
              'Story'
            ],
            'downloadUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_11234621699931340812/drowings_1507106438614_do_11234621699931340812_1.0.ecar',
            'channel': 'in.ekstep',
            'language': [
              'English'
            ],
            'variants': {
              'spine': {
                'ecarUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_11234621699931340812/drowings_1507106438879_do_11234621699931340812_1.0_spine.ecar',
                'size': 35600
              }
            },
            'source': '',
            'mimeType': 'video/x-youtube',
            'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_11225412537877299214/artifact/fcd673a0374d4a4d40967bf73a10c136_1493297884841.thumb.jpeg',
            'gradeLevel': [
              'Grade 1'
            ],
            'artifactUrl': 'https://www.youtube.com/watch?v=56MDJ9tD6MY',
            'contentEncoding': 'identity',
            'contentType': 'Resource',
            'lastUpdatedBy': '554',
            'identifier': 'do_11234621699931340812',
            'audience': [
              'Learner'
            ],
            'visibility': 'Default',
            'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
            'mediaType': 'content',
            'ageGroup': [
              '5-6'
            ],
            'osId': 'org.ekstep.quiz.app',
            'lastPublishedBy': '554',
            'pragma': [
              'external'
            ],
            'size': 35600,
            'lastPublishedOn': '2017-10-04T08:40:38.614+0000',
            'concepts': [
              {
                'identifier': 'C1',
                'name': 'Develop spatial understanding',
                'objectType': 'Concept',
                'relation': 'associatedTo',
                'description': 'Develop spatial understanding\nApply and develop vocabulary like Top/Bottom; inside/outside; near/far; nearer/farther; nearest/farthest; on/under; above/below; roll/slide',
                'status': 'Live'
              },
              {
                'identifier': 'C3',
                'name': '3D Objects',
                'objectType': 'Concept',
                'relation': 'associatedTo',
                'description': 'Identify, observe, order, draw, describe properties (including physical features, symmtery, weight and volume) compare and make inferences',
                'status': 'Live'
              }
            ],
            'domain': [
              'numeracy'
            ],
            'name': 'drowings',
            'publisher': '',
            'attributions': [
              ''
            ],
            'status': 'Live',
            'template': '',
            'code': 'org.ekstep.numeracy.resource.6753',
            'description': 'sfdfsfddd',
            'streamingUrl': 'https://www.youtube.com/watch?v=56MDJ9tD6MY',
            'idealScreenSize': 'normal',
            'createdOn': '2017-10-04T08:42:47.299+0000',
            'contentDisposition': 'online',
            'lastUpdatedOn': '2017-10-04T08:44:15.579+0000',
            'SYS_INTERNAL_LAST_UPDATED_ON': '2017-10-04T08:40:39.255+0000',
            'owner': 'ssss',
            'creator': 'Samadhan_c',
            'createdFor': [
              'org.ekstep.partner.pratham'
            ],
            'os': [
              'All'
            ],
            'pkgVersion': 1,
            'versionKey': '1507106439255',
            'idealScreenDensity': 'hdpi',
            's3Key': 'ecar_files/do_11234621699931340812/drowings_1507106438614_do_11234621699931340812_1.0.ecar',
            'lastSubmittedOn': '2017-10-04T08:43:07.214+0000',
            'createdBy': '446',
            'compatibilityLevel': 4,
            'organization': [
              'Pratham'
            ],
            'board': 'ICSE',
            'resourceType': [
              'Study material'
            ],
            'index': 2,
            'depth': 2,
            'parent': 'do_1130292569984860161117'
          }
        ],
        'contentDisposition': 'inline',
        'lastUpdatedOn': '2020-05-26T09:40:52.972+0000',
        'contentEncoding': 'gzip',
        'contentType': 'CourseUnit',
        'identifier': 'do_1130292569984860161117',
        'lastStatusChangedOn': '2020-05-26T09:31:13.448+0000',
        'audience': [
          'Learner'
        ],
        'os': [
          'All'
        ],
        'visibility': 'Parent',
        'index': 1,
        'mediaType': 'content',
        'osId': 'org.ekstep.launcher',
        'languageCode': [
          'en'
        ],
        'versionKey': '1590485473448',
        'license': 'CC BY 4.0',
        'idealScreenDensity': 'hdpi',
        'framework': 'cbse-tpd',
        'depth': 1,
        'name': 'Unit 1',
        'topic': [],
        'status': 'Live',
        'compatibilityLevel': 1,
        'lastPublishedOn': '2020-05-26T09:40:53.539+0000',
        'pkgVersion': 1,
        'leafNodesCount': 2,
        'leafNodes': [
          'do_112974024033230848123',
          'do_11234621699931340812'
        ],
        'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar',
        'variants': '{"online":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486057279_do_1130292569979781121111_1.0_online.ecar","size":11025.0},"spine":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar","size":238603.0}}'
      },
      {
        'ownershipType': [
          'createdBy'
        ],
        'parent': 'do_1130292569979781121111',
        'copyright': 'CBSE ORG',
        'code': '950f3ee8-0c49-45e3-b250-c8df4358c97e',
        'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
        'language': [
          'English'
        ],
        'mimeType': 'application/vnd.ekstep.content-collection',
        'idealScreenSize': 'normal',
        'createdOn': '2020-05-26T09:31:13.447+0000',
        'objectType': 'Content',
        'children': [
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_1130292569984778241115',
            'copyright': 'CBSE ORG',
            'code': '3493b5ed-c497-4b24-a696-dba78c921d34',
            'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-05-26T09:31:13.446+0000',
            'objectType': 'Content',
            'children': [
              {
                'keywords': [
                  'tag'
                ],
                'channel': 'in.ekstep',
                'downloadUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_10096170/test-download-game-2wtih-artifact-url1_1498568836226_do_10096170_2.0.ecar',
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/do_10096170/test-download-game-2wtih-artifact-url1_1498568838702_do_10096170_2.0_spine.ecar',
                    'size': 109799
                  }
                },
                'source': '',
                'mimeType': 'application/vnd.android.package-archive',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_10096170/artifact/bumx7okcaaa-top_1458899137840.thumb.jpg',
                'gradeLevel': [
                  'Grade 1'
                ],
                'appId': 'dev.ekstep.in',
                'copyType': 'Enhance',
                'contentEncoding': 'gzip',
                'artifactUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/apk-1452772890290-num-broad-screener-3-dec_1458899225670.apk',
                'contentType': 'Resource',
                'lastUpdatedBy': '309',
                'identifier': 'do_10096170',
                'audience': [
                  'Learner'
                ],
                'visibility': 'Default',
                'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
                'portalOwner': '80',
                'mediaType': 'content',
                'ageGroup': [
                  '5-6'
                ],
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '309',
                'languageCode': 'en',
                'prevState': 'Review',
                'license': 'CC BY 4.0',
                'size': 8958492,
                'lastPublishedOn': '2017-06-27T13:07:16.224+0000',
                'concepts': [
                  {
                    'identifier': 'LO52',
                    'name': 'More Than One Meaning',
                    'objectType': 'Concept',
                    'relation': 'associatedTo',
                    'description': 'More Than One Meaning',
                    'status': 'Live'
                  }
                ],
                'domain': [
                  'literacy'
                ],
                'name': 'test download game 2(wtih artifact url)1',
                'publisher': '',
                'status': 'Live',
                'code': 'org.ekstep.literacy.game.153.fork.fork',
                'origin': 'do_10096169',
                'description': 'Voluptatem in expedita ullam aut veniam, eius delectus, eiusmod quia pariatur? Cupidatat cumque veniam, in in sint, aut non in.',
                'lastFlaggedOn': '2017-03-29T10:16:39.548+0000',
                'posterImage': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/language_assets/BuMX7okCAAA-TOP_1458899137840.jpg',
                'flaggedBy': [
                  '177'
                ],
                'idealScreenSize': 'normal',
                'createdOn': '2016-10-14T12:37:46.437+0000',
                'contentDisposition': 'inline',
                'genre': [
                  'Alphabet Books'
                ],
                'lastUpdatedOn': '2017-05-24T17:30:52.697+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2017-06-27T13:07:20.515+0000',
                'owner': 'EkStep',
                'os': [
                  'All'
                ],
                'pkgVersion': 2,
                'versionKey': '1498568840515',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_10096170/test-download-game-2wtih-artifact-url1_1498568836226_do_10096170_2.0.ecar',
                'lastSubmittedOn': '2016-10-14T13:38:54.468+0000',
                'createdBy': '80',
                'compatibilityLevel': 1,
                'resourceType': [
                  'Activity'
                ],
                'index': 1,
                'depth': 3,
                'parent': 'do_1130292569984696321113'
              },
              {
                'keywords': [
                  'tag'
                ],
                'channel': 'in.ekstep',
                'downloadUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/domain_14185/britanni-sheppard_1495444734339_domain_14185_2.0.ecar',
                'questions': [],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/ecar_files/domain_14185/britanni-sheppard_1495444735643_domain_14185_2.0_spine.ecar',
                    'size': 109547
                  }
                },
                'mimeType': 'application/vnd.android.package-archive',
                'editorState': '{"theme":{"manifest":{"media":[]},"template":[],"controller":[],"startStage":"scene1","id":"theme","ver":0.3},"stages":[{"id":"scene1","events":{"event":[]},"params":[],"audios":[],"objects":[{"type":"i-text","originX":"left","originY":"top","left":100,"top":100,"width":172.77,"height":36.7,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeLineJoin":"miter","strokeMiterLimit":10,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"clipTo":null,"backgroundColor":"","fillRule":"nonzero","globalCompositeOperation":"source-over","transformMatrix":null,"text":"Tap and Type","fontSize":28,"fontWeight":"normal","fontFamily":"helvetica","fontStyle":"","lineHeight":1.16,"textDecoration":"","textAlign":"left","textBackgroundColor":"","styles":{}}]}]}',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/domain_14185/artifact/bumx7okcaaa-top_1458899137840.thumb.jpg',
                'gradeLevel': [
                  'Grade 1'
                ],
                'appId': 'dev.ekstep.in',
                'usesContent': [],
                'contentEncoding': 'gzip',
                'artifactUrl': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/apk-1452772890290-num-broad-screener-3-dec_1458899225670.apk',
                'contentType': 'Resource',
                'lastUpdatedBy': '104',
                'identifier': 'domain_14185',
                'audience': [
                  'Learner'
                ],
                'visibility': 'Default',
                'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
                'portalOwner': 'EkStep',
                'mediaType': 'content',
                'itemSets': [],
                'ageGroup': [
                  '5-6'
                ],
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': '104',
                'license': 'CC BY 4.0',
                'prevState': 'Review',
                'size': 8958242,
                'lastPublishedOn': '2017-05-22T09:18:54.339+0000',
                'concepts': [],
                'name': 'Britanni Sheppard',
                'status': 'Live',
                'code': 'org.ekstep.literacy.game.153',
                'methods': [],
                'description': 'Voluptatem in expedita ullam aut veniam, eius delectus, eiusmod quia pariatur? Cupidatat cumque veniam, in in sint, aut non in.',
                'idealScreenSize': 'normal',
                'posterImage': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/language_assets/BuMX7okCAAA-TOP_1458899137840.jpg',
                'createdOn': '2016-03-25T09:45:36.998+0000',
                'contentDisposition': 'inline',
                'genre': [
                  'Alphabet Books'
                ],
                'lastUpdatedOn': '2017-05-31T11:09:29.825+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2017-06-09T12:41:07.938+0000',
                'owner': 'EkStep',
                'os': [
                  'All'
                ],
                'libraries': [],
                'pkgVersion': 2,
                'versionKey': '1497012067938',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/domain_14185/britanni-sheppard_1495444734339_domain_14185_2.0.ecar',
                'createdBy': 'EkStep',
                'compatibilityLevel': 1,
                'developer': 'EkStep',
                'resourceType': [
                  'Activity'
                ],
                'index': 2,
                'depth': 3,
                'parent': 'do_1130292569984696321113'
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-05-26T09:40:52.972+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_1130292569984696321113',
            'lastStatusChangedOn': '2020-05-26T09:31:13.446+0000',
            'audience': [
              'Learner'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 1,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1590485473446',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'cbse-tpd',
            'depth': 2,
            'name': '2.1',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-05-26T09:40:53.539+0000',
            'pkgVersion': 1,
            'leafNodesCount': 2,
            'leafNodes': [
              'domain_14185',
              'do_10096170'
            ],
            'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486057279_do_1130292569979781121111_1.0_online.ecar","size":11025.0},"spine":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar","size":238603.0}}'
          },
          {
            'ownershipType': [
              'createdBy'
            ],
            'parent': 'do_1130292569984778241115',
            'copyright': 'CBSE ORG',
            'code': 'af4a1743-fb47-4667-8ed0-d28acc9e63e8',
            'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'language': [
              'English'
            ],
            'mimeType': 'application/vnd.ekstep.content-collection',
            'idealScreenSize': 'normal',
            'createdOn': '2020-05-26T09:31:13.449+0000',
            'objectType': 'Content',
            'children': [
              {
                'ownershipType': [
                  'createdBy'
                ],
                'previewUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/html/do_1127922553743687681541-latest',
                'subject': [
                  'Marathi'
                ],
                'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127922553743687681541/focus-spot-common-kids-games_1561554736522_do_1127922553743687681541_1.0.ecar',
                'channel': 'ORG_001',
                'questions': [],
                'organisation': [
                  'Sunbird'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1127922553743687681541/focus-spot-common-kids-games_1561554736815_do_1127922553743687681541_1.0_spine.ecar',
                    'size': 30240
                  }
                },
                'mimeType': 'application/vnd.ekstep.html-archive',
                'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127922553743687681541/artifact/focus-spot_1561379529347.thumb.png',
                'gradeLevel': [
                  'Class 3'
                ],
                'usesContent': [],
                'artifactUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1127922553743687681541/artifact/do_1127922553743687681541_1561554611499.zip',
                'contentEncoding': 'gzip',
                'contentType': 'Resource',
                'identifier': 'do_1127922553743687681541',
                'audience': [
                  'Learner'
                ],
                'visibility': 'Default',
                'author': 'NTP',
                'consumerId': '02bf5216-c947-492f-929b-af2e61ea78cd',
                'mediaType': 'content',
                'itemSets': [],
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': 'Ekstep',
                'version': 1,
                'license': 'CC BY 4.0',
                'prevState': 'Review',
                'lastPublishedOn': '2019-06-26T13:12:16.516+0000',
                'size': 211260,
                'concepts': [],
                'name': 'Focus Spot - Common kids games ',
                'status': 'Live',
                'code': 'notrequired',
                'methods': [],
                'streamingUrl':
                  'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/html/do_1127922553743687681541-latest',
                'medium': [
                  'English'
                ],
                'posterImage': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112790820364165120127/artifact/focus-spot_1561379529347.png',
                'idealScreenSize': 'normal',
                'createdOn': '2019-06-26T13:10:11.128+0000',
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2019-06-26T13:12:16.158+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2019-06-26T13:12:17.376+0000',
                'dialcodeRequired': 'No',
                'creator': 'ntptest102',
                'lastStatusChangedOn': '2019-06-26T13:12:17.368+0000',
                'createdFor': [
                  'ORG_001'
                ],
                'os': [
                  'All'
                ],
                'libraries': [],
                'pkgVersion': 1,
                'versionKey': '1561554736158',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_1127922553743687681541/focus-spot-common-kids-games_1561554736522_do_1127922553743687681541_1.0.ecar',
                'framework': 'NCF',
                'lastSubmittedOn': '2019-06-26T13:10:11.997+0000',
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'compatibilityLevel': 1,
                'board': 'CBSE',
                'resourceType': 'Learn',
                'index': 1,
                'depth': 3,
                'parent': 'do_1130292569984942081119'
              },
              {
                'ownershipType': [
                  'createdBy'
                ],
                'previewUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/html/do_112792043208769536150-latest',
                'subject': [
                  'Marathi'
                ],
                'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_112792043208769536150/focus-spot-nature-around-the-kids_1561528715979_do_112792043208769536150_1.0.ecar',
                'channel': 'ORG_001',
                'questions': [],
                'organisation': [
                  'Sunbird'
                ],
                'language': [
                  'English'
                ],
                'variants': {
                  'spine': {
                    'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_112792043208769536150/focus-spot-nature-around-the-kids_1561528716363_do_112792043208769536150_1.0_spine.ecar',
                    'size': 30289
                  }
                },
                'mimeType': 'application/vnd.ekstep.html-archive',
                'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112792043208769536150/artifact/focus-spot_1561379529347_1561482221397.thumb.png',
                'gradeLevel': [
                  'Class 3'
                ],
                'appId': 'dev.sunbird.portal',
                'usesContent': [],
                'artifactUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112792043208769536150/artifact/do_112792043208769536150_1561528712540.zip',
                'contentEncoding': 'gzip',
                'contentType': 'Resource',
                'identifier': 'do_112792043208769536150',
                'audience': [
                  'Learner'
                ],
                'visibility': 'Default',
                'author': 'NTP',
                'consumerId': '02bf5216-c947-492f-929b-af2e61ea78cd',
                'mediaType': 'content',
                'itemSets': [],
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': 'Ekstep',
                'version': 1,
                'license': 'CC BY 4.0',
                'prevState': 'Review',
                'size': 379212,
                'lastPublishedOn': '2019-06-26T05:58:35.969+0000',
                'concepts': [],
                'name': 'Focus Spot - Nature around the kids',
                'status': 'Live',
                'code': 'notrequired',
                'methods': [],
                'streamingUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/html/do_112792043208769536150-latest',
                'medium': [
                  'English'
                ],
                'posterImage': 'https://preprodall.blob.core.windows.net/ntp-content-preprod/content/do_2127916607075287041536/artifact/focus-spot_1561379529347_1561482221397.png',
                'idealScreenSize': 'normal',
                'createdOn': '2019-06-26T05:58:32.008+0000',
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2019-06-26T05:58:35.722+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2019-06-26T05:58:37.096+0000',
                'dialcodeRequired': 'No',
                'creator': 'ntptest102',
                'lastStatusChangedOn': '2019-06-26T05:58:37.086+0000',
                'createdFor': [
                  'ORG_001'
                ],
                'os': [
                  'All'
                ],
                'libraries': [],
                'pkgVersion': 1,
                'versionKey': '1561528715722',
                'idealScreenDensity': 'hdpi',
                's3Key': 'ecar_files/do_112792043208769536150/focus-spot-nature-around-the-kids_1561528715979_do_112792043208769536150_1.0.ecar',
                'framework': 'NCF',
                'lastSubmittedOn': '2019-06-26T05:58:33.672+0000',
                'createdBy': '874ed8a5-782e-4f6c-8f36-e0288455901e',
                'compatibilityLevel': 1,
                'board': 'CBSE',
                'resourceType': 'Learn',
                'index': 2,
                'depth': 3,
                'parent': 'do_1130292569984942081119'
              }
            ],
            'contentDisposition': 'inline',
            'lastUpdatedOn': '2020-05-26T09:40:52.972+0000',
            'contentEncoding': 'gzip',
            'contentType': 'CourseUnit',
            'identifier': 'do_1130292569984942081119',
            'lastStatusChangedOn': '2020-05-26T09:31:13.449+0000',
            'audience': [
              'Learner'
            ],
            'os': [
              'All'
            ],
            'visibility': 'Parent',
            'index': 2,
            'mediaType': 'content',
            'osId': 'org.ekstep.launcher',
            'languageCode': [
              'en'
            ],
            'versionKey': '1590485473449',
            'license': 'CC BY 4.0',
            'idealScreenDensity': 'hdpi',
            'framework': 'cbse-tpd',
            'depth': 2,
            'name': '2.2',
            'status': 'Live',
            'compatibilityLevel': 1,
            'lastPublishedOn': '2020-05-26T09:40:53.539+0000',
            'pkgVersion': 1,
            'leafNodesCount': 2,
            'leafNodes': [
              'do_112792043208769536150',
              'do_1127922553743687681541'
            ],
            'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar',
            'variants': '{"online":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486057279_do_1130292569979781121111_1.0_online.ecar","size":11025.0},"spine":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar","size":238603.0}}'
          }
        ],
        'contentDisposition': 'inline',
        'lastUpdatedOn': '2020-05-26T09:40:52.972+0000',
        'contentEncoding': 'gzip',
        'contentType': 'CourseUnit',
        'identifier': 'do_1130292569984778241115',
        'lastStatusChangedOn': '2020-05-26T09:31:13.447+0000',
        'audience': [
          'Learner'
        ],
        'os': [
          'All'
        ],
        'visibility': 'Parent',
        'index': 2,
        'mediaType': 'content',
        'osId': 'org.ekstep.launcher',
        'languageCode': [
          'en'
        ],
        'versionKey': '1590485473447',
        'license': 'CC BY 4.0',
        'idealScreenDensity': 'hdpi',
        'framework': 'cbse-tpd',
        'depth': 1,
        'name': 'Unit 2',
        'status': 'Live',
        'compatibilityLevel': 1,
        'lastPublishedOn': '2020-05-26T09:40:53.539+0000',
        'pkgVersion': 1,
        'leafNodesCount': 4,
        'leafNodes': [
          'domain_14185',
          'do_10096170',
          'do_112792043208769536150',
          'do_1127922553743687681541'
        ],
        'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar',
        'variants': '{"online":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486057279_do_1130292569979781121111_1.0_online.ecar","size":11025.0},"spine":{"ecarUrl":"https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar","size":238603.0}}'
      }
    ],
    'mediaType': 'content',
    'name': 'Sudip testing course- mentor and creator',
    'toc_url': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1130292569979781121111/artifact/do_1130292569979781121111_toc.json',
    'batches': [
      {
        'createdFor': [],
        'endDate': null,
        'name': 'Sudip testing course- mentor and creator',
        'batchId': '0130292637024829445',
        'enrollmentType': 'open',
        'enrollmentEndDate': null,
        'startDate': '2020-05-26',
        'status': 1
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-05-31',
        'name': 'My testing batch',
        'batchId': '0130292642366914566',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-05-31',
        'startDate': '2020-05-26',
        'status': 1
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011258861977618',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TESTSTTS',
        'batchId': '0130301131209850885',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-05-28',
        'startDate': '2020-05-28',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '0130301142347857926',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011520647987211',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TESTSTTS',
        'batchId': '0130301153702215684',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-05-28',
        'startDate': '2020-05-28',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TESTT',
        'batchId': '0130301153860812803',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-05-30',
        'startDate': '2020-05-30',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011590824755216',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '0130301160163082248',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011650529689617',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '0130301165932544007',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011672394956810',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '0130301171093340169',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TESTSTTSTS',
        'batchId': '01303011726160691221',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-06',
        'startDate': '2020-06-02',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011761315840013',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011815433830419',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TESTTS',
        'batchId': '01303011819483136024',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-04',
        'startDate': '2020-06-04',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TEST',
        'batchId': '0130301183567462402',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-05-27',
        'startDate': '2020-05-27',
        'status': 1
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011842667315212',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011857231872014',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TESTSTTSTS',
        'batchId': '01303011881721036820',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-06',
        'startDate': '2020-06-02',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TESTTS',
        'batchId': '01303011900755968023',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-04',
        'startDate': '2020-06-04',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-07-05',
        'name': 'TESTSTTS',
        'batchId': '01303011989451571215',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-10',
        'startDate': '2020-06-07',
        'status': 0
      },
      {
        'createdFor': [
          'ORG_001'
        ],
        'endDate': '2020-06-07',
        'name': 'TESTTS',
        'batchId': '01303012020079001622',
        'enrollmentType': 'open',
        'enrollmentEndDate': '2020-06-04',
        'startDate': '2020-06-04',
        'status': 0
      }
    ],
    'createdOn': '2020-05-26T09:31:13.388+0000',
    'createdFor': [
      'ORG_001'
    ],
    'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
    'genre': [
      'Alphabet Books'
    ],
    'lastUpdatedOn': '2020-05-26T09:40:52.972+0000',
    'subject': [
      'Hindi'
    ],
    'courseType': 'TrainingCourse',
    'size': 238603,
    'identifier': 'do_1130292569979781121111',
    'description': 'VSV - Training Course - May 15 - copied',
    'resourceType': 'Course',
    'gradeLevel': [
      'Class1'
    ],
    'domain': [
      'literacy',
      'numeracy'
    ],
    'ownershipType': [
      'createdBy'
    ],
    'compatibilityLevel': 4,
    'audience': [
      'Learner'
    ],
    'c_sunbird_dev_open_batch_count': 24,
    'os': [
      'All'
    ],
    'collections': [],
    'appIcon': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_1130292569979781121111/artifact/ashoka_chakra.thumb.png',
    'languageCode': [
      'en'
    ],
    'SYS_INTERNAL_LAST_UPDATED_ON': '2020-05-26T09:40:57.798+0000',
    'downloadUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar',
    'lockKey': '0042cab9-5417-488d-b2d0-ca278fa97c45',
    'usedByContent': [],
    'medium': [
      'English'
    ],
    'framework': 'cbse-tpd',
    'posterImage': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/do_112995276604129280123/artifact/ashoka_chakra.png',
    'creator': 'Mentor First User',
    'totalCompressedSize': 19797763,
    'versionKey': '1590486052972',
    'mimeType': 'application/vnd.ekstep.content-collection',
    'code': 'org.sunbird.4cbpzP.copy',
    'license': 'CC BY-NC-SA 4.0',
    'leafNodes': [
      'do_112974024033230848123',
      'domain_14185',
      'do_11234621699931340812',
      'do_10096170',
      'do_112792043208769536150',
      'do_1127922553743687681541'
    ],
    'version': 2,
    'prevStatus': 'Processing',
    'contentType': 'Course',
    'prevState': 'Review',
    'language': [
      'English'
    ],
    'board': 'CBSE',
    'ageGroup': [
      '5-6'
    ],
    'lastPublishedOn': '2020-05-26T09:40:53.539+0000',
    'contentTypesCount': '{"CourseUnit":4,"Resource":6}',
    'objectType': 'Content',
    'origin': 'do_1130215030531768321107',
    'lastUpdatedBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
    'status': 'Live',
    'reservedDialcodes': {
      'V4P4Z3': 0
    },
    'createdBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
    'dialcodeRequired': 'No',
    'lastSubmittedOn': '2020-05-26T09:39:37.079+0000',
    'keywords': [
      'www',
      'tag',
      'Story'
    ],
    'idealScreenSize': 'normal',
    'contentEncoding': 'gzip',
    'leafNodesCount': 6,
    'depth': 0,
    'consumerId': '9958efa0-4a04-4649-acbc-17f661dfc4dd',
    'lastPublishedBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
    'mimeTypesCount': '{"application/vnd.ekstep.html-archive":2,"application/vnd.ekstep.content-collection":4,"application/vnd.ekstep.ecml-archive":1,"video/x-youtube":1,"application/vnd.android.package-archive":2}',
    'osId': 'org.ekstep.quiz.app',
    'copyrightYear': 2020,
    'appId': 'dev.sunbird.portal',
    's3Key': 'ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar',
    'contentDisposition': 'inline',
    'childNodes': [
      'do_112974024033230848123',
      'domain_14185',
      'do_1130292569984860161117',
      'do_1130292569984942081119',
      'do_1130292569984696321113',
      'do_11234621699931340812',
      'do_10096170',
      'do_1130292569984778241115',
      'do_112792043208769536150',
      'do_1127922553743687681541'
    ],
    'visibility': 'Default',
    'variants': {
      'online': {
        'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486057279_do_1130292569979781121111_1.0_online.ecar',
        'size': 11025
      },
      'spine': {
        'ecarUrl': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/ecar_files/do_1130292569979781121111/sudip-testing-course-mentor-and-creator_1590486056449_do_1130292569979781121111_1.0_spine.ecar',
        'size': 238603
      }
    },
    'pkgVersion': 1,
    'idealScreenDensity': 'hdpi',
    'orgDetails': {
      'email': 'support_dev@sunbird.org',
      'orgName': 'Sunbird'
    },
    'licenseDetails': {
      'name': 'CC BY-NC-SA 4.0',
      'url': 'https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode',
      'description': 'This license is Creative Commons Attribution-NonCommercial-ShareAlike'
    }
  }
};
