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
};
