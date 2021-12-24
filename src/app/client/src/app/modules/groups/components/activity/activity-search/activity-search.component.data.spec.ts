export const activitySearchMockData = {
  channelData: {
    'identifier': 'b00bc992ef25f1a9a8d63291e20efc8d',
    'code': 'b00bc992ef25f1a9a8d63291e20efc8d',
    'defaultLicense': 'CC BY-NC 4.0',
    'frameworks': [
      {
        'identifier': 'NCF101',
        'name': 'NCF101'
      },
      {
        'identifier': 'NCF',
        'name': 'State (Uttar Pradesh)'
      }
    ],
    'defaultCourseFramework': 'TPD',
    'status': 'Live',
    'defaultFramework': 'NCFCOPY'
  },

  eventDataForResource: {
      'name': '.TestContent!23.',
      'image': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_ft_9158412/artifact/jpegimage_1538045901746.thumb.jpeg',
      'rating': '0',
      'orgDetails': {},
      'gradeLevel': '',
      'contentType': 'Resource',
      'topic': '',
      'subTopic': '',
      'metaData': {
        'identifier': 'LP_FT_9158412',
        'mimeType': 'application/vnd.ekstep.ecml-archive',
        'contentType': 'Resource'
      },
      'completionPercentage': 0,
      'mimeTypesCount': 0,
      'cardImg': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_ft_9158412/artifact/jpegimage_1538045901746.thumb.jpeg',
      'board': '',
      'identifier': 'LP_FT_9158412',
      'mimeType': 'application/vnd.ekstep.ecml-archive',
      'primaryCategory': 'Explanation content',
      'action': {
        'onImage': {
          'eventName': 'onImage'
        }
      },
      'ribbon': {
        'left': {},
        'right': {
          'name': 'Resource'
        }
      }
  },

  eventDataForCourse: {
      'name': '.TestContent!23.',
      'image': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_ft_9158412/artifact/jpegimage_1538045901746.thumb.jpeg',
      'rating': '0',
      'orgDetails': {},
      'trackable': {
        'enabled': 'yes'
      },
      'gradeLevel': '',
      'contentType': 'Course',
      'topic': '',
      'subTopic': '',
      'primaryCategory': 'Course',
      'metaData': {
        'identifier': 'LP_FT_9158412',
        'mimeType': 'application/vnd.ekstep.ecml-archive',
        'contentType': 'Resource'
      },
      'completionPercentage': 0,
      'mimeTypesCount': 0,
      'cardImg': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_ft_9158412/artifact/jpegimage_1538045901746.thumb.jpeg',
      'board': '',
      'identifier': 'LP_FT_9158412',
      'mimeType': 'application/vnd.ekstep.content-collection',
      'action': {
        'onImage': {
          'eventName': 'onImage'
        }
      },
      'ribbon': {
        'left': {},
        'right': {
          'name': 'Resource'
        }
      }
  },
  eventDataForTextbook: {
      'name': '.TestContent!23.',
      'image': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_ft_9158412/artifact/jpegimage_1538045901746.thumb.jpeg',
      'rating': '0',
      'orgDetails': {},
      'gradeLevel': '',
      'contentType': 'TextBook',
      'topic': '',
      'subTopic': '',
      'metaData': {
        'identifier': 'LP_FT_9158412',
        'mimeType': 'application/vnd.ekstep.ecml-archive',
        'contentType': 'Resource'
      },
      'completionPercentage': 0,
      'mimeTypesCount': 0,
      'cardImg': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/lp_ft_9158412/artifact/jpegimage_1538045901746.thumb.jpeg',
      'board': '',
      'identifier': 'LP_FT_9158412',
      'mimeType': 'application/vnd.ekstep.content-collection',
      'primaryCategory': 'eTextbook',
      'action': {
        'onImage': {
          'eventName': 'onImage'
        }
      },
      'ribbon': {
        'left': {},
        'right': {
          'name': 'Resource'
        }
      }
  },
  searchReq: {
    "request":{
       "filters":{
          "key":"vvn",
          "primaryCategory":[
             "Course"
          ],
          "batches.status":1,
          "batches.enrollmentType":"open",
          "objectType":[
             "Content"
          ],
          "status":[
             "Live"
          ]
       },
       "limit":100,
       "query":"vvn",
       "fields":[
          "name",
          "appIcon",
          "mimeType",
          "gradeLevel",
          "identifier",
          "medium",
          "pkgVersion",
          "board",
          "subject",
          "resourceType",
          "primaryCategory",
          "contentType",
          "channel",
          "organisation",
          "trackable"
       ],
       "mode":"soft",
       "facets":[
          "se_boards",
          "se_gradeLevels",
          "se_subjects",
          "se_mediums",
          "primaryCategory"
       ],
       "offset":0
    }
 },
 searchRes: {
  "result":{
     "count":0,
     "facets":[
        {
           "values":[
              
           ],
           "name":"se_mediums"
        },
        {
           "values":[
              
           ],
           "name":"se_boards"
        },
        {
           "values":[
              
           ],
           "name":"primaryCategory"
        },
        {
           "values":[
              
           ],
           "name":"se_gradeLevels"
        },
        {
           "values":[
              
           ],
           "name":"se_subjects"
        }
     ]
  }
}
};
