export const serviceMockData = {
  formData: [
    {
      'index': 0,
      'title': 'frmelmnts.tab.courses',
      'desc': 'frmelmnts.tab.courses',
      'menuType': 'Content',
      'contentType': 'course',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': ''
      },
      'search': {
        'facets': ['topic', 'purpose', 'medium', 'gradeLevel', 'subject', 'channel'],
        'fields': [],
        'filters': {
          'contentType': [
            'Course'
          ]
        }
      },
      anonumousUserRoute: {
        route: '/explore-course',
        queryParam: 'course'
      },
      loggedInUserRoute: {
        route: '/learn',
        queryParam: 'course'
      },
      limit: 20,
    },
    {
      'index': 1,
      'title': 'frmelmnts.lbl.textbooks',
      'desc': 'frmelmnts.lbl.textbooks',
      'menuType': 'Content',
      'contentType': 'textbook',
      'isEnabled': true,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': ''
      },
      'search': {
        'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType', 'concepts'],
        'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier', 'medium',
          'pkgVersion', 'board',
          'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
        'filters': {
          'contentType': [
            'TextBook'
          ]
        }
      },
      anonumousUserRoute: {
        route: '/explore',
        queryParam: 'textbook'
      },
      loggedInUserRoute: {
        route: '/resources',
        queryParam: 'textbook'
      },
      limit: 100,
    },
    {
      'index': 2,
      'title': 'frmelmnts.tab.all',
      'desc': 'frmelmnts.tab.all',
      'menuType': 'Content',
      'isEnabled': false,
      'theme': {
        'baseColor': '',
        'textColor': '',
        'supportingColor': ''
      },
      'search': {
        'facets': ['board', 'gradeLevel', 'subject', 'medium', 'contentType', 'concepts'],
        'fields': ['name', 'appIcon', 'mimeType', 'gradeLevel', 'identifier',
          'medium', 'pkgVersion', 'board', 'subject', 'resourceType', 'contentType', 'channel', 'organisation'],
        'filters': {
          'contentType': [
            'Collection', 'TextBook', 'LessonPlan', 'Resource', 'SelfAssess', 'PracticeResource', 'LearningOutcomeDefinition', 'ExplanationResource', 'CurriculumCourse', 'Course'
          ]
        }
      },
      limit: 100
    }
  ],
  returnValue: {
    Mathematics: {
      background: '#FFDFD9',
      titleColor: '#EA2E52',
      icon: './../../../../../assets/images/sub_math.svg'
    },
    Science: {
      background: '#FFD6EB',
      titleColor: '#FD59B3',
      icon: './../../../../../assets/images/sub_science.svg'
    },
    Social: {
      background: '#DAD4FF',
      titleColor: '#635CDC',
      icon: './../../../../../assets/images/sub_social.svg'
    },
    English: {
      background: '#DAFFD8',
      titleColor: '#218432',
      icon: './../../../../../assets/images/sub_english.svg'
    },
    Hindi: {
      background: '#C2E2E9',
      titleColor: '#07718A',
      icon: './../../../../../assets/images/sub_hindi.svg'
    },
    Chemistry: {
      background: '#FFE59B',
      titleColor: '#8D6A00',
      icon: './../../../../../assets/images/sub_chemistry.svg'
    },
    Geography: {
      background: '#C2ECE6',
      titleColor: '#149D88',
      icon: './../../../../../assets/images/sub_geography.svg'
    }
  },
  successData: {
    'id': 'api.content.search',
    'ver': '1.0',
    'ts': '2018-04-20T12:08:27.166Z',
    'params': {
      'resmsgid': '884143e0-4493-11e8-953e-4d77b46d6543',
      'msgid': '8835f940-4493-11e8-a1ed-091dca70410a',
      'status': 'successful',
      'err': null,
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'count': 1,
      'content': [
        {
          'channel': 'in.ekstep',
     'downloadUrl': 'https://ekstep-public-dev.s3-ap-soom/ecd-from-akshara-kannada_1488879924286_do_1121933583296348161147_1.0.ecar',
          'language': [
            'English'
          ],
          'variants': {
            'spine': {
              'ecarUrl': 'https://ekstep-publi96348161147/kshara-kannada_1488879925028_do_1121933583296348161147_1.0_spine.ecar',
              'size': 822
            }
          },
          'mimeType': 'application/vnd.ekstep.plugin-archive',
          'objectType': 'Content',
          'gradeLevel': [
            'Grade 1'
          ],
          'collections': [
            'do_1124708996919214081275',
            'do_112472116139458560178'
          ],
          'appId': 'dev.ekstep.in',
          'copyType': 'Enhance',
          'contentEncoding': 'gzip',
          'artifactUrl': 'https://ekstep-public-817/artifact/akshara_kan_1487743191313.zip',
          'contentType': 'Worksheet',
          'lastUpdatedBy': '452',
          'identifier': 'do_1121933583296348161147',
          'audience': [
            'Learner'
          ],
          'visibility': 'Default',
          'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
          'portalOwner': '449',
          'mediaType': 'content',
          'osId': 'org.ekstep.quiz.app',
          'ageGroup': [
            '5-6'
          ],
          'lastPublishedBy': '452',
          'languageCode': 'en',
          'graph_id': 'domain',
          'nodeType': 'DATA_NODE',
          'prevState': 'Review',
          'size': 1870310,
          'lastPublishedOn': '2017-03-07T09:45:24.285+0000',
          'name': 'Copied From Akshara - Kannada',
          'status': 'Live',
          'code': 'org.ekstep.feb22.story.test03.fork',
          'origin': 'do_11218758555843788817',
          'description': 'Akshara Kannada',
          'idealScreenSize': 'normal',
          'createdOn': '2017-03-02T09:31:01.723+0000',
          'contentDisposition': 'inline',
          'lastUpdatedOn': '2017-05-24T17:46:37.879+0000',
          'SYS_INTERNAL_LAST_UPDATED_ON': '2017-06-09T06:45:11.972+0000',
          'owner': 'EkStep',
          'os': [
            'All'
          ],
          'pkgVersion': 1,
          'versionKey': '1496990711972',
          'idealScreenDensity': 'hdpi',
          's3Key': 'ecar_files/do_1121933583296348161147/copied-from-akshara-kannada_1488879924286_do_1121933583296348161147_1.0.ecar',
          'framework': 'NCF',
          'createdBy': '449',
          'compatibilityLevel': 1,
          'node_id': 96096
        }
      ]
    }
  }
};