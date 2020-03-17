export const telemetry = {

    info: {
        'id': 'api.telemetry.info',
        'ver': '1.0',
        'ts': '2020-03-16T11:18:52.209Z',
        'params': {
            'resmsgid': '39cbc318-aa9c-4b6c-81a4-1f73132248e5',
            'msgid': '3c630f04-d450-48b1-b5ad-023ff8401cdf',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'totalSize': 10,
                'lastExportedOn': 1584354597446,
                'networkInfo': {
                    'forceSyncInfo': [
                        {
                            'type': 'TELEMETRY',
                            'lastSyncedOn': 1584357526576
                        }
                    ]
                }
            }
        }
    },
    exportSuccess: {
        'id': 'api.telemetry.export',
        'ver': '1.0',
        'ts': '2020-02-04T10:17:38.770Z',
        'params': {
            'resmsgid': '0def3ada-2954-442f-9699-fbe3430ad97b',
            'msgid': '191ef3b3-e4ed-43ea-864e-a09f8edd8654',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'success'
        }
    },
    exportError: {
        'id': 'api.telemetry.export',
        'ver': '1.0',
        'ts': '2020-02-04T10:13:18.536Z',
        'params': {
            'resmsgid': '2f024633-0abd-4076-b1fb-140b12bd7e94',
            'msgid': '64f6f7d3-ead9-4590-9777-1aa84f77b8fa',
            'status': 'failed',
            'err': 'BAD_REQUEST',
            'errmsg': 'Destination path is missing'
        },
        'error': {
            'responseCode': 'CLIENT_ERROR',
        },
        'result': {}
    },
    resourceBundle: {
        messages: {
            smsg: {
               desktop: {
                telemetryExportSMsg: 'Telemetry Exported Successfully'
               }
            },
            emsg: {
                desktop: {
                    telemetryExportEMsg: 'Telemetry Export Failed. Please try again later....',
                    telemetryInfoEMsg: 'Unable to get telemetry info. Please try again later...',
                    connectionError: 'Connect to the Internet to sync telemetry',
                    telemetrySyncError: 'Could not sync the telemetry, try again later'
                }
            }
        }
    },

    getSyncStatus: {
        enable:  {
            'id': 'api.telemetry.config.info',
            'ver': '1.0',
            'ts': '2020-03-13T05:06:36.931Z',
            'params': {
                'resmsgid': '41610c13-8de9-4ca0-b212-704590abca68',
                'msgid': 'da9d3640-1508-4039-9518-deb892e6b4ac',
                'status': 'successful',
                'err': null,
                'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
                'enable': true,
                'updatedOn': 1584075434474
            }
        },
        disable:  {
            'id': 'api.telemetry.config.info',
            'ver': '1.0',
            'ts': '2020-03-13T05:06:36.931Z',
            'params': {
                'resmsgid': '41610c13-8de9-4ca0-b212-704590abca68',
                'msgid': 'da9d3640-1508-4039-9518-deb892e6b4ac',
                'status': 'successful',
                'err': null,
                'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
                'enable': false,
                'updatedOn': 1584075434474
            }
        }
    },
    updateSyncStatus : {
        'id': 'api.telemetry.set.config',
        'ver': '1.0',
        'ts': '2020-03-13T06:17:16.499Z',
        'params': {
            'resmsgid': 'd82f5333-f508-44f8-b40c-2fb54292b873',
            'msgid': '6c5dd5a2-67fd-4995-95da-8fa1a87fcc38',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'message': 'Successfully updated'
        }
    },
    telemetrySync: {
        success: {
            'id': 'api.desktop.sync',
            'ver': '1.0',
            'ts': '2020-03-15T17:32:46.663Z',
            'params': {
                'resmsgid': '647f6a26-4a20-401c-a41c-386c35406090',
                'msgid': '0fdd9983-a7fb-4797-8c84-768dd7468e04',
                'status': 'successful',
                'err': null,
                'errmsg': null
            },
            'responseCode': 'OK',
            'result': {}
        },
        error: {
            'id': 'api.desktop.sync',
            'ver': '1.0',
            'ts': '2020-03-15T17:14:10.860Z',
            'params': {
                'resmsgid': 'd4bbd3a4-929a-46c7-a898-2b536a0d639f',
                'msgid': 'f86b2585-e518-49e2-9a64-873e8dcce745',
                'status': 'failed',
                'err': 'Forbidden',
                'errmsg': 'No credentials found for given iss '
            },
            'responseCode': 'INTERNAL_SERVER_ERROR',
            'result': {}
        }
    }
};

