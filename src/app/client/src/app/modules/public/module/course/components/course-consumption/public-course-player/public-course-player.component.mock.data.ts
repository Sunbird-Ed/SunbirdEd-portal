import { CollectionHierarchyAPI } from '@sunbird/core';

export const CourseHierarchyGetMockResponse = {
  'id': 'ekstep.learning.content.hierarchy',
  'ver': '2.0',
  'ts': '2018-05-07T07:20:27ZZ',
  'params': {
      'resmsgid': '0ea98baa-5a9e-49fd-a568-7967bc1e0ab8',
      'msgid': null,
      'err': null,
      'status': 'successful',
      'errmsg': null
  },
  'result': {
    'content': {
      'identifier': 'do_212347136096788480178'
    }
  }
};

export const telemetryInteractMockData = {
  'context': {
      'env': 'explore-course',
      'cdata': []
  },
  'edata': {
      'id': 'join-training-popup-close',
      'type': 'click',
      'pageid': 'explore-course-toc'
  },
  'object': {
      'id': 'do_212347136096788480178',
      'type': 'Course',
      'ver': '1.0',
      'rollup': {
          'l1': 'do_212347136096788480178'
      }
  }
};
