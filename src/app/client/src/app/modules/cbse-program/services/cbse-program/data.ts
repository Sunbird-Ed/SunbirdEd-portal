export let themeObject = {
  'id': 'theme',
  'version': '1.0',
  'startStage': '',
  'stage': [],
  'manifest': {
    'media': []
  },
  'plugin-manifest': {
    'plugin': [
      {
        'id': 'org.ekstep.navigation',
        'ver': '1.0',
        'type': 'plugin',
        'depends': ''
      },
      {
        'id': 'org.ekstep.questionunit',
        'ver': '1.0',
        'type': 'plugin',
        'depends': ''
      },
      {
        'id': 'org.ekstep.iterator',
        'ver': '1.0',
        'type': 'plugin',
        'depends': ''
      },
      {
        'id': 'org.ekstep.questionset',
        'ver': '1.0',
        'type': 'plugin',
        'depends': 'org.ekstep.questionset.quiz,org.ekstep.iterator'
      }
    ]
  }
};

export let stageObject = {
  'x': 0,
  'y': 0,
  'w': 100,
  'h': 100,
  'id': '',
  'rotate': null,
  'config': {
    '__cdata': {
      'opacity': 100,
      'strokeWidth': 1,
      'stroke': 'rgba(255, 255, 255, 0)',
      'autoplay': false,
      'visible': true,
      'color': '#FFFFFF',
      'genieControls': false,
      'instructions': ''
    }
  },
  'manifest': {
    'media': []
  },
  'org.ekstep.questionset': []
};

export let questionSetObject = {
  'x': 9,
  'y': 6,
  'w': 80,
  'h': 85,
  'rotate': 0,
  'z-index': 0,
  'id': '',
  'data': {
    '__cdata': []
  },
  'config': {
    '__cdata': []
  },
  'org.ekstep.question': []
};

export let questionObject = {
  'id': '',
  'type': 'quml',
  'pluginId': 'org.sunbird.questionunit.quml',
  'pluginVer': '1.0',
  'templateId': 'qumltemplate',
  'data': {
    '__cdata': []
  },
  'config': {
    '__cdata': [{ 'max_score': 1, 'partial_scoring': true, 'isShuffleOption': false, responseDeclaration: {} }]
  },
  'w': 80,
  'h': 85,
  'x': 9,
  'y': 6
};

export let questionSetConfigCdataObject = {
  'max_score': 1,
  'allow_skip': true,
  'show_feedback': false,
  'shuffle_questions': false,
  'shuffle_options': false,
  'total_items': 1
};
