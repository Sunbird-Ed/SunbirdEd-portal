export const ofline_report_issues_spect_data = {
    noNetworkError: {
        'id': 'api.report.issue',
        'ver': '1.0',
        'ts': '2019-12-03T15:57:56.452Z',
        'params': {
            'resmsgid': '8da3096d-8c60-4457-aeb9-c54aa0d6984f',
            'msgid': '5cc74b5c-981b-43d8-a735-48f3dd937ba2',
            'status': 'failed',
            'err': 'NETWORK_UNAVAILABLE',
            'errmsg': 'Network unavailable'
        },
        'responseCode': 'CLIENT_ERROR',
        'result': {}
    },
    freshDeskError: {
        'id': 'api.report.issue',
        'ver': '1.0',
        'ts': '2019-12-03T16:32:51.278Z',
        'params': {
            'resmsgid': '88eaa8d2-1c59-4cde-8c19-b2fceeed8b03',
            'msgid': '604485f0-d572-4564-957a-38bdfc0ce73f',
            'status': 'failed',
            'err': 'FRESH_DESK_API_ERROR',
            'errmsg': 'Request failed with status code 404'
        },
        'responseCode': 'RESOURCE_NOT_FOUND',
        'result': {}

    }

};
