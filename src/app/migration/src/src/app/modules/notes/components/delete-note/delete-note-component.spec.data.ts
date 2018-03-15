export const mockRes = {
userSuccess: {
    'id': 'api.note.search',
    'ver': 'v1',
    'ts': '2018-03-12 08:24:09:173+0000',
    'params': {
      'resmsgid': null,
      'msgid': 'f3d1db11-d6c3-ee08-84cf-7eba2303b05a',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {
      'response': {
        'count': 4,
        'note': [
          {
            'note': 'test test',
            'identifier': '01245874638382694454',
            'updatedBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'createdDate': '2018-03-12 08:24:01:129+0000',
            'createdBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'contentId': 'do_2123475531394826241107',
            'updatedDate': '2018-03-12 08:24:01:129+0000',
            'id': '01245874638382694454',
            'title': 'new note',
            'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'courseId': 'do_212282810437918720179'
          },
          {
            'note': 'Test\n',
            'identifier': '01245875094745088068',
            'updatedBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'createdDate': '2018-03-12 08:19:53:937+0000',
            'createdBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'contentId': 'do_2123475531394826241107',
            'updatedDate': '2018-03-12 08:19:53:937+0000',
            'id': '01245875094745088068',
            'title': 'Test note',
            'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'courseId': 'do_212282810437918720179'
          },
          {
            'note': 'Test',
            'identifier': '01245871581742694452',
            'updatedBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'createdDate': '2018-03-12 07:15:34:536+0000',
            'createdBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'id': '01245871581742694452',
            'updatedDate': '2018-03-12 07:15:34:536+0000',
            'title': 'Test note',
            'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'courseId': 'do_2123412199319552001265'
          },
          {
            'note': 'Test note',
            'identifier': '01245868300180684866',
            'updatedBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'createdDate': '2018-03-12 06:06:05:750+0000',
            'createdBy': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'contentId': 'do_2123475531394826241107',
            'updatedDate': '2018-03-12 06:06:05:750+0000',
            'id': '01245868300180684866',
            'title': 'Test',
            'userId': 'd5efd1ab-3cad-4034-8143-32c480f5cc9e',
            'courseId': 'do_212282810437918720179'
          }
        ]
      }
    }
  },

  deleteSuccess: {
    'id': 'api.note.delete',
    'ver': 'v1',
    'ts': '2018-03-13 13:11:37:503+0000',
    'params': {
      'resmsgid': null,
      'msgid': '61305fbd-0f27-4a58-951b-4f7517c012d5',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'OK',
    'result': {}
  },

  deleteFailed: {
    'id': 'api.note.delete',
    'ver': 'v1',
    'ts': '2018-03-13 13:11:37:503+0000',
    'params': {
      'resmsgid': null,
      'msgid': '61305fbd-0f27-4a58-951b-4f7517c012d5',
      'err': null,
      'status': 'success',
      'errmsg': null
    },
    'responseCode': 'error',
    'result': {}

  },
  resourceBundle: {
    'messages': {
        'fmsg': {
            'm0032': 'Removing note is failed, please try again later...'
        }
    }
},

  userError: {
    'id ': 'api.user.read ',
    'ver ': 'v1 ',
    'ts ': '2018-02-28 12:07:33:518+0000 ',
    'params ': {
        'resmsgid ': 'UNAUTHORIZED',
        'msgid ': 'bdf695fd-3916-adb0-2072-1d53deb14aea ',
        'err ': 'UNAUTHORIZED',
        'status ': 'SERVER_ERROR',
        'errmsg ': 'UNAUTHORIZED'
    },
    'responseCode ': 'error',
    'result': {
        'response': {}
    }
},

};
