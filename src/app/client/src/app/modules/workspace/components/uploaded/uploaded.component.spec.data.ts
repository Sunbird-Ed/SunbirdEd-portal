export const mockRes = {
  searchSuccess: {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'count': 65,
      'content': [{
        'identifier': 'do_2124339707713126401772',
        'name': 'Test_Collection_19_mar_2018_20001'
      }]
    }
  },
  searchSuccessWithCountTwo: {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'count': 65,
      'content': [{
        'identifier': 'do_2124339707713126401772',
        'name': 'Test_Collection_19_mar_2018_20001'
      }, {
        'identifier': 'do_2124339707713126401772',
        'name': 'Untitled Course'
      }]
    }
  },
  deleteSuccess: {
    'id': 'api.content.retire",', 'ver': '1.0', 'ts': '2018-03-21T13:22:47.263Z"',
    'params': {
      'resmsgid': '8ab1aff0-16e6-11e8-b881-f9ecfdfe4059', 'msgid': null, 'status': 'successful', 'err': '', 'errmsg': ''
    },
    'responseCode': 'OK',
    'result': []
  },
  event: {
    'inview': [
      {
        'id': 0,
        'data': {
          'name': 'Aman15thMay Book',
          'image': `https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content
          /do_1125041330714050561226/artifact/4272f16cf3fd329b18dd116315601ad0_1476257845556.thumb.jpeg`,
          'description': 'Untitled Collection sadasd asd asd as',
          'action': {
            'right': {
              'class': 'trash large icon',
              'eventName': 'delete',
              'displayType': 'icon'
            },
            'onImage': {
              'eventName': 'onImage'
            }
          },
          'ribbon': {
            'right': {
              'name': 'TextBook',
              'class': 'ui black right ribbon label'
            }
          },
          'metaData': {
            'identifier': 'do_1125041330714050561226',
            'mimeType': 'application / vnd.ekstep.content - collection',
            'framework': 'NCF',
            'contentType': 'TextBook'
          }
        }
      },
      {
        'id': 1,
        'data': {
          'name': 'Untitled Collection',
          'description': 'Untitled Collection',
          'action': {
            'right': {
              'class': 'trash large icon',
              'eventName': 'delete',
              'displayType': 'icon'
            },
            'onImage': {
              'eventName': 'onImage'
            }
          },
          'ribbon': {
            'right': {
              'name': 'Resource',
              'class': 'ui black right ribbon label'
            }
          },
          'metaData': {
            'identifier': 'do_112514006444826624126',
            'mimeType': 'application / vnd.ekstep.ecml - archive',
            'framework': 'NCF',
            'contentType': 'Resource'
          }
        }
      }
    ],
    'direction': 'up'
  },
  telemetryData: {
    context: {
      env: 'workspace'
    },
    edata: {
      type: 'list',
      pageid: 'workspace-content-unlisted',
      subtype: 'scroll',
      uri: '',
      visits: []
    }
  }
};
