export const Response = {
    successData: {
        'name': 'testing1',
        'image': 'http://localhost:9876/http/assets/image1.png',
        'showImage': true,
      'description': 'testing for description',
      'ribbon': {
       'right': {'class': 'ui blue left ribbon label', 'name': 'story'},
       'left': {'class': 'ui black right ribbon label', 'name': 'resource'}
          },
      'action': {
       'right': {'class': 'trash large icon' , 'eventName': 'right', 'displayType': 'icon'},
       'left': {'class': 'ui blue basic button margin-top-10' , 'eventName': 'left', 'displayType': 'button', 'text': 'Resume'}
         }
    },
    defaultData: {
        'name': 'testing2',
        'description': '',
        'showImage': true,
      'ribbon': {
       'right': {'class': 'ui blue left ribbon label', 'name': 'story'},
       'left': {'class': 'ui black right ribbon label', 'name': 'resource'}
          }
    }

};
