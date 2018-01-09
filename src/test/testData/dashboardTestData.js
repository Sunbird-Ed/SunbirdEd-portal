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
    orgSearchSuccess: { 'id': 'api.org.search', 'ver': 'v1', 'ts': '2018-01-02 11:47:10:719+0000', 'params': { 'resmsgid': null, 'msgid': 'a3f0aa32-75e8-489b-9646-837421892c31', 'err': null, 'status': 'success', 'errmsg': null }, 'responseCode': 'OK', 'result': { 'response': { 'count': 4, 'content': [{ 'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'EKSTEP Corporation', 'updatedDate': null, 'addressId': '0123131141138350081', 'orgType': 'Training', 'provider': null, 'orgCode': 'ABCL', 'theme': null, 'id': '0123131115383275520', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '0123131115383275520', 'thumbnail': null, 'orgName': 'EKSTEP Corporation', 'updatedBy': null, 'address': { 'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-18 13:59:28:684+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '0123131141138350081', 'state': 'TN' }, 'externalId': null, 'isRootOrg': true, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"email":"test@test.com","phone":"213124234234"},{"email":"test1@test.com","phone":"+91213124234234"}]', 'createdDate': '2017-08-18 13:59:28:684+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '0123131115383275520', 'noOfMembers': 1, 'status': null }, { 'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'ABC Corporation', 'updatedDate': '2017-09-04 10:44:30:921+0000', 'addressId': '01230654297501696027', 'orgType': 'Training', 'provider': null, 'orgCode': 'ABCL', 'theme': null, 'id': '01230654824904294426', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '01230654824904294426', 'thumbnail': null, 'orgName': 'ABC Corporation', 'updatedBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'address': { 'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-09 07:20:29:343+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '01230654297501696027', 'state': 'TN' }, 'externalId': null, 'isRootOrg': false, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': null, 'createdDate': '2017-08-09 07:20:29:342+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '01230654824904294426', 'noOfMembers': 1, 'status': null }, { 'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': 'ROOT_ORG', 'description': 'Sunbird', 'updatedDate': '2017-08-24 06:02:10:846+0000', 'addressId': null, 'orgType': null, 'provider': null, 'orgCode': 'sunbird', 'theme': null, 'id': 'ORG_001', 'communityId': null, 'isApproved': null, 'slug': 'sunbird', 'identifier': 'ORG_001', 'thumbnail': null, 'orgName': 'Sunbird', 'updatedBy': 'user1', 'externalId': null, 'isRootOrg': true, 'rootOrgId': null, 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': '[{"phone":"213124234234","email":"test@test.com"},{"phone":"+91213124234234","email":"test1@test.com"}]', 'createdDate': null, 'createdBy': null, 'parentOrgId': null, 'hashTagId': 'b00bc992ef25f1a9a8d63291e20efc8d', 'noOfMembers': 1, 'status': null }, { 'dateTime': null, 'preferredLanguage': 'English', 'approvedBy': null, 'channel': null, 'description': 'NTP Content Create Testing', 'updatedDate': null, 'addressId': '0123150128754360327', 'orgType': 'Training', 'provider': null, 'orgCode': 'NCCT', 'theme': null, 'id': '0123150108807004166', 'communityId': null, 'isApproved': null, 'slug': null, 'identifier': '0123150108807004166', 'thumbnail': null, 'orgName': 'NTP Content Create Testing', 'updatedBy': null, 'address': { 'country': 'India', 'updatedBy': null, 'city': 'Chennai', 'updatedDate': null, 'userId': null, 'zipcode': '45678', 'addType': null, 'createdDate': '2017-08-21 06:26:13:394+0000', 'isDeleted': null, 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'addressLine1': null, 'addressLine2': null, 'id': '0123150128754360327', 'state': 'TN' }, 'externalId': null, 'isRootOrg': false, 'rootOrgId': 'ORG_001', 'approvedDate': null, 'imgUrl': null, 'homeUrl': null, 'isDefault': null, 'contactDetail': null, 'createdDate': '2017-08-21 06:26:13:393+0000', 'createdBy': 'e9280b815c0e41972bf754e9409b66d778b8e11bb91844892869a1e828d7d2f2a', 'parentOrgId': null, 'hashTagId': '0123150108807004166', 'noOfMembers': 1, 'status': null }] } } }, // eslint-disable-line
    orgSearchFailure: { 'id': 'api.org.search', 'ver': 'v1', 'ts': '2018-01-02 11:47:10:719+0000', 'params': { 'resmsgid': null, 'msgid': 'a3f0aa32-75e8-489b-9646-837421892c31', 'err': null, 'status': 'error', 'errmsg': null }, 'responseCode': 'Fail' }, // eslint-disable-line
    creationResponse: { 'id': 'api.sunbird.dashboard.org.creation', 'ver': 'v1', 'ts': '2017-10-30 09:00:34:779+0000', 'params': { 'resmsgid': null, 'msgid': '8e27cbf5-e299-43b0-bca7-8347f7e5abcf', 'err': null, 'status': 'success', 'errmsg': null }, 'responseCode': 'OK', 'result': { 'period': '7d', 'org': { 'orgName': 'Consumption Org', 'orgId': '01232002070124134414' }, 'series': { 'org.creation.content[@status=draft].count': { 'name': 'Draft', 'split': 'content.created_on', 'group_id': 'org.content.count', 'buckets': [{ 'key': 1508697000000, 'key_name': '2017-10-23', 'value': 0 }, { 'key': 1508783400000, 'key_name': '2017-10-24', 'value': 12 }, { 'key': 1508869800000, 'key_name': '2017-10-25', 'value': 4 }, { 'key': 1508956200000, 'key_name': '2017-10-26', 'value': 8 }, { 'key': 1509042600000, 'key_name': '2017-10-27', 'value': 23 }, { 'key': 1509129000000, 'key_name': '2017-10-28', 'value': 0 }, { 'key': 1509215400000, 'key_name': '2017-10-29', 'value': 0 }] }, 'org.creation.content[@status=review].count': { 'name': 'Review', 'split': 'content.reviewed_on', 'group_id': 'org.content.count', 'buckets': [{ 'key': 1508697000000, 'key_name': '2017-10-23', 'value': 0 }, { 'key': 1508783400000, 'key_name': '2017-10-24', 'value': 2 }, { 'key': 1508869800000, 'key_name': '2017-10-25', 'value': 3 }, { 'key': 1508956200000, 'key_name': '2017-10-26', 'value': 3 }, { 'key': 1509042600000, 'key_name': '2017-10-27', 'value': 3 }, { 'key': 1509129000000, 'key_name': '2017-10-28', 'value': 0 }, { 'key': 1509215400000, 'key_name': '2017-10-29', 'value': 0 }] }, 'org.creation.content[@status=published].count': { 'name': 'Live', 'split': 'content.published_on', 'group_id': 'org.content.count', 'buckets': [{ 'key': 1508697000000, 'key_name': '2017-10-23', 'value': 0 }, { 'key': 1508783400000, 'key_name': '2017-10-24', 'value': 14 }, { 'key': 1508869800000, 'key_name': '2017-10-25', 'value': 7 }, { 'key': 1508956200000, 'key_name': '2017-10-26', 'value': 2 }, { 'key': 1509042600000, 'key_name': '2017-10-27', 'value': 3 }, { 'key': 1509129000000, 'key_name': '2017-10-28', 'value': 0 }, { 'key': 1509215400000, 'key_name': '2017-10-29', 'value': 0 }] } }, 'snapshot': { 'org.creation.content.count': { 'name': 'Number of contents created', 'value': 47 }, 'org.creation.authors.count': { 'name': 'Number of authors', 'value': 6 }, 'org.creation.reviewers.count': { 'name': 'Number of reviewers', 'value': 2 }, 'org.creation.content[@status=draft].count': { 'name': 'Number of content items created', 'value': 47 }, 'org.creation.content[@status=review].count': { 'name': 'Number of content items reviewed', 'value': 11 }, 'org.creation.content[@status=published].count': { 'name': 'Number of content items published', 'value': 26 } } } } // eslint-disable-line
  },
  courseConsumption: {
    searchSuccess: { 'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-10-03T07:28:19.590Z', 'params': { 'resmsgid': '6df47260-a80c-11e7-957c-fd247bccbccc', 'msgid': '6def1b30-a80c-11e7-8721-cf66ba49ca1b', 'status': 'successful', 'err': null, 'errmsg': null }, 'responseCode': 'OK', 'result': { 'count': 12, 'content': [{ 'code': 'do_2123248512249446401377', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['Bengali'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-04T04:14:00.545+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-27T11:23:23.893+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_2123248512249446401377', 'createdFor': ['01231515334617497640', 'ORG_001'], 'creator': 'Content Creator For Demo', 'audience': ['Instructor'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1504498440545', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled Course', 'IL_UNIQUE_ID': 'do_2123248512249446401377', 'status': 'Draft', 'node_id': 65679, 'appIcon': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_20051864/artifact/a2b1d5cf96ad28f15e79df61dbb21fdf_1478083821843.jpeg', 'keywords': [], 'description': 'Untitled Course', 'faculty': [], 'tutor': [], 'children': ['do_2122162678233579521298'], 'es_metadata_id': 'do_2123248512249446401377' }, { 'code': 'org.sunbird.N1aCB2', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-09-06T07:31:20.161+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-09-06T07:31:20.161+0000', 'contentEncoding': 'gzip', 'contentType': 'LessonPlan', 'identifier': 'do_212326363792678912135', 'createdFor': ['01231515334617497640', 'ORG_001'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1504683080161', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Untitled lesson plan', 'IL_UNIQUE_ID': 'do_212326363792678912135', 'status': 'Draft', 'node_id': 66259, 'es_metadata_id': 'do_212326363792678912135' }, { 'subject': 'Hindi', 'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123165408517406721432/lessonws_1503484120499_do_2123165408517406721432_1.0.ecar', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'variants': '{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123165408517406721432/lessonws_1503484120567_do_2123165408517406721432_1.0_spine.ecar","size":972.0}}', 'mimeType': 'application/vnd.ekstep.ecml-archive', 'editorState': '{"plugin":{"noOfExtPlugins":2,"extPlugins":[{"plugin":"org.ekstep.contenteditorfunctions","version":"1.0"},{"plugin":"org.ekstep.keyboardshortcuts","version":"1.0"}]},"stage":{"noOfStages":1,"currentStage":"06e3b358-217b-441d-932a-543e81993478","selectedPluginObject":"106dbb78-e8db-4c9d-a4d3-47c4c60e9ad1"},"sidebar":{"selectedMenu":"settings"}}', 'objectType': 'Content', 'gradeLevel': ['Kindergarten'], 'appId': 'sunbird_portal', 'contentEncoding': 'gzip', 'artifactUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123165408517406721432/artifact/1503484120416_do_2123165408517406721432.zip', 'contentType': 'Worksheet', 'lastUpdatedBy': 'kiran', 'identifier': 'do_2123165408517406721432', 'audience': ['Learner'], 'visibility': 'Default', 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'lastPublishedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'prevState': 'Review', 'size': 1738, 'lastPublishedOn': '2017-08-23T10:28:40.499+0000', 'IL_FUNC_OBJECT_TYPE': 'ContentImage', 'name': 'LessonWS', 'status': 'Draft', 'code': 'org.sunbird.UMOHOj', 'flags': [''], 'description': 'dessd', 'lastFlaggedOn': '2017-08-23T13:00:32.655+0000', 'medium': 'Hindi', 'flaggedBy': ['kiran'], 'idealScreenSize': 'normal', 'createdOn': '2017-09-01T06:53:19.462+0000', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-30T11:16:51.432+0000', 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-08-23T10:28:40.824+0000', 'creator': 'Content Creator For Demo', 'createdFor': ['01231515334617497640'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'os': ['All'], 'pkgVersion': 1, 'versionKey': '1504248799462', 'idealScreenDensity': 'hdpi', 's3Key': 'ecar_files/do_2123165408517406721432/lessonws_1503484120499_do_2123165408517406721432_1.0.ecar', 'lastSubmittedOn': '2017-08-23T10:27:32.257+0000', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 2, 'IL_UNIQUE_ID': 'do_2123165408517406721432.img', 'node_id': 64074, 'es_metadata_id': 'do_2123165408517406721432' }, { 'code': 'org.sunbird.gXscLI', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-29T06:34:34.044+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-29T06:34:34.044+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_2123206735793766401725', 'createdFor': ['01231515334617497640'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503988474044', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'c', 'IL_UNIQUE_ID': 'do_2123206735793766401725', 'status': 'Draft', 'node_id': 62475, 'es_metadata_id': 'do_2123206735793766401725' }, { 'code': 'org.sunbird.tzhykP', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-29T06:29:32.429+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-29T06:29:32.429+0000', 'contentEncoding': 'gzip', 'contentType': 'Collection', 'identifier': 'do_2123206711085465601719', 'createdFor': ['01231515334617497640'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503988172429', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Collection1', 'IL_UNIQUE_ID': 'do_2123206711085465601719', 'status': 'Draft', 'node_id': 62469, 'es_metadata_id': 'do_2123206711085465601719' }, { 'code': 'org.sunbird.TDr4Ms', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-29T06:27:27.179+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-29T06:27:27.179+0000', 'contentEncoding': 'gzip', 'contentType': 'Collection', 'identifier': 'do_2123206700824985601716', 'createdFor': ['01231515334617497640'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503988047179', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'c1', 'IL_UNIQUE_ID': 'do_2123206700824985601716', 'status': 'Draft', 'node_id': 62466, 'es_metadata_id': 'do_2123206700824985601716' }, { 'code': 'org.sunbird.jH2Zfu', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.ecml-archive', 'idealScreenSize': 'normal', 'createdOn': '2017-08-29T05:49:34.205+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-29T05:49:55.173+0000', 'contentEncoding': 'gzip', 'contentType': 'Story', 'identifier': 'do_2123206514622873601693', 'createdFor': ['01231515334617497640'], 'creator': 'Content Creator For Demo', 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503985795173', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 2, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'qwerr', 'IL_UNIQUE_ID': 'do_2123206514622873601693', 'status': 'Draft', 'node_id': 0, 'lastUpdatedBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'editorState': '{"plugin":{"noOfExtPlugins":2,"extPlugins":[{"plugin":"org.ekstep.contenteditorfunctions","version":"1.0"},{"plugin":"org.ekstep.keyboardshortcuts","version":"1.0"}]},"stage":{"noOfStages":1,"currentStage":"183b161c-0d8d-4306-9007-d8b59c682c9c","selectedPluginObject":"017bcb32-81ac-4aa8-820b-ad2537a39586"},"sidebar":{"selectedMenu":"settings"}}', 'me_totalTimespent': 5.75, 'me_totalInteractions': 8, 'me_totalSessionsCount': 2, 'me_averageInteractionsPerMin': 83.48, 'me_averageTimespentPerSession': 2.88, 'me_totalDevices': 1, 'me_averageSessionsPerDevice': 2, 'es_metadata_id': 'do_2123206514622873601693' }, { 'subject': 'MATHS', 'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123165236346716161426/ayubbasha_23082017_1_1503482047537_do_2123165236346716161426_1.0.ecar', 'channel': '8668ff9d9571e4f31cf1b5ff633f0a8e', 'language': ['English', 'Bengali'], 'variants': '{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123165236346716161426/ayubbasha_23082017_1_1503482047768_do_2123165236346716161426_1.0_spine.ecar","size":175856.0}}', 'mimeType': 'application/vnd.ekstep.content-collection', 'objectType': 'Content', 'gradeLevel': ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'], 'appId': 'ntp_portal', 'contentEncoding': 'gzip', 'mimeTypesCount': '{"application/vnd.ekstep.ecml-archive":2}', 'contentType': 'Collection', 'lastUpdatedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'identifier': 'do_2123165236346716161426', 'audience': ['Learner'], 'visibility': 'Default', 'toc_url': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123165236346716161426/artifact/do_2123165236346716161426toc.json', 'contentTypesCount': '{"Story":2}', 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'ageGroup': ['6-7', '7-8', '>10', '5-6', '8-10'], 'osId': 'org.ekstep.quiz.app', 'lastPublishedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'prevState': 'Review', 'size': 180281, 'lastPublishedOn': '2017-08-23T09:54:06.790+0000', 'IL_FUNC_OBJECT_TYPE': 'ContentImage', 'domain': ['numeracy'], 'name': 'AyubBasha_23082017_1', 'status': 'Draft', 'code': 'org.sunbird.N0DNaM', 'description': 'Test', 'medium': 'Bengali', 'idealScreenSize': 'normal', 'createdOn': '2017-09-01T12:12:41.094+0000', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-23T09:54:35.664+0000', 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-08-23T09:54:08.020+0000', 'creator': 'Content Creator For Demo', 'createdFor': ['01231515334617497640'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'os': ['All'], 'pkgVersion': 1, 'versionKey': '1504267961094', 'idealScreenDensity': 'hdpi', 's3Key': 'ecar_files/do_2123165236346716161426/ayubbasha_23082017_1_1503482047537_do_2123165236346716161426_1.0.ecar', 'lastSubmittedOn': '2017-08-23T09:53:14.226+0000', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'leafNodesCount': 2, 'compatibilityLevel': 1, 'IL_UNIQUE_ID': 'do_2123165236346716161426.img', 'node_id': 64239, 'children': ['do_2123144659903447041157', 'do_2122162678233579521298'], 'es_metadata_id': 'do_2123165236346716161426' }, { 'code': 'org.sunbird.p6iKhl', 'channel': 'b00bc992ef25f1a9a8d63291e20efc8d', 'description': 'Test1', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-23T09:49:59.535+0000', 'objectType': 'Content', 'appId': 'sunbird_portal', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-23T09:49:59.535+0000', 'contentEncoding': 'gzip', 'contentType': 'Collection', 'identifier': 'do_2123165229017907201425', 'creator': 'Content Creator For Demo', 'createdFor': ['01231515334617497640'], 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1503481799535', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 1, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'AyubBasha_23082017', 'IL_UNIQUE_ID': 'do_2123165229017907201425', 'status': 'Draft', 'node_id': 60895, 'es_metadata_id': 'do_2123165229017907201425' }] } }, // eslint-disable-line

    courseConsumptionSuccess: { 'id': 'api.sunbird.dashboard.course.consumption', 'ver': 'v1', 'ts': '2017-10-03 11:19:16:644+0000', 'params': { 'resmsgid': null, 'msgid': '640e8d44-f86b-4fef-8a64-c270da84c818', 'err': null, 'status': 'success', 'errmsg': null }, 'responseCode': 'OK', 'result': { 'period': '7d', 'series': { 'course.consumption.time_spent': { 'name': 'Timespent for content consumption', 'split': 'content.sum(time_spent)', 'time_unit': 'seconds', 'group_id': 'course.timespent.sum', 'buckets': [{ 'key': 1506424756638, 'key_name': '2017-09-26', 'value': 0.0 }, { 'key': 1506511156638, 'key_name': '2017-09-27', 'value': 0.0 }, { 'key': 1506597556638, 'key_name': '2017-09-28', 'value': 0.0 }, { 'key': 1506683956638, 'key_name': '2017-09-29', 'value': 0.0 }, { 'key': 1506770356638, 'key_name': '2017-09-30', 'value': 0.0 }, { 'key': 1506856756638, 'key_name': '2017-10-01', 'value': 0.0 }, { 'key': 1506943156638, 'key_name': '2017-10-02', 'value': 0.0 }] }, 'course.consumption.content.users.count': { 'name': 'Number of users by day', 'split': 'content.users.count', 'group_id': 'course.users.count', 'buckets': [{ 'key': 1506424756638, 'key_name': '2017-09-26', 'value': 0 }, { 'key': 1506511156638, 'key_name': '2017-09-27', 'value': 0 }, { 'key': 1506597556638, 'key_name': '2017-09-28', 'value': 0 }, { 'key': 1506683956638, 'key_name': '2017-09-29', 'value': 0 }, { 'key': 1506770356638, 'key_name': '2017-09-30', 'value': 0 }, { 'key': 1506856756638, 'key_name': '2017-10-01', 'value': 0 }, { 'key': 1506943156638, 'key_name': '2017-10-02', 'value': 0 }] } }, 'course': { 'courseId': 'do_2123207409836441601760' }, 'snapshot': { 'course.consumption.time_spent.count': { 'name': 'Total time of Content consumption', 'time_unit': 'seconds', 'value': 0.0 }, 'course.consumption.time_per_user': { 'name': 'User access course over time', 'value': 0 }, 'course.consumption.users_completed': { 'name': 'Total users completed the course', 'value': 0 }, 'course.consumption.time_spent_completion_count': { 'name': 'Average time per user for course completion', 'value': 0, 'time_unit': 'seconds' } } } }, // eslint-disable-line

    invalidResponse: { 'id': 'api.sunbird.dashboard.course.consumption', 'ver': 'v1', 'ts': '2017-10-03 09:56:29:830+0000', 'params': { 'resmsgid': null, 'msgid': '7637746d-a948-4c32-93a9-a384fb9608a4', 'err': 'UNAUTHORIZE_USER', 'status': 'SERVER_ERROR', 'errmsg': 'You are not authorized.' }, 'responseCode': 'CLIENT_ERROR', 'result': {} }, // eslint-disable-line

    failedCourseConsumptionResponse: { 'id': 'api.sunbird.dashboard.course.consumption', 'ver': 'v1', 'ts': '2017-10-03 09:56:29:830+0000', 'params': { 'resmsgid': null, 'msgid': '7637746d-a948-4c32-93a9-a384fb9608a4', 'err': 'UNAUTHORIZE_USER', 'status': 'SERVER_ERROR', 'errmsg': 'You are not authorized.' }, 'responseCode': 'CLIENT_ERROR', 'result': {} }, // eslint-disable-line

    oneCourseCreatedByMeResponse: { 'id': 'api.v1.search', 'ver': '1.0', 'ts': '2017-10-03T12:20:42.847Z', 'params': { 'resmsgid': '468d06f0-a835-11e7-9540-dd4c0ac7eb23', 'msgid': '4686c560-a835-11e7-bd6c-9d0ff4b0760f', 'status': 'successful', 'err': null, 'errmsg': null }, 'responseCode': 'OK', 'result': { 'count': 11, 'content': [{ 'code': 'org.sunbird.lsE3WP', 'channel': 'in.ekstep', 'description': 'Prod2', 'language': ['English'], 'mimeType': 'application/vnd.ekstep.content-collection', 'idealScreenSize': 'normal', 'createdOn': '2017-08-30T10:23:53.418+0000', 'objectType': 'Content', 'contentDisposition': 'inline', 'lastUpdatedOn': '2017-08-30T10:26:09.993+0000', 'contentEncoding': 'gzip', 'contentType': 'Course', 'identifier': 'do_2123214940849602561867', 'creator': 'Content Creator For Demo', 'createdFor': ['01231515334617497640'], 'audience': ['Learner'], 'IL_SYS_NODE_TYPE': 'DATA_NODE', 'visibility': 'Default', 'os': ['All'], 'consumerId': 'fa271a76-c15a-4aa1-adff-31dd04682a1f', 'mediaType': 'content', 'osId': 'org.ekstep.quiz.app', 'graph_id': 'domain', 'nodeType': 'DATA_NODE', 'versionKey': '1504088769993', 'idealScreenDensity': 'hdpi', 'createdBy': 'fcc60c6f-578e-4c5e-8257-6eaca81fb62b', 'compatibilityLevel': 4, 'IL_FUNC_OBJECT_TYPE': 'Content', 'name': 'Prod2', 'IL_UNIQUE_ID': 'do_2123214940849602561867', 'status': 'Live', 'node_id': 0, 'children': ['do_2122952599231856641325'], 'lastSubmittedOn': '2017-08-30T10:24:19.668+0000', 'lastUpdatedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'lastPublishedBy': 'be9e7184-dffd-45af-9e3c-147fdf2c771d', 'downloadUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123214940849602561867/prod2_1504088740705_do_2123214940849602561867_1.0.ecar', 'variants': '{"spine":{"ecarUrl":"https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/ecar_files/do_2123214940849602561867/prod2_1504088741507_do_2123214940849602561867_1.0_spine.ecar","size":1430.0}}', 'pkgVersion': 1, 'prevState': 'Review', 's3Key': 'ecar_files/do_2123214940849602561867/prod2_1504088740705_do_2123214940849602561867_1.0.ecar', 'size': 4611516, 'lastPublishedOn': '2017-08-30T10:25:40.151+0000', 'SYS_INTERNAL_LAST_UPDATED_ON': '2017-08-30T10:25:41.642+0000', 'toc_url': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123214940849602561867/artifact/do_2123214940849602561867toc.json', 'contentTypesCount': '{"Story":1}', 'leafNodesCount': 1, 'mimeTypesCount': '{"application/vnd.ekstep.ecml-archive":1}', 'me_averageRating': 0, 'me_totalSideloads': 0, 'me_totalDownloads': 2, 'me_totalComments': 0, 'me_totalRatings': 0, 'es_metadata_id': 'do_2123214940849602561867' }] } }, // eslint-disable-line

    zeroContentCreatedByMe: {
      id: 'api.v1.search',
      ver: '1.0',
      ts: '2017-09-22T11:42:07.455Z',
      params: {
        resmsgid: '0fecfef0-9f8b-11e7-b050-d9109721da9d',
        msgid: null,
        status: 'successful',
        err: null,
        errmsg: null
      },
      responseCode: 'OK',
      result: { count: 0, content: [] }
    }
  },
  courseProgress: {
    getMyBatchesList: {
      'id': null,
      'ver': 'v1',
      'ts': '2018-01-09 08:58:16:666+0000',
      'params': {
        'resmsgid': null,
        'msgid': 'fcbed63b-312d-4c9f-9598-77e2620274f3',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'response': {
          'count': 2,
          'content': [{
            'identifier': '01240505557369651216',
            'createdFor': ['ORG_001'],
            'courseAdditionalInfo': {
              'courseName': '1014 Retest',
              'leafNodesCount': '2',
              'description': 'dsfdsf',
              'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212390847580487680138/artifact/download_1509775738408.thumb.jpg',
              'tocUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212390847580487680138/artifact/do_212390847580487680138toc.json',
              'status': 'Live'
            },
            'endDate': '2018-01-31',
            'description': 'bangalore days',
            'countIncrementDate': '2017-12-26 12:00:00:949+0000',
            'countDecrementDate': null,
            'updatedDate': '2017-12-26 12:00:00:949+0000',
            'participant': {
              'c6f02b71-4ef6-4450-96f8-0d173f67f33f': true,
              '55fefcb5-c602-4190-863a-40c8c21104a0': true,
              '2a6bde34-0e89-4182-b717-fe6d8faf849f': true,
              'ac918519-f8b8-4150-bd90-56ead42454d0': true
            },
            'countIncrementStatus': true,
            'createdDate': '2017-12-26 11:34:06:783+0000',
            'createdBy': '63b0870c-f370-4f96-842d-f6a7fa2db1df',
            'courseCreator': '4c4530df-0d4f-42a5-bd91-0366716c8c24',
            'hashTagId': '01240505557369651216',
            'mentors': [],
            'name': 'bangalore days',
            'countDecrementStatus': false,
            'id': '01240505557369651216',
            'enrollmentType': 'invite-only',
            'courseId': 'do_212390847580487680138',
            'startDate': '2017-12-26',
            'status': 1
          }, {
            'identifier': '01240504782578483214',
            'createdFor': ['ORG_001'],
            'courseAdditionalInfo': {
              'courseName': '1014 Retest',
              'leafNodesCount': '2',
              'description': 'dsfdsf',
              'courseLogoUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212390847580487680138/artifact/download_1509775738408.thumb.jpg',
              'tocUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_212390847580487680138/artifact/do_212390847580487680138toc.json',
              'status': 'Live'
            },
            'endDate': '2017-12-29',
            'description': 'rajkumar',
            'countIncrementDate': '2017-12-27 00:00:00:385+0000',
            'countDecrementDate': '2017-12-30 00:00:03:532+0000',
            'updatedDate': '2017-12-30 00:00:03:532+0000',
            'participant': {
              'c6f02b71-4ef6-4450-96f8-0d173f67f33f': true,
              '2a6bde34-0e89-4182-b717-fe6d8faf849f': true
            },
            'countIncrementStatus': true,
            'createdDate': '2017-12-26 11:32:39:890+0000',
            'createdBy': '63b0870c-f370-4f96-842d-f6a7fa2db1df',
            'courseCreator': '4c4530df-0d4f-42a5-bd91-0366716c8c24',
            'hashTagId': '01240504782578483214',
            'mentors': [],
            'name': 'rajkumar',
            'countDecrementStatus': true,
            'id': '01240504782578483214',
            'enrollmentType': 'invite-only',
            'courseId': 'do_212390847580487680138',
            'startDate': '2017-12-27',
            'status': 2
          }]
        }
      }
    },
    getMyBatch: {
      'id': null,
      'ver': 'v1',
      'ts': '2018-01-09 09:10:36:447+0000',
      'params': {
        'resmsgid': null,
        'msgid': '1ef2935c-20cf-4a52-83ef-31e4efdcf6f0',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'response': {
          'count': 1,
          'content': [{
            'identifier': '0124147958692249604',
            'createdFor': ['ORG_001'],
            'courseAdditionalInfo': {
              'courseName': '23082017 Course 1',
              'leafNodesCount': '1',
              'description': 'Test content uploaded by Creator user',
              'courseLogoUrl': '',
              'tocUrl': 'https://ekstep-public-qa.s3-ap-south-1.amazonaws.com/content/do_2123163336542617601352/artifact/do_2123163336542617601352toc.json',
              'status': 'Live'
            },
            'endDate': '2018-02-15',
            'countIncrementDate': '2018-01-09 08:00:01:858+0000',
            'description': null,
            'countDecrementDate': null,
            'updatedDate': '2018-01-09 08:00:01:858+0000',
            'participant': {
              'c6f02b71-4ef6-4450-96f8-0d173f67f33f': true,
              '2fa5ba9c-6048-4975-a469-9f2632fea1eb': true,
              '9d76c081-fbf6-45e0-adb7-64013fe41a64': true,
              '15dedad5-1332-4618-824f-63d859a662fd': true,
              '55fefcb5-c602-4190-863a-40c8c21104a0': true,
              '2a6bde34-0e89-4182-b717-fe6d8faf849f': true,
              '09b9e982-8633-4023-8843-e636d0cf11e9': true,
              'ac918519-f8b8-4150-bd90-56ead42454d0': true
            },
            'countIncrementStatus': true,
            'createdDate': '2018-01-09 06:01:32:411+0000',
            'createdBy': '63b0870c-f370-4f96-842d-f6a7fa2db1df',
            'courseCreator': 'ebec55da-7bd5-4e48-b895-34630e16975f',
            'hashTagId': '0124147958692249604',
            'mentors': [],
            'name': 'Test 1',
            'countDecrementStatus': false,
            'id': '0124147958692249604',
            'enrollmentType': 'invite-only',
            'courseId': 'do_2123163336542617601352',
            'startDate': '2018-01-09',
            'status': 1
          }]
        }
      }
    },
    getBatchDetailsSuccessData: {
      'id': 'api.sunbird.dashboard.course.admin',
      'ver': 'v1',
      'ts': '2018-01-09 10:38:59:773+0000',
      'params': {
        'resmsgid': null,
        'msgid': '3e400245-a4cf-4733-bccf-eb0e94a19af8',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'period': '5w',
        'series': {
          'course.progress.users_enrolled.count': {
            'name': 'List of users enrolled for the course',
            'split': 'content.sum(time_spent)',
            'buckets': [{
              'userName': 'vijethanayak',
              'user': '55fefcb5-c602-4190-863a-40c8c21104a0'
            }, {
              'userName': 'sanvijna9',
              'user': '2a6bde34-0e89-4182-b717-fe6d8faf849f'
            }, {
              'userName': 'usernov17',
              'user': 'ac918519-f8b8-4150-bd90-56ead42454d0'
            }, {
              'userName': 'arvind12745.yadav127',
              'user': 'c6f02b71-4ef6-4450-96f8-0d173f67f33f'
            }]
          },
          'course.progress.course_progress_per_user.count': {
            'name': 'List of users enrolled for the course',
            'split': 'content.sum(time_spent)',
            'buckets': [{
              'enrolledOn': '2017-12-26 11:34:07:201+0000',
              'lastAccessTime': '2017-12-26 11:34:07:201+0000',
              'org': null,
              'progress': 0,
              'batchEndsOn': '2018-01-31',
              'userName': 'usernov17',
              'user': 'ac918519-f8b8-4150-bd90-56ead42454d0'
            }, {
              'enrolledOn': '2017-12-26 11:34:07:234+0000',
              'lastAccessTime': '2017-12-26 11:34:07:233+0000',
              'org': null,
              'progress': 0,
              'batchEndsOn': '2018-01-31',
              'userName': 'vijethanayak',
              'user': '55fefcb5-c602-4190-863a-40c8c21104a0'
            }, {
              'enrolledOn': '2017-12-26 11:34:07:211+0000',
              'lastAccessTime': '2017-12-26 11:34:07:211+0000',
              'org': 'Sunbird',
              'progress': 0,
              'batchEndsOn': '2018-01-31',
              'userName': 'arvind12745.yadav127',
              'user': 'c6f02b71-4ef6-4450-96f8-0d173f67f33f'
            }, {
              'enrolledOn': '2017-12-26 11:34:07:222+0000',
              'lastAccessTime': '2017-12-26 11:34:07:222+0000',
              'org': 'Sunbird',
              'progress': 0,
              'batchEndsOn': '2018-01-31',
              'userName': 'sanvijna9',
              'user': '2a6bde34-0e89-4182-b717-fe6d8faf849f'
            }]
          }
        }
      }
    },
    downloadReportResponse: {
      'id': 'api.sunbird.dashboard.course.admin',
      'ver': 'v1',
      'ts': '2018-01-09 10:27:32:302+0000',
      'params': {
        'resmsgid': null,
        'msgid': '5bc0b88c-e717-40cf-a9f7-6f2eb6561b43',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'requestId': '01241492595416268812'
      }
    }
  }
}
