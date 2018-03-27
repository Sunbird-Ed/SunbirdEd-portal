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
      'count': 5,
      'content': [{
        'identifier': 'do_2124339707713126401772',
        'name': 'Test_Collection_19_mar_2018_20001',
        'description': 'fsdfs',
      }, {
        'identifier': 'do_2124339707713126401772',
        'name': 'Untitled Course',
        'description': 'test test',
      }]
    }
  },
    pager: {
        'totalItems': 1173, 'currentPage': 3, 'pageSize': 25, 'totalPages': 47,
        'startPage': 30, 'endPage': 34, 'startIndex': 725, 'endIndex': 749, 'pages': [30, 31, 32, 33, 34]
    }
};
