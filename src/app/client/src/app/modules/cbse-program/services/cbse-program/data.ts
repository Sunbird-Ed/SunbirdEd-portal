export let themeObject = {
  'id': 'theme',
  'version': '1.0',
  'startStage': '',
  'stage': [],
  'manifest': {
    'media': [
      {
        'id': 'org.ekstep.navigation_js',
        'plugin': 'org.ekstep.navigation',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.navigation-1.0/renderer/controller/navigation_ctrl.js',
        'type': 'js'
      },
      {
        'id': 'org.ekstep.navigation_html',
        'plugin': 'org.ekstep.navigation',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.navigation-1.0/renderer/templates/navigation.html',
        'type': 'js'
      },
      {
        'id': 'org.ekstep.navigation',
        'plugin': 'org.ekstep.navigation',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.navigation-1.0/renderer/plugin.js',
        'type': 'plugin'
      },
      {
        'id': 'org.ekstep.navigation_manifest',
        'plugin': 'org.ekstep.navigation',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.navigation-1.0/manifest.json',
        'type': 'json'
      },
      {
        'id': 'org.ekstep.iterator',
        'plugin': 'org.ekstep.iterator',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.iterator-1.0/renderer/plugin.js',
        'type': 'plugin'
      },
      {
        'id': 'org.ekstep.iterator_manifest',
        'plugin': 'org.ekstep.iterator',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.iterator-1.0/manifest.json',
        'type': 'json'
      },
      {
        'id': 'org.ekstep.questionset_telemetry_logger_js',
        'plugin': 'org.ekstep.questionset',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionset-1.0/renderer/utils/telemetry_logger.js',
        'type': 'js'
      },
      {
        'id': 'org.ekstep.questionset_audio_plugin_js',
        'plugin': 'org.ekstep.questionset',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionset-1.0/renderer/utils/html_audio_plugin.js',
        'type': 'js'
      },
      {
        'id': 'org.ekstep.questionset_feedback_popup_js',
        'plugin': 'org.ekstep.questionset',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionset-1.0/renderer/utils/qs_feedback_popup.js',
        'type': 'js'
      },
      {
        'id': 'org.ekstep.questionset',
        'plugin': 'org.ekstep.questionset',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionset-1.0/renderer/plugin.js',
        'type': 'plugin'
      },
      {
        'id': 'org.ekstep.questionset_manifest',
        'plugin': 'org.ekstep.questionset',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionset-1.0/manifest.json',
        'type': 'json'
      },
      {
        'id': 'org.ekstep.questionunit.renderer.audioicon',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionunit-1.0/renderer/assets/audio-icon.png',
        'type': 'image'
      },
      {
        'id': 'org.ekstep.questionunit.renderer.downarrow',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionunit-1.0/renderer/assets/down_arrow.png',
        'type': 'image'
      },
      {
        'id': 'org.ekstep.questionunit_js',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionunit-1.0/renderer/components/js/components.js',
        'type': 'js'
      },
      {
        'id': 'org.ekstep.questionunit_css',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionunit-1.0/renderer/components/css/components.css',
        'type': 'css'
      },
      {
        'id': 'org.ekstep.questionunit',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionunit-1.0/renderer/plugin.js',
        'type': 'plugin'
      },
      {
        'id': 'org.ekstep.questionunit_manifest',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.0',
        'src': '/content-plugins/org.ekstep.questionunit-1.0/manifest.json',
        'type': 'json'
      },
      {
          'id': 'org.sunbird.questionunit.quml_manifest',
          'plugin': 'org.sunbird.questionunit.quml',
          'ver': '1.0',
          'src': '/content-plugins/org.sunbird.questionunit.quml-1.0/manifest.json',
          'type': 'json'
      },
      {
          'id': 'org.sunbird.questionunit.quml',
          'plugin': 'org.sunbird.questionunit.quml',
          'ver': '1.0',
          'src': '/content-plugins/org.sunbird.questionunit.quml-1.0/renderer/plugin.js',
          'type': 'plugin'
      },
      {
          'id': 'org.sunbird.questionunit.quml_css',
          'plugin': 'org.sunbird.questionunit.quml',
          'ver': '1.0',
          'src': '/content-plugins/org.sunbird.questionunit.quml-1.0/renderer/styles/style.css',
          'type': 'css'
      }
    ]
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
      },
      {
        'id': 'org.sunbird.questionunit.quml',
        'ver': '1.0',
        'type': 'plugin',
        'depends': 'org.ekstep.questionunit'
      }
    ]
  },
  'compatibilityVersion': 2
};
export let stageObject = {
  'x': 0,
  'y': 0,
  'w': 100,
  'h': 100,
  'id': '',
  'rotate': null,
  'config': {
    '__cdata': '{\'opacity\':100,\'strokeWidth\':1,\'stroke\':\'rgba(255, 255, 255, 0)\',\'autoplay\':false,\'visible\':true,\'color\':\'#FFFFFF\',\'genieControls\':false,\'instructions\':\'\'}'
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
    '__cdata': {}
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
    '__cdata': {}
  },
  'config': {
    '__cdata': { 'max_score': 1, 'partial_scoring': true, 'isShuffleOption': false, responseDeclaration: {}}
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