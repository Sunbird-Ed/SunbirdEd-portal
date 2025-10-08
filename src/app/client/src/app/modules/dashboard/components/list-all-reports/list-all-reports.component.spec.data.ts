export const data = [
    {
        'reportid': '025cdcf4-01db-4b05-8aa2-2f48c5664bee',
        'title': 'Test Dataset',
        'description': 'Test Report description',
        'authorizedroles': [
            'ORG_ADMIN'
        ],
        'status': 'draft',
        'visibility': 'private',
        'reportaccessurl': 'https://dev.sunbirded.org/dashBoard/reports/025cdcf4-01db-4b05-8aa2-2f48c5664bee',
        'createdon': '2020-08-10T07:25:32.606Z',
        'updatedon': '2020-08-24T05:26:44.000Z',
        'createdby': 'ravinder kumar',
        'reportconfig': {},
        'templateurl': null,
        'slug': 'sunbird',
        'reportgenerateddate': '2020-04-12T00:00:00.000Z',
        'reportduration': {
            'enddate': 'Thu May 7 2020',
            'startdate': 'Thu May 7 2020'
        },
        'tags': [
            'Consumption',
            'Engagement'
        ],
        'updatefrequency': 'DAILY',
        'parameters': [
            '$channel'
        ],
        'type': 'dataset',
        'isParameterized': true
    },
    {
        'reportid': 'c2e6405a-7e8d-4d7e-b99d-d1b92fd54674',
        'title': 'Test Report',
        'description': 'Test Report description',
        'authorizedroles': [
            'ORG_ADMIN'
        ],
        'status': 'live',
        'visibility': 'private',
        'reportaccessurl': 'https://dev.sunbirded.org/dashBoard/reports/c2e6405a-7e8d-4d7e-b99d-d1b92fd54674',
        'createdon': '2020-08-10T07:25:25.738Z',
        'updatedon': '2020-08-10T07:25:25.738Z',
        'createdby': 'ravinder kumar',
        'reportconfig': {},
        'templateurl': null,
        'slug': 'sunbird',
        'reportgenerateddate': '2020-04-12T00:00:00.000Z',
        'reportduration': {
            'enddate': 'Thu May 7 2020',
            'startdate': 'Thu May 7 2020'
        },
        'tags': [
            'Consumption',
            'Engagement'
        ],
        'updatefrequency': 'DAILY',
        'parameters': null,
        'type': 'report',
        'isParameterized': false
    }
];

export const mockListApiResponse = {
    'reports': [
        {
            'reportid': 'd0fd5dfb-6bcf-4382-ba6d-fbb07552660d',
            'title': 'SUNBIRD Usage Report',
            'description': 'This report provides details of SUNBIRD usage',
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


export const mockParameterizedReports = {
    'reports': [
        {
            'reportid': 'a8971368-34a4-412d-8532-eea6c0fd9e70',
            'title': 'Board wise Report',
            'description': 'National Quiz Reports',
            'authorizedroles': [
                'ORG_ADMIN'
            ],
            'status': 'draft',
            'type': 'public',
            'createdon': '2020-07-07T13:06:47.847Z',
            'updatedon': '2020-07-07T13:06:47.847Z',
            'createdby': 'ravinder kumar',
            'reportconfig': {
                'id': 'national_quiz_reports',
                'label': 'National Quiz Reports',
                'table': {
                    'valuesExpr': 'tableData',
                    'columnsExpr': 'keys'
                },
                'title': 'National Quiz Reports',
                'charts': [
                    {
                        'id': 'first',
                        'options': {
                            'title': {
                                'text': 'Daily Quiz Plays- by Mode',
                                'display': true,
                                'fontSize': 16
                            },
                            'legend': {
                                'display': true
                            },
                            'scales': {
                                'xAxes': [
                                    {
                                        'scaleLabel': {
                                            'display': true,
                                            'labelString': 'Date'
                                        }
                                    }
                                ],
                                'yAxes': [
                                    {
                                        'scaleLabel': {
                                            'display': true,
                                            'labelString': 'Content Plays'
                                        }
                                    }
                                ]
                            },
                            'tooltips': {
                                'mode': 'x-axis',
                                'intersect': false,
                                'bodySpacing': 5,
                                'titleSpacing': 5
                            },
                            'responsive': true
                        },
                        'datasets': [
                            {
                                'fill': false,
                                'label': 'app',
                                'dataExpr': 'prod.sunbird.app'
                            }
                        ],
                        'chartType': 'line',
                        'dataSource': {
                            'ids': [
                                'first'
                            ],
                            'commonDimension': 'date'
                        },
                        'labelsExpr': 'Date'
                    }
                ],
                'dataSource': [],
                'description': 'National Quiz Reports',
                'reportLevelDataSourceId': 'first'
            },
            'templateurl': null,
            'slug': 'sunbird',
            'reportgenerateddate': '2020-04-12T00:00:00.000Z',
            'reportduration': {
                'enddate': 'Thu May 7 2020',
                'startdate': 'Thu May 7 2020'
            },
            'tags': [
                'Consumption',
                'Engagement'
            ],
            'updatefrequency': 'DAILY',
            'parameters': [
                '$board'
            ],
            'children': [
                {
                    'reportid': 'a8971368-34a4-412d-8532-eea6c0fd9e70',
                    'hashed_val': 'Q0JTRQ==',
                    'status': 'live'
                },
                {
                    'reportid': 'a8971368-34a4-412d-8532-eea6c0fd9e70',
                    'hashed_val': 'SUNTRQ==',
                    'status': 'live'
                }
            ],
            'isParameterized': true
        }
    ],
    count: 1
};
