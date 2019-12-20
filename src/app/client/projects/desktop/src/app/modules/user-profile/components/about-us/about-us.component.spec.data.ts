export const appInfoResponse = {
    appInfo:  {
        'result': {
            'version': '1.0.2',
            'releaseDate': '16 December 2019',
            'deviceId': 'did1234',
            'languages': 'English, Hindi, Telugu, Kannada',
            'updateInfo': {
                'updateAvailable': true,
                'url': 'http://localhost:3000/app/v1/pdf',
                'version': '1.0.3'
            }
          }
    },
    resourceBundle: {
        instance: 'tenant',
        frmelmnts: {
            lbl: {
                versionKey: 'Version:',
                deviceId: 'DeviceID',
                supportedLanguages: 'Supported Languages:',
                releaseDateKey: 'Release Date:',
                desktop: {
                    updateAvailable: 'Update available for version',
                    update: 'Update {instance} Desktop',
                    app: '{instance} Lite Desktop App'
                }
            }
        }
    }
};
