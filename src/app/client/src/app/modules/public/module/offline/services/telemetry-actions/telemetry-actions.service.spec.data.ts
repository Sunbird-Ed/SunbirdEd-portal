export const telemetry = {

    info: {
        'id': 'api.telemetry.info',
        'ver': '1.0',
        'ts': '2020-02-04T10:14:22.087Z',
        'params': {
            'resmsgid': '687fa067-8296-449d-a61b-b910def2e01f',
            'msgid': '2a714441-e9b4-4e15-bc8e-efa993719ed2',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'totalSize': 0,
                'lastExportedOn': null
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
                        'id': 'f5dea98c-8a26-4517-880d-7fd6ea1baa25',
                        'name': 'telemetryimport1.zip',
                        'progress': 0,
                        'addedUsing': 'telemetry_import',
                        'totalSize': 8260,
                        'createdOn': 1582868060761,
                        'status': 'inQueue'
                    }
                ]
            }
        }
    },
    retryData: {

        'id': 'f5dea98c-8a26-4517-880d-7fd6ea1baa25',
        'name': 'telemetryimport1.zip',
        'progress': 0,
        'addedUsing': 'telemetry_import',
        'totalSize': 8260,
        'createdOn': 1582868060761,
        'status': 'inQueue'
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
    },
    syncStatusInfo: {
        'id': 'api.telemetry.config.info',
        'ver': '1.0',
        'ts': '2020-03-13T06:37:56.668Z',
        'params': {
            'resmsgid': '0dc7cbb7-930a-42f2-9157-ea75da7fc483',
            'msgid': '4ae2c70c-2fbe-4efd-b386-131a4ad82277',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'enable': true,
            'updatedOn': 1584080236493
        }
    },
    updateSyncStatus: {
        'id': 'api.telemetry.set.config',
        'ver': '1.0',
        'ts': '2020-03-13T09:13:29.806Z',
        'params': {
            'resmsgid': '6ff86766-fbf2-4462-8609-afa229166f4e',
            'msgid': '8a8f2049-db96-4099-bd5e-d2b00766062a',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'message': 'Successfully updated'
        }
    },
    syncTelemetry: {
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
