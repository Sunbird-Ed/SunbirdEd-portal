export const mockGroupList = [
        {
          'id': '137cabc7-79b6-495e-b987-b0c87c317e91',
          'name': 'G1',
          'description': 'Tempor amet veniam do quis id incididunt occaecat.',
          'status': 'active',
          'createdOn': '2020-05-06T15:16:38.655+0000',
          'lastUpdatedOn': '2020-05-06T15:19:44.610+0000',
          'createdBy': '123',
          'members': [{userId: '123', role: 'admin'}]
        }
    ];

  export const tncData = {
      'id': 'api.system.settings.get.groupsTnc',
      'ver': 'v1',
      'ts': '2021-06-24 07:30:20:462+0000',
      'params': {
        'resmsgid': null,
        'msgid': 'b3042cf7-a07e-7bbe-75fe-f860c0ff945e',
        'err': null,
        'status': 'success',
        'errmsg': null
      },
      'responseCode': 'OK',
      'result': {
        'response': {
          'id': 'groupsTnc',
          'field': 'groupsTnc',
          'value': '{\'latestVersion\':\'3.5.0\',\'3.5.0\':{\'url\':\'https://sunbirdstagingpublic.blob.core.windows.net/termsandcondtions/terms-and-conditions-v9.html#groupGuidelines\'}}'
        }
      }
  };
