export const mockListApiResponse = {
    'reports': [
        {
            'reportid': 'd0fd5dfb-6bcf-4382-ba6d-fbb07552660d',
            'title': 'DIKSHA Usage Report',
            'description': 'This report provides details of DIKSHA usage',
            'authorizedroles': [
                'ORG_ADMIN'
            ],
            'status': 'live',
            'type': 'public',
            'reportaccessurl': '"https://dev.sunbirded.org"/dashBoard/reports/d0fd5dfb-6bcf-4382-ba6d-fbb07552660d',
            'createdon': '2020-04-14T14:28:09.965Z',
            'updatedon': '2020-04-15T13:33:43.000Z',
            'createdby': 'ravinder kumar',
            'reportconfig': {
            },
            'templateurl': null,
            'slug': 'sunbird',
            'reportgenerateddate': '2020-04-12T00:00:00.000Z',
            'reportduration': {
                'enddate': 'Sun Apr 12 2020',
                'startdate': 'Sun Apr 12 2020'
            },
            'tags': [
                'Consumption',
                'Engagement'
            ],
            'updatefrequency': 'DAILY'
        }
    ],
    'count': 1
};

export const mockTableStructureForReportViewer = {
    'table': {
        'header': [
            'reportid',
            'Title',
            'Description',
            'Last Updated Date',
            'Tags',
            'Update Frequency'
        ],
        'data': [
            [
                'd0fd5dfb-6bcf-4382-ba6d-fbb07552660d',
                'DIKSHA Usage Report',
                'This report provides details of DIKSHA usage',
                '2020-04-12T00:00:00.000Z',
                [
                    'Consumption',
                    'Engagement'
                ],
                'DAILY'
            ]
        ],
        'defs': [],
        'options': {
            'searching': true
        }
    },
    'count': 1
};

export const mockTableStructureForReportAdmin = {
    'table': {
        'header': [
            'reportid',
            'Title',
            'Description',
            'Last Updated Date',
            'Tags',
            'Update Frequency',
            'Status'
        ],
        'data': [
            [
                'd0fd5dfb-6bcf-4382-ba6d-fbb07552660d',
                'DIKSHA Usage Report',
                'This report provides details of DIKSHA usage',
                '2020-04-12T00:00:00.000Z',
                [
                    'Consumption',
                    'Engagement'
                ],
                'DAILY',
                'live'
            ]
        ],
        'defs': [],
        'options': {
            'searching': true
        }
    },
    'count': 1
};
