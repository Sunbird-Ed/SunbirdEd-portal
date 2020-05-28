export const chartsArray = [
    {
        'bigNumbers': [
            {
                'footer': 'Total qr scans on device',
                'header': 'CBSE: Devices playing',
                'dataExpr': 'Total QR scans'
            },
            {
                'footer': 'Percentage (%) of Failed QR Scans',
                'header': 'CBSE: Devices playing',
                'dataExpr': 'Percentage (%) of Failed QR Scans'
            }
        ]
    }
];

export const chartMetaData = {
    data: [],
    metadata: {
        lastUpdatedOn: '12-12-2020'
    }
};

export const getFileMetaDataInput = [
    {
        'id': 'first',
        'path': '/reports/fetch/hawk-eye/daily_plays_by_mode.json'
    },
    {
        'id': 'second',
        'path': '/reports/fetch/hawk-eye/daily_quiz_play_by_lang.json'
    }
];

export const reportMetaDataApiResponse = {
    'first': {
        'lastModified': 'Fri, 08 May 2020 01:43:00 GMT',
        'reportname': 'first',
        'statusCode': 200
    },
    'second': {
        'lastModified': 'Fri, 08 May 2020 01:43:04 GMT',
        'reportname': 'second',
        'statusCode': 200
    }
};

export const getLatestLastModifiedOnDateFn = [
    {
        'result': {},
        'id': 'first',
        'lastModifiedOn': 'Fri, 08 May 2020 01:43:00 GMT'
    },
    {
        'result': {},
        'id': 'second',
        'lastModifiedOn': 'Fri, 08 May 2020 01:43:04 GMT'
    }
];
