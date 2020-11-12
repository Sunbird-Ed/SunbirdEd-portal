export const perfLogDataSet1 = {
  currentDate: 1586262600000, // apr 7 2020
  lastSyncDate: 1581078600000, // feb 7 20202
  logs: [ // should be sorted based on createdOn 
    {
      type: 'APP_STARTUP',
      time: 8.762,
      metaData: {},
      createdOn: 1582867800000, // more than one month
      _id: '6b982d59-11b2-4047-ba58-f7e0bc6578ba'
    },
    {
      type: 'APP_STARTUP',
      time: 8.762,
      metaData: {},
      createdOn: 1581120000000, // more than one month
      _id: '6d982d59-11b2-4047-ba58-f7e0bc6578ba'
    },
    {
      type: 'APP_STARTUP',
      time: 9.241,
      metaData: {},
      createdOn: 1585805400000, // less than one month
      _id: '650cd141-b878-4c99-9b57-1612c460f3c2'
    },
    {
      type: 'APP_STARTUP',
      time: 9.274,
      metaData: {},
      createdOn: 1585819800000, // less than one month
      _id: '7c6bd677-2be1-4c0b-88a8-e777b4777d0e'
    },
    {
      type: 'APP_STARTUP',
      time: 8.201,
      metaData: {},
      createdOn: 1585830600000, // less than one month
      _id: 'af377132-b69a-4b24-af41-fc839759aa7e'
    },
    {
      type: 'APP_STARTUP',
      time: 8.864,
      metaData: {},
      createdOn: 1586181307744, // less than one month
      _id: '15e13a49-d581-4d8b-813a-037a85025e34'
    },
    {
      type: 'APP_STARTUP',
      time: 8.842,
      metaData: {},
      createdOn: 1586182109061, // less than one month
      _id: 'ad4701a1-daa1-44c1-9e1f-ecd6e551a354'
    },
    {
      type: 'IMPORT',
      time: 28.508,
      metaData: {
        contentSize: 94217143,
        ecarSourcePath: '/Users/anoophm/Documents/Ecars/All MimeTypes_working.ecar',
        step: 'COMPLETE',
        contentId: 'do_11287198635947622412',
        mimeType: 'application/vnd.ekstep.content-collection',
        contentType: 'Collection',
        pkgVersion: '2'
      },
      createdOn: 1586182196194, // less than one month
      _id: '398483c4-d347-4fd8-99d2-77c5a1414881'
    },
    {
        type: 'IMPORT',
        time: 0.508,
        metaData: {
          contentSize: 942,
          ecarSourcePath: '/Users/anoophm/Documents/Ecars/All MimeTypes_working.ecar',
          step: 'COMPLETE',
          contentId: 'do_11287198635947622412',
          mimeType: 'application/vnd.ekstep.content-collection',
          contentType: 'Collection',
          pkgVersion: '2'
        },
        createdOn: 1586197799999, // less than one month
        _id: '398483c4-d347-4fd8-99d2-77c5a1414886'
    }
  ]
};

export const INITIAL_TRIGGER = 15 * 60 * 1000;
export const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
export const MONTH_IN_MILLISECONDS = 30 * 24 * 60 * 60 * 1000;
