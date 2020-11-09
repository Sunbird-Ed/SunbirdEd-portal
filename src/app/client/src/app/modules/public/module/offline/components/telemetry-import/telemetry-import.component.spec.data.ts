export const telemetryData = {

    importList:
    {
        'id': 'api.telemetry.list',
        'ver': '1.0',
        'ts': '2020-02-28T05:36:21.882Z',
        'params': {
            'resmsgid': 'b094fc1e-a3cd-4116-bfce-11a607cc5ca0',
            'msgid': '4e727717-5cc1-406a-b12d-939881c166ab',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'count': 1,
                'items': [
                    {
                        addedUsing: 'telemetry_import',
                        createdOn: 1582897871723,
                        id: '7da61267-e36b-4c44-ae05-9ab103ee771a',
                        name: 'telemetryimport1.zip',
                        progress: 100,
                        status: 'completed',
                        totalSize: 8260
                    },
                    {
                        addedUsing: 'telemetry_import',
                         createdOn: 1584612077262,
                        failedCode: 'MANIFEST_MISSING',
                        failedReason: 'manifest.json is missing in the zip',
                        id: '65bda26a-f77b-4dab-8895-9f58fcecf2bd',
                        name: 'openrap-sunbirded-plugin.zip',
                        progress: 0,
                        status: 'failed',
                        totalSize: 153147
                    }
                ]
            }
        }
    },
    filedetails: {
        'id': 'f5dea98c-8a26-4517-880d-7fd6ea1baa25',
        'name': 'telemetryimport1.zip',
        'progress': 0,
        'addedUsing': 'telemetry_import',
        'totalSize': 8260,
        'createdOn': 1582868060761,
        'status': 'inQueue'
    },
    resourceBundle: {
        messages: {
                etmsg: {
                    desktop: {
                    telemetryImportError: 'Unable to import file. Try again later'
                }
            }
        }
    },
    retryError: {
            'id': 'api.telemetry.import.retry',
            'ver': '1.0',
            'ts': '2020-02-28T06:53:08.654Z',
            'params': {
                'resmsgid': '61574482-f3a7-4a22-9abd-3c80ede40a09',
                'msgid': '6bee283b-61e9-4ba8-835f-25d585a30260',
                'status': 'failed',
                'err': 'ERR_BAD_REQUEST',
                'errmsg': 'Error while processing the request '
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}

    },
    retrySuccess: {
        'id': 'api.telemetry.import.retry',
        'ver': '1.0',
        'ts': '2020-02-28T06:58:42.513Z',
        'params': {
            'resmsgid': 'bdd22f7a-0983-470b-bb23-4da4dca47990',
            'msgid': '5284d3bc-010b-48e4-91a3-02597eb3a6f5',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {}
    }

};
