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
                                'dataExpr': 'prod.diksha.app'
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
