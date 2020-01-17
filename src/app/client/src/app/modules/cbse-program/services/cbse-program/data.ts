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
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/assets/audio-icon.png',
        'type': 'image'
      },
      {
        'id': 'org.ekstep.questionunit.renderer.downarrow',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/assets/down_arrow.png',
        'type': 'image'
      },
      {
        'id': 'org.ekstep.questionunit_js',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/components/js/components.js',
        'type': 'js'
      },
      {
        'id': 'org.ekstep.questionunit_css',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/components/css/components.css',
        'type': 'css'
      },
      {
        'id': 'org.ekstep.questionunit',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/plugin.js',
        'type': 'plugin'
      },
      {
        'id': 'org.ekstep.questionunit_manifest',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/manifest.json',
        'type': 'json'
      },
      {
          'id': 'org.sunbird.questionunit.quml_manifest',
          'plugin': 'org.sunbird.questionunit.quml',
          'ver': '1.1',
          'src': '/content-plugins/org.sunbird.questionunit.quml-1.1/manifest.json',
          'type': 'json'
      },
      {
          'id': 'org.sunbird.questionunit.quml.plugin_js',
          'plugin': 'org.sunbird.questionunit.quml',
          'ver': '1.1',
          'src': '/content-plugins/org.sunbird.questionunit.quml-1.1/renderer/plugin.js',
          'type': 'plugin'
      },
      {
        'id': 'org.sunbird.questionunit.quml.feedback_popup',
        'plugin': 'org.sunbird.questionunit.quml',
        'ver': '1.1',
        'src': '/content-plugins/org.sunbird.questionunit.quml-1.1/renderer/utils/quml_feedback_popup.js',
        'type': 'js'
      },
      {
          'id': 'org.sunbird.questionunit.quml.feedback_close',
          'plugin': 'org.sunbird.questionunit.quml',
          'ver': '1.1',
          'src': '/content-plugins/org.sunbird.questionunit.quml-1.1/renderer/assets/feedback-close.svg',
          'type': 'image'
      },
      {
      'id': 'org.sunbird.questionunit.quml.play',
      'plugin': 'org.sunbird.questionunit.quml',
      'ver': '1.1',
      'src': '/content-plugins/org.sunbird.questionunit.quml-1.1/renderer/assets/player-play-button.png',
      'type': 'image'
      },
      {
          'id': 'org.sunbird.questionunit.quml_css',
          'plugin': 'org.sunbird.questionunit.quml',
          'ver': '1.1',
          'src': '/content-plugins/org.sunbird.questionunit.quml-1.1/renderer/styles/style.css',
          'type': 'css'
      },
      {
        'id': '4b2b66a2-9c5b-42d5-891d-ec0c3d1d516c',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/katex.min.js',
        'type': 'js'
      },
      {
        'id': '7e02c56a-c048-444d-bb2a-d4b854723adc',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/katex.min.css',
        'type': 'css'
      },
      {
        'id': '04ad980a-88ac-4c55-a597-266e42240670',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_main-bold.ttf',
        'type': 'js'
      },
      {
        'id': '75ab3bcd-2c52-47b0-8b46-b635256ce06a',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_main-bolditalic.ttf',
        'type': 'js'
      },
      {
        'id': '098cc69e-8658-483e-8597-8c392a1b3545',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_main-italic.ttf',
        'type': 'js'
      },
      {
        'id': '102d1165-9544-480b-9ec1-1cb83937e650',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_main-regular.ttf',
        'type': 'js'
      },
      {
        'id': '3bc5dce9-51ca-4a59-a0d9-d87d47c44670',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_math-bolditalic.ttf',
        'type': 'js'
      },
      {
        'id': 'a95bb693-d688-4e7a-a9bc-08e0cb6d1d62',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_math-italic.ttf',
        'type': 'js'
      },
      {
        'id': '15757105-9023-4773-ba2a-8e619a0dc3a6',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_math-regular.ttf',
        'type': 'js'
      },
      {
        'id': '5b1a9e58-8b7e-4295-a90d-593dc831262a',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_size1-regular.ttf',
        'type': 'js'
      },
      {
        'id': 'bc6ee547-9db0-480e-b298-b5509d43207a',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_size2-regular.ttf',
        'type': 'js'
      },
      {
        'id': '35b0245e-d7d3-4ac0-9cac-6c2c328c8948',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_size3-regular.ttf',
        'type': 'js'
      },
      {
        'id': '80a19118-48eb-4859-9b0c-576a90a01148',
        'plugin': 'org.ekstep.questionunit',
        'ver': '1.1',
        'src': '/content-plugins/org.ekstep.questionunit-1.1/renderer/libs/katex/fonts/katex_size4-regular.ttf',
        'type': 'js'
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
        'ver': '1.1',
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
        'ver': '1.1',
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
    // tslint:disable-next-line:max-line-length
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
  'pluginVer': '1.1',
  'templateId': 'qumltemplate',
  'data': {
    '__cdata': {}
  },
  'config': {
    '__cdata': { 'max_score': 1, 'partial_scoring': false, 'isShuffleOption': false, responseDeclaration: {}}
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
