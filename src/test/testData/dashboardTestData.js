var dashboardsTestData = { // eslint-disable-line
  rendererData: {
    series: {
      'bucketData': {
        'org.creation.content[@status=draft].count': {
          'name': 'Draft',
          'split': 'content.created_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1514226600000,
            'key_name': '2017-12-26',
            'value': 6
          }, {
            'key': 1514313000000,
            'key_name': '2017-12-27',
            'value': 3
          }, {
            'key': 1514399400000,
            'key_name': '2017-12-28',
            'value': 1
          }, {
            'key': 1514485800000,
            'key_name': '2017-12-29',
            'value': 5
          }, {
            'key': 1514572200000,
            'key_name': '2017-12-30',
            'value': 0
          }, {
            'key': 1514658600000,
            'key_name': '2017-12-31',
            'value': 0
          }, {
            'key': 1514745000000,
            'key_name': '2018-01-01',
            'value': 6
          }]
        },
        'org.creation.content[@status=review].count': {
          'name': 'Review',
          'split': 'content.reviewed_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1514277252644,
            'key_name': '2017-12-26',
            'value': 0
          }, {
            'key': 1514363652644,
            'key_name': '2017-12-27',
            'value': 0
          }, {
            'key': 1514450052644,
            'key_name': '2017-12-28',
            'value': 0
          }, {
            'key': 1514536452644,
            'key_name': '2017-12-29',
            'value': 0
          }, {
            'key': 1514622852644,
            'key_name': '2017-12-30',
            'value': 0
          }, {
            'key': 1514709252644,
            'key_name': '2017-12-31',
            'value': 0
          }, {
            'key': 1514795652644,
            'key_name': '2018-01-01',
            'value': 0
          }]
        },
        'org.creation.content[@status=published].count': {
          'name': 'Live',
          'split': 'content.published_on',
          'group_id': 'org.content.count',
          'buckets': [{
            'key': 1514226600000,
            'key_name': '2017-12-26',
            'value': 0
          }, {
            'key': 1514313000000,
            'key_name': '2017-12-27',
            'value': 0
          }, {
            'key': 1514399400000,
            'key_name': '2017-12-28',
            'value': 2
          }, {
            'key': 1514485800000,
            'key_name': '2017-12-29',
            'value': 0
          }, {
            'key': 1514572200000,
            'key_name': '2017-12-30',
            'value': 3
          }, {
            'key': 1514658600000,
            'key_name': '2017-12-31',
            'value': 0
          }, {
            'key': 1514745000000,
            'key_name': '2018-01-01',
            'value': 2
          }]
        }
      },
      'name': 'Content created per day',
      'numericData': [{
        'name': 'Number of contents created',
        'value': 21
      }, {
        'name': 'Number of authors',
        'value': 6
      }, {
        'name': 'Number of reviewers',
        'value': 5
      }],
      'series': ['21 Created', '0 IN REVIEW', '7 LIVE']
    },
    noSeries: {
      'bucketData': {
        'org.consumption.content.users.count': {
          'name': 'Number of users per day',
          'split': 'content.users.count',
          'group_id': 'org.users.count',
          'buckets': [{
            'key': 1514270177342,
            'key_name': '2017-12-26',
            'value': 0
          }, {
            'key': 1514356577342,
            'key_name': '2017-12-27',
            'value': 0
          }, {
            'key': 1514442977342,
            'key_name': '2017-12-28',
            'value': 0
          }, {
            'key': 1514529377342,
            'key_name': '2017-12-29',
            'value': 0
          }, {
            'key': 1514615777342,
            'key_name': '2017-12-30',
            'value': 0
          }, {
            'key': 1514702177342,
            'key_name': '2017-12-31',
            'value': 0
          }, {
            'key': 1514788577342,
            'key_name': '2018-01-01',
            'value': 0
          }]
        },
        'org.consumption.content.time_spent.sum': {
          'name': 'Time spent by day',
          'split': 'content.time_spent.user.count',
          'time_unit': 'seconds',
          'group_id': 'org.timespent.sum',
          'buckets': [{
            'key': 1514270177342,
            'key_name': '2017-12-26',
            'value': 0
          }, {
            'key': 1514356577342,
            'key_name': '2017-12-27',
            'value': 0
          }, {
            'key': 1514442977342,
            'key_name': '2017-12-28',
            'value': 0
          }, {
            'key': 1514529377342,
            'key_name': '2017-12-29',
            'value': 0
          }, {
            'key': 1514615777342,
            'key_name': '2017-12-30',
            'value': 0
          }, {
            'key': 1514702177342,
            'key_name': '2017-12-31',
            'value': 0
          }, {
            'key': 1514788577342,
            'key_name': '2018-01-01',
            'value': 0
          }]
        }
      },
      'numericData': [{
        'name': 'Number of visits by users',
        'value': '0 second(s)'
      }, {
        'name': 'Content consumption time',
        'value': '0 second(s)',
        'time_unit': 'seconds'
      }, {
        'name': 'Average time spent by user per visit',
        'value': '0 second(s)',
        'time_unit': 'seconds'
      }],
      'series': ''
    }
  },
  orgData: {
    orgSearchSuccess: {'id': 'api.org.search', 'ver': 'v1', 'ts': '2018-01-02 11:47:10:719+0000', 'params': {'resmsgid': null, 'msgid': 'a3f0aa32-75e8-489b-9646-837421892c31', 'err': null, 'status': 'success', 'errmsg': null}, 'responseCode': 'OK', 'result': {'response': {'count': 4, 'content': [{'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'EKSTEP Corporation', 'updatedDate': null, 'addressId': '0123131141138350081', 'orgType': 'Training', 'provider': null, 'orgCode': 'ABCL', 'theme': null, 'id': '0123131115383275520', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '0123131115383275520', 'thumbnail': null, 'orgName': 'EKSTEP Corporation', 'updatedBy': null, 'address': {'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-18 13:59:28:684+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '0123131141138350081', 'state': 'TN'}, 'externalId': null, 'isRootOrg': true, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"email":"test@test.com","phone":"213124234234"},{"email":"test1@test.com","phone":"+91213124234234"}]', 'createdDate': '2017-08-18 13:59:28:684+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '0123131115383275520', 'noOfMembers': 1, 'status': null}, {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'ABC Corporation', 'updatedDate': '2017-09-04 10:44:30:921+0000', 'addressId': '01230654297501696027', 'orgType': 'Training', 'provider': null, 'orgCode': 'ABCL', 'theme': null, 'id': '01230654824904294426', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '01230654824904294426', 'thumbnail': null, 'orgName': 'ABC Corporation', 'updatedBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'address': {'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-09 07:20:29:343+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '01230654297501696027', 'state': 'TN'}, 'externalId': null, 'isRootOrg': false, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': null, 'createdDate': '2017-08-09 07:20:29:342+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '01230654824904294426', 'noOfMembers': 1, 'status': null}, {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null}, {'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'NTP Content Create Testing', 'updatedDate': null, 'addressId': '0123150128754360327', 'orgType': 'Training', 'provider': null, 'orgCode': 'NCCT', 'theme': null, 'id': '0123150108807004166', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '0123150108807004166', 'thumbnail': null, 'orgName': 'NTP Content Create Testing', 'updatedBy': null, 'address': {'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-21 06:26:13:394+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '0123150128754360327', 'state': 'TN'}, 'externalId': null, 'isRootOrg': false, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': null, 'createdDate': '2017-08-21 06:26:13:393+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '0123150108807004166', 'noOfMembers': 1, 'status': null}]}}},  // eslint-disable-line
    orgSearchFailure : {'id': 'api.org.search', 'ver': 'v1', 'ts': '2018-01-02 11:47:10:719+0000', 'params': {'resmsgid': null, 'msgid': 'a3f0aa32-75e8-489b-9646-837421892c31', 'err': null, 'status': 'error', 'errmsg': null}, 'responseCode': 'Fail'},   // eslint-disable-line
    creationResponse: {'id': 'api.sunbird.dashboard.org.creation', 'ver': 'v1', 'ts': '2017-10-30 09:00:34:779+0000', 'params': {'resmsgid': null, 'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf', 'err': null, 'status': 'success', 'errmsg': null}, 'responseCode': 'OK', 'result': {'period': '7d', 'org': {'orgName': 'Consumption Org', 'orgId': '01232002070124134414'}, 'series': {'org.creation.content[@status=draft].count': {'name': 'Draft', 'split': 'content.created_on', 'group_id': 'org.content.count', 'buckets': [{'key': 1508697000000, 'key_name': '2017-10-23', 'value': 0}, {'key': 1508783400000, 'key_name': '2017-10-24', 'value': 12}, {'key': 1508869800000, 'key_name': '2017-10-25', 'value': 4}, {'key': 1508956200000, 'key_name': '2017-10-26', 'value': 8}, {'key': 1509042600000, 'key_name': '2017-10-27', 'value': 23}, {'key': 1509129000000, 'key_name': '2017-10-28', 'value': 0}, {'key': 1509215400000, 'key_name': '2017-10-29', 'value': 0}]}, 'org.creation.content[@status=review].count': {'name': 'Review', 'split': 'content.reviewed_on', 'group_id': 'org.content.count', 'buckets': [{'key': 1508697000000, 'key_name': '2017-10-23', 'value': 0}, {'key': 1508783400000, 'key_name': '2017-10-24', 'value': 2}, {'key': 1508869800000, 'key_name': '2017-10-25', 'value': 3}, {'key': 1508956200000, 'key_name': '2017-10-26', 'value': 3}, {'key': 1509042600000, 'key_name': '2017-10-27', 'value': 3}, {'key': 1509129000000, 'key_name': '2017-10-28', 'value': 0}, {'key': 1509215400000, 'key_name': '2017-10-29', 'value': 0}]}, 'org.creation.content[@status=published].count': {'name': 'Live', 'split': 'content.published_on', 'group_id': 'org.content.count', 'buckets': [{'key': 1508697000000, 'key_name': '2017-10-23', 'value': 0}, {'key': 1508783400000, 'key_name': '2017-10-24', 'value': 14}, {'key': 1508869800000, 'key_name': '2017-10-25', 'value': 7}, {'key': 1508956200000, 'key_name': '2017-10-26', 'value': 2}, {'key': 1509042600000, 'key_name': '2017-10-27', 'value': 3}, {'key': 1509129000000, 'key_name': '2017-10-28', 'value': 0}, {'key': 1509215400000, 'key_name': '2017-10-29', 'value': 0}]}}, 'snapshot': {'org.creation.content.count': {'name': 'Number of contents created', 'value': 47}, 'org.creation.authors.count': {'name': 'Number of authors', 'value': 6}, 'org.creation.reviewers.count': {'name': 'Number of reviewers', 'value': 2}, 'org.creation.content[@status=draft].count': {'name': 'Number of content items created', 'value': 47}, 'org.creation.content[@status=review].count': {'name': 'Number of content items reviewed', 'value': 11}, 'org.creation.content[@status=published].count': {'name': 'Number of content items published', 'value': 26}}}}   // eslint-disable-line
  }
}
