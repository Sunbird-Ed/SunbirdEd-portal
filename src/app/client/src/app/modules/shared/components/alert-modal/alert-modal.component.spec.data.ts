export const metaData = {
    type: 'update profile',
    size: 'mini',
    isClosed: true,
    content: {
      title: 'Update Profile',
      body: {
        type: 'text', // text,checkbox
        data: 'Please update your profile',
      },
    },
    footer: {
      className: 'single-btn',
      buttons: [
        {
          type: 'cancel',
          returnValue: false,
          buttonText: 'cancel',
        },
        {
          type: 'accept',
          returnValue: true,
          buttonText: 'Update',
        },
      ],
    },
  };
