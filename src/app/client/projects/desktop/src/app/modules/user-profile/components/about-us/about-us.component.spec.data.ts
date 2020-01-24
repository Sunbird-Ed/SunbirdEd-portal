export const appInfoResponse = {
    appInfo:  {
        'result': {
            'termsOfUseUrl': 'http://localhost:4000/abc.html',
            'version': '1.0.2',
            'releaseDate': `${Date.now()}`,
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
                termsOfUseUrl: 'http://localhost:4000/abc.html',
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
        },
    messages: {
        stmsg: {
            m0129: 'Loading the Terms and Conditions.',
        },
        emsg: {
            desktop: {
                termsOfUse: 'Unable to get Terms Of Use. Please Try Again Later...'
            }
        }
    }
    }
};
