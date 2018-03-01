export const mockRes = {
       successData: {
         type: 'circular',
         title: 'abc',
         from: 'for',
         read: false,
         links: ['hello', ''],
         description: '',
         attachments: [{
           'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-0124190917418598400.png',
           'mimetype': 'image/png', 'name': 'ACBuilder css.png', size: '89 KB'
         },
         {
           'link': 'https://sunbirddev.blob.core.windows.net/attachments/announcement/File-01241909174185657.png',
           'mimetype': 'image/png', 'name': 'abc css.png', size: '78 KB'
         }],
         createdDate: '2018-01-15 '
       },
       parseSuccessData: {
         type: 'news',
         title: 'abc',
         from: 'for',
         read: true,
         links: [],
         description: 'hi',
         attachments: [{}],
         createdDate: ''
       }
     };
