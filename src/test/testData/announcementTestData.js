var announcementTestData = {
  getAnnouncementInbox: {
    successResponce: {
      'id': 'api.plugin.announcement.user.inbox',
      'ver': '1.0',
      'ts': '2017-11-16 04:59:39:461+0000',
      'params': {
        'resmsgid': 'f351c750-ca8a-11e7-b553-0ffa8051c99e',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'count': 215,
        'announcements': [{
          'sourceid': '0123673908687093760',
          'createddate': '2017-11-13 04:32:05:885+0000',
          'details': {
            'description': 'Test description for announcement 90',
            'from': 'test user',
            'title': 'Test title for announcement 9011111111111111111',
            'type': 'Circular'
          },
          'links': ['http://yahoo.com'],
          'id': '9a78dad0-c82b-11e7-8175-573a15bbe3f0',
          'userid': 'd56a1766-e138-45e9-bed2-a0db5eb9696a',
          'target': {
            'geo': {
              'ids': ['0123668627050987529']
            }
          },
          'status': 'active',
          'read': false,
          'received': false
        }]
      }
    },
    failedResponse: {
      'id': 'api.plugin.announcement.user.inbox',
      'ver': '1.0',
      'ts': '2017-11-13 09:30:20:675+0000',
      'params': {
        'resmsgid': '44991d30-c855-11e7-a0fa-0d6c238048d7',
        'msgid': null,
        'status': 'failed',
        'err': ''
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    },
    detailsSuccess: {
      'sourceid': '0123673908687093760',
      'createddate': '2017-11-13 04:32:05:885+0000',
      'details': {
        'description': 'Test description for announcement 90',
        'from': 'test user',
        'title': 'Test title for announcement 9011111111111111111',
        'type': 'Circular'
      },
      'links': ['http://yahoo.com'],
      'id': '9a78dad0-c82b-11e7-8175-573a15bbe3f0',
      'userid': 'd56a1766-e138-45e9-bed2-a0db5eb9696a',
      'target': {
        'geo': {
          'ids': ['0123668627050987529']
        }
      },
      'status': 'active',
      'read': false,
      'received': false
    },
    receivedSucess: {
      'id': 'api.plugin.announcement.received',
      'ver': '1.0',
      'ts': '2017-11-16 05:19:03:806+0000',
      'params': {
        'resmsgid': 'a952b9e0-ca8d-11e7-8b5d-b7dcc410578e',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'metrics': {
          'id': 'a93e6e90-ca8d-11e7-8b5d-b7dcc410578e'
        }
      }
    },
    annWithAttachments: '{"name":"1503670688265.jpg","mimetype":"image/jpeg","size":"8 KB","link":"https://sunbirddev.blob.core.windows.net/attachments/announcement/File-012379379393880064118"}'
  },
  getAnnouncementOutbox: {
    successResponce: {
      'id': 'api.plugin.announcement.user.outbox',
      'ver': '1.0',
      'ts': '2017-11-10 05:39:01:536+0000',
      'params': {
        'resmsgid': '74bf5200-c5d9-11e7-a6fc-2788fac1f270',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'count': 1,
        'announcements': [{
          'sourceId': '0123673908687093760',
          'createddate': '2017-11-05 13:38:40:569+0530',
          'details': {
            'description': 'Test description for announcement 11',
            'from': 'test user',
            'type': 'Circular',
            'title': 'Test title for announcement 11'
          },
          'links': ['http://google.com'],
          'id': '0fb94a9a-c521-11e7-abc4-cec278b6b50a',
          'userid': 'd56a1766-e138-45e9-bed2-a0db5eb9696a',
          'status': 'active',
          'target': {
            'geo': {
              'ids': ['0123668622585610242', '0123668627050987529']
            }
          }
        }]
      }
    },
    failedResponse: {
      'id': 'api.plugin.announcement.user.outbox',
      'ver': '1.0',
      'ts': '2017-11-13 09:30:20:675+0000',
      'params': {
        'resmsgid': '44991d30-c855-11e7-a0fa-0d6c238048d7',
        'msgid': null,
        'status': 'failed',
        'err': ''
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  },
  receivedAPI: {
    successResponce: {
      'id': 'api.plugin.announcement.received',
      'ver': '1.0',
      'ts': '2017-11-13 12:12:49:217+0000',
      'params': {
        'resmsgid': 'f72eba20-c86b-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'metrics': {
          'id': 'f715b3e0-c86b-11e7-8175-573a15bbe3f0'
        }
      }
    },
    failedResponse: {
      'id': 'api.plugin.announcement.received',
      'ver': '1.0',
      'ts': '2017-11-13 12:23:00:075+0000',
      'params': {
        'resmsgid': '63481bb0-c86d-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': [{
          'field': 'request',
          'description': '"announcementId" is required'
        }]
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  },
  readAPI: {
    successResponce: {
      'id': 'api.plugin.announcement.read',
      'ver': '1.0',
      'ts': '2017-11-13 12:14:19:886+0000',
      'params': {
        'resmsgid': '2d39b7f0-c86c-11e7-a0fa-0d6c238048d7',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'metrics': {
          'id': '2d228670-c86c-11e7-a0fa-0d6c238048d7'
        }
      }
    },
    failedResponse: {
      'id': 'api.plugin.announcement.read',
      'ver': '1.0',
      'ts': '2017-11-13 12:15:41:703+0000',
      'params': {
        'resmsgid': '5dfdd970-c86c-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': [{
          'field': 'request',
          'description': '"announcementId" is required'
        }]
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  },
  createAnnouncement: {
    successResponce: {
      'id': 'api.plugin.announcement.create',
      'ver': '1.0',
      'ts': '2017-11-13 12:27:11:160+0000',
      'params': {
        'resmsgid': 'f8f0a380-c86d-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'announcement': {
          'id': 'f8e7a2d0-c86d-11e7-8175-573a15bbe3f0'
        }
      }
    },
    authErrorResponse: {
      'id': 'api.plugin.announcement.create',
      'ver': '1.0',
      'ts': '2017-11-13 12:31:02:527+0000',
      'params': {
        'resmsgid': '82d870f0-c86e-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': 'user has no create access'
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    },
    fieldMissingResponse: {
      'id': 'api.plugin.announcement.create',
      'ver': '1.0',
      'ts': '2017-11-13 12:45:24:184+0000',
      'params': {
        'resmsgid': '846f0490-c870-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': [{
          'field': 'request',
          'description': '"from" is required'
        }, {
          'field': 'request',
          'description': '"target" is required'
        }]
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  },
  announcementDetails: {
    successResponce: {
      'id': 'api.plugin.announcement.get.id',
      'ver': '1.0',
      'ts': '2017-11-21 06:18:56:978+0000',
      'params': {
        'resmsgid': 'db160320-ce83-11e7-a5bf-459261107158',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'sourceid': '0123673908687093760',
        'attachments': ['{"name":"file1.pdf","mimetype":"application/pdf","size":"140kb","link":"https://y535y.cdn.com/fdfgd/sdfs/sfs1111"}', '{"name":"file2.jpeg","mimetype":"image/jpeg","size":"7500kb","link":"https://y535y.cdn.com/fdfgd/3423sd/sdfdst52222"}'],
        'createddate': '2017-11-15 05:53:44:067+0000',
        'details': {
          'description': 'Test description for announcement 90',
          'from': 'test user',
          'title': 'Test title for announcement 90',
          'type': 'Circular'
        },
        'links': ['http://yahoo.com'],
        'id': '56d79d30-c9c9-11e7-bb89-bba5c80626bd',
        'userid': 'd56a1766-e138-45e9-bed2-a0db5eb9696a',
        'target': {
          'geo': {
            'ids': ['0123668627050987529']
          }
        },
        'status': 'active'
      }
    },
    failedResponse: {
      'id': 'api.plugin.announcement.get.id',
      'ver': '1.0',
      'ts': '2017-11-13 09:30:20:675+0000',
      'params': {
        'resmsgid': '44991d30-c855-11e7-a0fa-0d6c238048d7',
        'msgid': null,
        'status': 'failed',
        'err': ''
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    },
    annValidObj: {
      'sourceid': '0123673908687093760',
      'createddate': '2017-11-10 12:04:04:348+0530',
      'details': {
        'description': 'Description',
        'from': 'test user',
        'title': 'Title',
        'type': 'Circular'
      },
      'links': ['http://yahoo.com'],
      'id': '256048b0-c5e1-11e7-b854-ff8d6e91227b',
      'userid': 'd56a1766-e138-45e9-bed2-a0db5eb9696a',
      'target': {
        'geo': {
          'ids': ['0123668622585610242', '0123668627050987529']
        }
      },
      'status': 'cancelled',
      '$$hashKey': 'object:48'
    },
    annBlankObj: {},
    annObjWithEmptyWeblinks: {
      'links': [],
      'title': 'Title'
    },
    annObjWithEmptyAttachments: {
      'title': 'Title',
      'attachments': []
    }
  },
  deleteAnnouncement: {
    requestBody: {
      'request': {
        'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c',
        'announcenmentid': '430d95d0-c842-11e7-a0fa-0d6c238048d7'
      }
    },
    successResponse: {
      'id': 'api.plugin.announcement.cancel.id',
      'ver': '1.0',
      'ts': '2017-11-15 13:22:46:418+0000',
      'params': {
        'resmsgid': '11bc1f20-ca08-11e7-b553-0ffa8051c99e',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'status': 'cancelled'
      }
    },
    failedResponse: {
      'id': 'api.plugin.announcement.cancel.id',
      'ver': '1.0',
      'ts': '2017-11-15 13:21:44:588+0000',
      'params': {
        'resmsgid': 'ece19cc0-ca07-11e7-8b5d-b7dcc410578e',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': 'unable to fetch announcement'
      },
      'responseCode': 'SERVER_ERROR',
      'result': {}
    }
  },
  resendAnnouncement: {
    requestBody: {
      'sourceid': '0123673908687093760',
      'createddate': '2017-11-10 11:59:54:879+0530',
      'details': {
        'description': 'Test description for announcement 87',
        'from': 'test user',
        'title': 'Test title for announcement 87',
        'type': 'Circular'
      },
      'links': ['http://yahoo.com'],
      'id': '90ae7cf0-c5e0-11e7-8744-852d6ada097c',
      'userid': 'd56a1766-e138-45e9-bed2-a0db5eb9696a',
      'target': {
        'geo': {
          'ids': ['0123668622585610242', '0123668627050987529']
        }
      },
      'status': 'cancelled'
    },
    successResponse: {
      'id': 'api.plugin.announcement.resend',
      'ver': '1.0',
      'ts': '2017-11-12 05:53:22:130+0000',
      'params': {
        'resmsgid': 'ca873230-c76d-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'announcement': {
          'id': 'ca7c83d0-c76d-11e7-8175-573a15bbe3f0'
        }
      }
    },
    failedResponse: {
      'id': 'api.plugin.announcement.',
      'ver': '1.0',
      'ts': '2017-11-16 09:06:42:862+0000',
      'params': {
        'resmsgid': '76c144e0-caad-11e7-bf83-c9a516cdca67',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': 'UNAUTHORIZE_USER'
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    }
  },
  getResend: {
    successResponse: {
      'id': 'api.plugin.announcement.getresend.id',
      'ver': '1.0',
      'ts': '2017-11-12 06:45:50:882+0000',
      'params': {
        'resmsgid': '1f547820-c775-11e7-a0fa-0d6c238048d7',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'sourceid': '0123673908687093760',
        'createddate': '2017-11-10 11:59:54:879+0530',
        'details': {
          'description': 'Test description for announcement 87',
          'from': 'test user',
          'title': 'Test title for announcement 87',
          'type': 'Circular'
        },
        'links': ['http://yahoo.com'],
        'id': '90ae7cf0-c5e0-11e7-8744-852d6ada097c',
        'userid': 'd56a1766-e138-45e9-bed2-a0db5eb9696a',
        'target': {
          'geo': {
            'ids': ['0123668622585610242', '0123668627050987529']
          }
        },
        'status': 'cancelled',
        'attachments': [{'name': 'swing-846077_960_720.jpg', 'mimetype': 'image/jpeg', 'size': '48 KB', 'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-012379586223849472129'}, {'name': 'swing-846077_960_720.jpg', 'mimetype': 'image/jpeg', 'size': '48 KB', 'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-012379586223849472129'}]
      }
    }
  },
  composeAnncmnt: {
    getAnncmntTypeReq: {
      'rootorgid': 'ORG_001',
      'userid': '159e93d1-da0c-4231-be94-e75b0c226d7c',
      'definitions': ['announcementtypes', 'senderlist']
    },
    composeAnncmntRequest: {
      'request': {
        'title': 'Test 1',
        'from': 'Pune',
        'type': 'Circular',
        'description': 'Demo collection',
        'links': ['http://localhost:3000/private/index#!/announcement/outbox'],
        'sourceId': 'ORG_001',
        'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
        'target': {
          'geo': {
            'ids': ['01236686178285977611', '0123668625321820163', '01236686673822515210']
          }
        },
        'attachments': [{'name': 'swing-846077_960_720.jpg', 'mimetype': 'image/jpeg', 'size': '48 KB', 'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-012379586223849472129'}]
      }
    },
    getAnncmntTypeRes: {
      'id': 'api.plugin.announcement.definitions',
      'ver': '1.0',
      'ts': '2017-11-15 13:21:20:919+0000',
      'params': {
        'resmsgid': 'dec60270-ca07-11e7-8b5d-b7dcc410578e',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'announcementtypes': {
          'count': 3,
          'content': [{
            'createddate': '2017-11-07 13:10:04:797+0530',
            'name': 'Circular',
            'id': '9b20d566-c5db-11e7-abc4-cec278b6b50a',
            'rootorgid': 'ORG_001',
            'status': 'active'
          }, {
            'createddate': '2017-11-07 13:10:04:797+0530',
            'name': 'Order',
            'id': '9b20d8f4-c5db-11e7-abc4-cec278b6b50a',
            'rootorgid': 'ORG_001',
            'status': 'active'
          }, {
            'createddate': '2017-11-07 13:10:04:797+0530',
            'name': 'News',
            'id': '9b20d7f0-c5db-11e7-abc4-cec278b6b50a',
            'rootorgid': 'ORG_001',
            'status': 'active'
          }]
        },
        'senderlist': {
          '159e93d1-da0c-4231-be94-e75b0c226d7c': 'Sunil Pandith'
        }
      }
    },
    showSingleError: {
      'id': 'api.plugin.announcement.create',
      'ver': '1.0',
      'ts': '2017-11-12 14:02:11:368+0000',
      'params': {
        'resmsgid': '141d9a80-c7b2-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': 'UNAUTHORIZED'
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    },
    showMultipleErrors: {
      'id': 'api.plugin.announcement.create',
      'ver': '1.0',
      'ts': '2017-11-12 14:27:04:166+0000',
      'params': {
        'resmsgid': '8de4a770-c7b5-11e7-8175-573a15bbe3f0',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': [{
          'field': 'request',
          'description': 'sourceId is not allowed to be empty'
        }, {
          'field': 'request',
          'description': 'createdBy is not allowed to be empty'
        }]
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    },
    saveAnncmntSuccessRes: {
      'id': 'api.plugin.announcement.create',
      'ver': '1.0',
      'ts': '2017-11-20 17:30:32:449+0530',
      'params': {
        'resmsgid': '68ecf310-cdea-11e7-8020-5bf258e5a36e',
        'msgid': null,
        'status': 'successful',
        'err': '',
        'errmsg': ''
      },
      'responseCode': 'OK',
      'result': {
        'announcement': {
          'id': '68c594f0-cdea-11e7-8020-5bf258e5a36e'
        }
      }
    },
    failedAnncmntRes: {
      'id': 'api.plugin.announcement.create',
      'ver': '1.0',
      'ts': '2017-11-20 17:05:15:702+0530',
      'params': {
        'resmsgid': 'e0dfb960-cde6-11e7-922e-710257dce833',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': [{
          'field': 'request',
          'description': '"title" is required'
        }]
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    },
    composeAnncmntWithoutTitleReq: {
      'request': {
        'from': 'Pune',
        'type': 'Circular',
        'description': 'Demo collection',
        'sourceId': 'ORG_001',
        'createdBy': '159e93d1-da0c-4231-be94-e75b0c226d7c',
        'target': {
          'geo': {
            'ids': ['0123668627050987529', '01236686178285977611']
          }
        }
      }
    },
    composeAnncmntWithoutTitleResponse: {
      'id': 'api.plugin.announcement.create',
      'ver': '1.0',
      'ts': '2017-11-20 17:44:57:015+0530',
      'params': {
        'resmsgid': '6c3f4070-cdec-11e7-adac-f1b6542319a8',
        'msgid': null,
        'status': 'failed',
        'err': '',
        'errmsg': [{
          'field': 'request',
          'description': '"title" is required'
        }]
      },
      'responseCode': 'CLIENT_ERROR',
      'result': {}
    },
    fileUploadSuccessData: {
      'id': 'api.file.upload',
      'ver': 'v1',
      'ts': '2017-11-28 07:24:00:242+0000',
      'params': {
        'resmsgid': null,
        'msgid': '7888f4a7-4fc0-43fd-b0b9-68a66399fb32',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'url': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0123851123774259205'
      },
      'success': true
    },
    annObject: {
      'sourceId': '',
      'attachments': [{
        'name': 'Screenshot from 2017-02-06 14-03-06.png',
        'mimetype': 'image/png',
        'size': '154 KB',
        'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0123865930687692803'
      }],
      'details': {
        'description': 'sdsd',
        'from': 'sds',
        'title': 'sd',
        'type': 'Order'
      },
      'links': ['https:yahhoo.com'],
      'id': '',
      'target': {
        'geo': {
          'ids': []
        }
      },
      'status': null,
      'selTar': [{
        'createdDate': '2017-11-02',
        'updatedBy': null,
        'createdBy': '16517913-ae66-4b78-be8a-325da74e561c',
        'topic': '0123668627050987529',
        'location': 'Visakhapatnam',
        'id': '0123668627050987529',
        'updatedDate': null,
        'type': 'District',
        'rootOrgId': 'ORG_001',
        '$$hashKey': 'object:62',
        'selected': true
      }, {
        'createdDate': '2017-11-02',
        'updatedBy': null,
        'createdBy': '16517913-ae66-4b78-be8a-325da74e561c',
        'topic': '01236686178285977611',
        'location': 'West Godavari',
        'id': '01236686178285977611',
        'updatedDate': null,
        'type': 'District',
        'rootOrgId': 'ORG_001',
        '$$hashKey': 'object:63',
        'selected': true
      }]
    },
    annTarObject: {
      'selTar': [{
        'createdDate': '2017-11-02',
        'updatedBy': null,
        'createdBy': '16517913-ae66-4b78-be8a-325da74e561c',
        'topic': '0123668627050987529',
        'location': 'Visakhapatnam',
        'id': '0123668627050987529',
        'updatedDate': null,
        'type': 'District',
        'rootOrgId': 'ORG_001',
        '$$hashKey': 'object:62',
        'selected': true
      }, {
        'createdDate': '2017-11-02',
        'updatedBy': null,
        'createdBy': '16517913-ae66-4b78-be8a-325da74e561c',
        'topic': '01236686178285977611',
        'location': 'West Godavari',
        'id': '01236686178285977611',
        'updatedDate': null,
        'type': 'District',
        'rootOrgId': 'ORG_001',
        '$$hashKey': 'object:63',
        'selected': true
      }]
    }
  }
}
