export const testDataSet1 = {
  childEvent: {
    'event': {
      'isTrusted': true
    },
    'data': {
      'action': 'toggle-clicked',
      'position': 0,
      'value': {
        'topic': 'A message \'Content Coming Soon\' is displayed on my screen and I cannot see any content for the QR code scanned',
        'description': 'Your State is currently creating content for this QR code.'
      },
      'isOpened': true
    }
  },
  telemetryEvent: {
    'context': {
      'env': 'help',
      'cdata': []
    },
    'edata': {
      'id': 'toggle-clicked',
      'type': 'click',
      'pageid': 'help',
      'extra': {
        'value': {
          'topic': 'A message \'Content Coming Soon\' is displayed on my screen and I cannot see any content for the QR code scanned',
          'description': 'Your State is currently creating content for this QR code.'
        },
        'position': 0,
        'isOpened': true
      }
    }
  }
};

export const testDataSet2 = {
  childEvent: {
    'event': {
      'isTrusted': true
    },
    'data': {
      'action': 'yes-clicked',
      'position': 0,
      'value': {
        'topic': 'A message \'Content Coming Soon\' is displayed on my screen and I cannot see any content for the QR code scanned',
        'description': 'Your State is currently creating content for this QR code.'
      }
    }
  },
  telemetryEvent: {
    'context': {
      'env': 'help',
      'cdata': []
    },
    'edata': {
      'id': 'yes-clicked',
      'type': 'click',
      'pageid': 'help',
      'extra': {
        'value': {
          'topic': 'A message \'Content Coming Soon\' is displayed on my screen and I cannot see any content for the QR code scanned',
          'description': 'Your State is currently creating content for this QR code.'
        },
        'position': 0
      }
    }
  }
};

export const testDataSet3 = {
  childEvent: {
    'event': {
      'isTrusted': true
    },
    'data': {
      'action': 'no-clicked',
      'position': 0,
      'value': {
        'topic': 'A message \'Content Coming Soon\' is displayed on my screen and I cannot see any content for the QR code scanned',
        'description': 'Your State is currently creating content for this QR code.'
      }
    }
  },
  telemetryEvent: {
    'context': {
      'env': 'help',
      'cdata': []
    },
    'edata': {
      'id': 'no-clicked',
      'type': 'click',
      'pageid': 'help',
      'extra': {
        'value': {
          'topic': 'A message \'Content Coming Soon\' is displayed on my screen and I cannot see any content for the QR code scanned',
          'description': 'Your State is currently creating content for this QR code.'
        },
        'position': 0
      }
    }
  }
};

export const testDataSet4 = {
  childEvent: {
    'event': {
      'isTrusted': true
    },
    'data': {
      'action': 'submit-clicked',
      'position': 0,
      'value': {
        'topic': 'A message \'Content Coming Soon\' is displayed on my screen and I cannot see any content for the QR code scanned',
        'description': 'Your State is currently creating content for this QR code.',
        'knowMoreText': 'i dont want to use desktop app'
      }
    }
  },
  telemetryEvent: {
    'context': {
      'env': 'help',
      'cdata': []
    },
    'edata': {
      'id': 'submit-clicked',
      'type': 'click',
      'pageid': 'help',
      'extra': {
        'value': {
          'topic': 'A message \'Content Coming Soon\' is displayed on my screen and I cannot see any content for the QR code scanned',
          'description': 'Your State is currently creating content for this QR code.',
          'knowMoreText': 'i dont want to use desktop app'
        },
        'position': 0
      }
    }
  }
};

export const testDataSet5 = {
  childEvent: {},
  telemetryEvent: {}
};
