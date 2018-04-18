export const mockRes = {
  orgDetailsSuccess: {
    'responseCode': 'OK',
    'result': {
      'response': {
        'count': 2,
        'content': [{
          'identifier': '01229679766115942443',
          'orgName': 'XYZ Institution'
        }]
      }
    },
  },
  orgsDetailsSuccess: {
    'responseCode': 'OK',
    'result': {
      'response': {
        'count': 2,
        'content': [{
          'identifier': '01229679766115942443',
          'orgName': 'XYZ Institution'
        }, {
          'identifier': '0123150108807004166',
          'orgName': 'NTP Content Create Testing'
        }]
      }
    }
  },
  downloadReportSuccess: {
    'id': 'api.sunbird.dashboard.org.creation',
    'responseCode': 'OK',
    'result': {
      'requestId': '0124452555998003206'
    }
  },
  dashboardSuccessData: {
    'bucketData': {
      'org.creation.content[@status=draft].count': {
        'name': 'Draft',
        'split': 'content.created_on',
        'group_id': 'org.content.count',
        'buckets': [{
          'key': 1518435525770,
          'key_name': '2018-02-12',
          'value': 0
        }, {
          'key': 1518521925770,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518608325770,
          'key_name': '2018-02-14',
          'value': 0
        }, {
          'key': 1518694725770,
          'key_name': '2018-02-15',
          'value': 0
        }, {
          'key': 1518781125770,
          'key_name': '2018-02-16',
          'value': 0
        }, {
          'key': 1518867525770,
          'key_name': '2018-02-17',
          'value': 0
        }, {
          'key': 1518953925770,
          'key_name': '2018-02-18',
          'value': 0
        }]
      },
      'org.creation.content[@status=review].count': {
        'name': 'Review',
        'split': 'content.reviewed_on',
        'group_id': 'org.content.count',
        'buckets': [{
          'key': 1518435525770,
          'key_name': '2018-02-12',
          'value': 0
        },
        {
          'key': 1518521925770,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518608325770,
          'key_name': '2018-02-14',
          'value': 0
        },
        {
          'key': 1518694725770,
          'key_name': '2018-02-15',
          'value': 0
        }, {
          'key': 1518781125770,
          'key_name': '2018-02-16',
          'value': 0
        },
        {
          'key': 1518867525770,
          'key_name': '2018-02-17',
          'value': 0
        }, {
          'key': 1518953925770,
          'key_name': '2018-02-18',
          'value': 0
        }
        ]
      },
      'org.creation.content[@status=published].count': {
        'name': 'Live',
        'split': 'content.published_on',
        'group_id': 'org.content.count',
        'buckets': [{
          'key': 1518435525770,
          'key_name': '2018-02-12',
          'value': 0
        }, {
          'key': 1518521925770,
          'key_name': '2018-02-13',
          'value': 0
        }, {
          'key': 1518608325770,
          'key_name': '2018-02-14',
          'value': 0
        }, {
          'key': 1518694725770,
          'key_name': '2018-02-15',
          'value': 0
        }, {
          'key': 1518781125770,
          'key_name': '2018-02-16',
          'value': 0
        }, {
          'key': 1518867525770,
          'key_name': '2018-02-17',
          'value': 0
        }, {
          'key': 1518953925770,
          'key_name': '2018-02-18',
          'value': 0
        }]
      }
    },
    'numericData': [{
      'name': 'Number of contents created',
      'value': 0
    }, {
      'name': 'Number of authors',
      'value': 0
    },
    {
      'name': 'Number of reviewers',
      'value': 0
    }
    ],
    'series': ['0 Created', '0 IN REVIEW', '0 LIVE'],
    'name': 'Content created per day'
  }
};

