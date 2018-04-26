export const mockRes = {
    conceptData: {
      'id': 'api.v1.search',
      'ver': '1.0',
      'ts': '2018-04-23T15:08:27.918Z',
      'params': {
        'resmsgid': '2d3e7ae0-4708-11e8-b10f-411864e4cde7',
        'msgid': '2d321ed0-4708-11e8-a1f8-67cddbb881dd',
        'status': 'successful',
        'err': null,
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'concepts': [
          {
            'identifier': 'C532',
            'code': 'C532',
            'keywords': [
              'Funtoot',
              'Misconception'
            ],
            'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
            'subject': 'numeracy',
            'channel': 'in.ekstep',
            'description': 'Understand where ver (not write it in the sum) e.g. 25+7=212 instead of 32',
            'graph_id': 'domain',
            'nodeType': 'DATA_NODE',
            'createdOn': '2016-06-30T11:45:48.108+0000',
            'versionKey': '1496662627673',
            'objectType': 'Concept',
            'appId': 'dev.ekstep.in',
            'name': 'Write number being carried over on the next column',
            'lastUpdatedOn': '2017-06-05T11:37:07.673+0000',
            'GradeLevel': 'Grade 2',
            'status': 'Live',
            'node_id': 91072
          },
          {
            'identifier': 'C249',
            'code': 'C249',
            'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
            'subject': 'numeracy',
            'channel': 'in.ekstep',
            'description': 'Write numbers vertically for addition',
            'graph_id': 'domain',
            'nodeType': 'DATA_NODE',
            'createdOn': '2016-06-30T11:45:48.108+0000',
            'versionKey': '1496662627546',
            'objectType': 'Concept',
            'appId': 'dev.ekstep.in',
            'name': 'Write numbers vertically for addition',
            'lastUpdatedOn': '2017-06-05T11:37:07.546+0000',
            'status': 'Live',
            'node_id': 91071
          }
        ],
        'count': 2
      }
    },
    domainData: {
      'id': 'api.v1.search',
      'ver': '1.0',
      'ts': '2018-04-23T15:08:30.324Z',
      'params': {
        'resmsgid': '2ead9b40-4708-11e8-b10f-411864e4cde7',
        'msgid': '2ea2ece0-4708-11e8-a1f8-67cddbb881dd',
        'status': 'successful',
        'err': null,
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'count': 32,
        'domains': [
          {
            'identifier': 'AI',
            'code': 'AI',
            'keywords': [
              'Subject',
              'AI'
            ],
            'subject': 'Artificial_Intelligence',
            'consumerId': '72e54829-6402-4cf0-888e-9b30733c1b88',
            'channel': 'in.ekstep',
            'graph_id': 'domain',
            'nodeType': 'DATA_NODE',
            'createdOn': '2018-02-28T13:17:58.507+0000',
            'versionKey': '1519823878507',
            'objectType': 'Domain',
            'children': [
              'AI1',
              'AI3',
              'AI4',
              'AI2'
            ],
            'appId': 'ekstep_portal',
            'name': 'Artificial_Intelligence',
            'lastUpdatedOn': '2018-02-28T13:17:58.507+0000',
            'status': 'Live',
            'node_id': 31087
          }
        ],
        'dimensions': [
          {
            'identifier': 'SD1',
            'parent': [
              'science'
            ],
            'code': 'SD1',
            'keywords': [
              'Dimension'
            ],
            'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
            'subject': 'science',
            'channel': 'in.ekstep',
            'description': 'Physics',
            'graph_id': 'domain',
            'nodeType': 'DATA_NODE',
            'createdOn': '2016-12-05T13:27:42.934+0530',
            'versionKey': '1496769637626',
            'objectType': 'Dimension',
            'Language': 'English',
            'children': [
              'SC1',
              'SC2',
              'SC3',
              'SC4'
            ],
            'appId': 'dev.ekstep.in',
            'name': 'Physics',
            'lastUpdatedOn': '2017-06-06T17:20:37.626+0000',
            'status': 'Live',
            'node_id': 93925
          },
          {
            'parent': [
              'AI'
            ],
            'identifier': 'AI4',
            'code': 'AI4',
            'keywords': [
              'Topic',
              'AI'
            ],
            'subject': 'Artificial_Intelligence',
            'consumerId': '72e54829-6402-4cf0-888e-9b30733c1b88',
            'channel': 'in.ekstep',
            'graph_id': 'domain',
            'nodeType': 'DATA_NODE',
            'createdOn': '2018-02-28T13:18:00.225+0000',
            'versionKey': '1519823880225',
            'objectType': 'Dimension',
            'children': [
              'AI44',
              'AI41',
              'AI45',
              'AI43',
              'AI47',
              'AI411',
              'AI42',
              'AI46',
              'AI410',
              'AI414',
              'AI48',
              'AI412',
              'AI49',
              'AI413'
            ],
            'appId': 'ekstep_portal',
            'name': 'Programming',
            'lastUpdatedOn': '2018-02-28T13:18:00.225+0000',
            'status': 'Live',
            'node_id': 31119
          },
          {
            'identifier': 'LD1',
            'parent': [
              'literacy'
            ],
            'code': 'LD1',
            'keywords': [
              'Dimension'
            ],
            'consumerId': 'f6878ac4-e9c9-4bc4-80be-298c5a73b447',
            'subject': 'literacy',
            'channel': 'in.ekstep',
            'description': 'Building agenguage literacy. Vocabulary expands as the child grows.',
            'graph_id': 'domain',
            'nodeType': 'DATA_NODE',
            'Subject': 'literacy',
            'versionKey': '1496769636629',
            'objectType': 'Dimension',
            'children': [
              'LO1',
              'LO50',
              'LO51',
              'LO52',
              'LO53'
            ],
            'appId': 'dev.ekstep.in',
            'name': 'Vocabulary',
            'lastUpdatedOn': '2017-06-06T17:20:36.629+0000',
            'status': 'Live',
            'node_id': 250
          }
        ]
      }
    }

  };
