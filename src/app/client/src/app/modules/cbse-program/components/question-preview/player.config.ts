
export let PlayerConfig  = {
   config: {
        'showEndPage': false,
        'showStartPage': true,
        'host': '',
        'overlay': {
          'showUser': false
        },
        'splash': {
          'text': '',
          'icon': '',
          'bgImage': 'assets/icons/splacebackground_1.png',
          'webLink': ''
        },
        'apislug': '/action',
        'repos': [
          '/sunbird-plugins/renderer'
        ],
        'plugins': [
          {
            'id': 'org.sunbird.iframeEvent',
            'ver': 1,
            'type': 'plugin'
          },
          {
            'id': 'org.sunbird.player.endpage',
            'ver': 1.1,
            'type': 'plugin'
          }
        ],
        'enableTelemetryValidation': true
      },
      metadata: {
        'mimeType': 'application/vnd.ekstep.ecml-archive',
        'versionKey': '1563952048049',
        'status': 'Draft',
        'pkgVersion': 1,
        'languageCode': [],
      }
};
