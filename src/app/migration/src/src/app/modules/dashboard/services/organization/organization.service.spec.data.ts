export const mockRes = {
  creationSuccessData: {
    'id': 'api.sunbird.dashboard.org.creation',
    'ver': 'v1',
    'responseCode': 'OK',
    'result': {
      'period': '7d',
      'org': {
        'orgName': 'Consumption Org',
        'orgId': '01232002070124134414'
      },
      'snapshot': {
        'org.creation.content.count': {
          'name': 'Number of contents created',
          'value': 47.0
        },
        'org.creation.authors.count': {
          'name': 'Number of authors',
          'value': 5
        },
        'org.creation.reviewers.count': {
          'name': 'Number of reviewers',
          'value': 3
        },
        'org.creation.content[@status=draft].count': {
          'name': 'Number of content items created',
          'value': 47
        },
        'org.creation.content[@status=review].count': {
          'name': 'Number of content items reviewed',
          'value': 3
        },
        'org.creation.content[@status=published].count': {
          'name': 'Number of content items published',
          'value': 8
        }
      },
      'series': {
        'org.creation.content[@status=draft].count': {
          'name': 'Draft',
          'split': 'content.created_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1517941800000,
            'key_name': '2018-02-07',
            'value': 7
          }, {
            'key': 1518028200000,
            'key_name': '2018-02-08',
            'value': 9
          }, {
            'key': 1518114600000,
            'key_name': '2018-02-09',
            'value': 9
          }, {
            'key': 1518201000000,
            'key_name': '2018-02-10',
            'value': 5
          }, {
            'key': 1518287400000,
            'key_name': '2018-02-11',
            'value': 7
          }, {
            'key': 1518373800000,
            'key_name': '2018-02-12',
            'value': 5
          }, {
            'key': 1518460200000,
            'key_name': '2018-02-13',
            'value': 5
          }]
        },
        'org.creation.content[@status=review].count': {
          'name': 'Review',
          'split': 'content.reviewed_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1517941800000,
            'key_name': '2018-02-07',
            'value': 0
          },
          {
            'key': 1518028200000,
            'key_name': '2018-02-08',
            'value': 1
          }, {
            'key': 1518114600000,
            'key_name': '2018-02-09',
            'value': 0
          },
          {
            'key': 1518201000000,
            'key_name': '2018-02-10',
            'value': 1
          }, {
            'key': 1518287400000,
            'key_name': '2018-02-11',
            'value': 0
          },
          {
            'key': 1518373800000,
            'key_name': '2018-02-12',
            'value': 1
          }, {
            'key': 1518460200000,
            'key_name': '2018-02-13',
            'value': 0
          }
          ]
        },
        'org.creation.content[@status=published].count': {
          'name': 'Live',
          'split': 'content.published_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1517941800000,
            'key_name': '2018-02-07',
            'value': 0
          }, {
            'key': 1518028200000,
            'key_name': '2018-02-08',
            'value': 3
          }, {
            'key': 1518114600000,
            'key_name': '2018-02-09',
            'value': 2
          }, {
            'key': 1518201000000,
            'key_name': '2018-02-10',
            'value': 3
          }, {
            'key': 1518287400000,
            'key_name': '2018-02-11',
            'value': 0
          }, {
            'key': 1518373800000,
            'key_name': '2018-02-12',
            'value': 0
          }, {
            'key': 1518460200000,
            'key_name': '2018-02-13',
            'value': 0
          }]
        }
      }
    }
  },
  parsedConsumptionData: {
    'id': 'api.sunbird.dashboard.org.consumption',
    'ver': 'v1',
    'responseCode': 'OK',
    'result': {
      'period': '7d',
      'org': {
        'orgName': 'Consumption Org',
        'orgId': '01232002070124134414'
      },
      'snapshot': {
        'org.consumption.content.session.count': {
          'name': 'Number of visits by users',
          'value': 0
        },
        'org.consumption.content.time_spent.sum': {
          'name': 'Content consumption time',
          'value': 0.0,
          'time_unit': 'seconds'
        },
        'org.consumption.content.time_spent.average': {
          'name': 'Average time spent by user per visit',
          'value': 0.0,
          'time_unit': 'seconds'
        }
      },
      'series': {
        'org.consumption.content.users.count': {
          'name': 'Number of users per day',
          'split': 'content.users.count',
          'group_id': 'org.users.count',
          'buckets': [{
            'key': 1518075015740,
            'key_name': '2018-02-08',
            'value': 0
          },
          {
            'key': 1518161415740,
            'key_name': '2018-02-09',
            'value': 0
          }, {
            'key': 1518247815740,
            'key_name': '2018-02-10',
            'value': 0
          },
          {
            'key': 1518334215740,
            'key_name': '2018-02-11',
            'value': 0
          }, {
            'key': 1518420615740,
            'key_name': '2018-02-12',
            'value': 0
          },
          {
            'key': 1518507015740,
            'key_name': '2018-02-13',
            'value': 0
          }, {
            'key': 1518593415740,
            'key_name': '2018-02-14',
            'value': 0
          }
          ]
        },
        'org.consumption.content.time_spent.sum': {
          'name': 'Time spent by day',
          'split': 'content.time_spent.user.count',
          'time_unit': 'seconds',
          'group_id': 'org.timespent.sum',
          'buckets': [{
            'key': 1518075015740,
            'key_name': '2018-02-08',
            'value': 0.0
          },
          {
            'key': 1518161415740,
            'key_name': '2018-02-09',
            'value': 0.0
          }, {
            'key': 1518247815740,
            'key_name': '2018-02-10',
            'value': 0.0
          },
          {
            'key': 1518334215740,
            'key_name': '2018-02-11',
            'value': 0.0
          }, {
            'key': 1518420615740,
            'key_name': '2018-02-12',
            'value': 0.0
          },
          {
            'key': 1518507015740,
            'key_name': '2018-02-13',
            'value': 0.0
          }, {
            'key': 1518593415740,
            'key_name': '2018-02-14',
            'value': 0.0
          }
          ]
        }
      }
    }
  },
  parsedCreationData: {
    'id': 'api.sunbird.dashboard.org.creation',
    'ver': 'v1',
    'responseCode': 'OK',
    'result': {
      'period': '7d',
      'org': {
        'orgName': 'Consumption Org',
        'orgId': '01232002070124134414'
      },
      'snapshot': {
        'org.creation.content.count': {
          'name': 'Number of contents created',
          'value': 47.0
        },
        'org.creation.authors.count': {
          'name': 'Number of authors',
          'value': 5
        },
        'org.creation.reviewers.count': {
          'name': 'Number of reviewers',
          'value': 3
        },
        'org.creation.content[@status=draft].count': {
          'name': 'Number of content items created',
          'value': 47
        },
        'org.creation.content[@status=review].count': {
          'name': 'Number of content items reviewed',
          'value': 3
        },
        'org.creation.content[@status=published].count': {
          'name': 'Number of content items published',
          'value': 8
        }
      },
      'series': {
        'org.creation.content[@status=draft].count': {
          'name': 'Draft',
          'split': 'content.created_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1517941800000,
            'key_name': '2018-02-07',
            'value': 7
          }, {
            'key': 1518028200000,
            'key_name': '2018-02-08',
            'value': 9
          }, {
            'key': 1518114600000,
            'key_name': '2018-02-09',
            'value': 9
          }, {
            'key': 1518201000000,
            'key_name': '2018-02-10',
            'value': 5
          }, {
            'key': 1518287400000,
            'key_name': '2018-02-11',
            'value': 7
          }, {
            'key': 1518373800000,
            'key_name': '2018-02-12',
            'value': 5
          }, {
            'key': 1518460200000,
            'key_name': '2018-02-13',
            'value': 5
          }]
        },
        'org.creation.content[@status=review].count': {
          'name': 'Review',
          'split': 'content.reviewed_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1517941800000,
            'key_name': '2018-02-07',
            'value': 0
          }, {
            'key': 1518028200000,
            'key_name': '2018-02-08',
            'value': 1
          }, {
            'key': 1518114600000,
            'key_name': '2018-02-09',
            'value': 0
          }, {
            'key': 1518201000000,
            'key_name': '2018-02-10',
            'value': 1
          }, {
            'key': 1518287400000,
            'key_name': '2018-02-11',
            'value': 0
          }, {
            'key': 1518373800000,
            'key_name': '2018-02-12',
            'value': 1
          }, {
            'key': 1518460200000,
            'key_name': '2018-02-13',
            'value': 0
          }]
        },
        'org.creation.content[@status=published].count': {
          'name': 'Live',
          'split': 'content.published_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1517941800000,
            'key_name': '2018-02-07',
            'value': 0
          }, {
            'key': 1518028200000,
            'key_name': '2018-02-08',
            'value': 3
          },
          {
            'key': 1518114600000,
            'key_name': '2018-02-09',
            'value': 2
          }, {
            'key': 1518201000000,
            'key_name': '2018-02-10',
            'value': 3
          },
          {
            'key': 1518287400000,
            'key_name': '2018-02-11',
            'value': 0
          }, {
            'key': 1518373800000,
            'key_name': '2018-02-12',
            'value': 0
          },
          {
            'key': 1518460200000,
            'key_name': '2018-02-13',
            'value': 0
          }
          ]
        }
      }
    }
  }
};

