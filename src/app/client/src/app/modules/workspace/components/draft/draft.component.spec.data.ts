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
  pager: {
    'totalItems': 72, 'currentPage': 3, 'pageSize': 9, 'totalPages': 8,
    'startPage': 1, 'endPage': 8, 'startIndex': 1, 'endIndex': 72, 'pages': [1, 2, 3, 4, 5]
  }, searchSuccessWithCountZero: {
    'id': 'api.v1.search',
    'responseCode': 'OK',
    'result': {
      'count': 0,
      'content': []
    }
  },
};
