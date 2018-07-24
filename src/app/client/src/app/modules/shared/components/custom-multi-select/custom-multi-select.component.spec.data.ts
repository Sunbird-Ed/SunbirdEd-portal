export const Response = {
    field: {
        'code': 'board',
        'dataType': 'text',
        'name': 'Board',
        'label': 'Board',
        'description': 'Education Board (Like MP Board, NCERT, etc)',
        'editable': true,
        'inputType': 'select',
        'required': false,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'semanticColumnWidth': 'three'
        },
        'index': 1,
        'range': [
            {
                'identifier': 'ncf_board_ncert',
                'code': 'ncert',
                'name': 'NCERT',
                'description': '',
                'index': 1,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_cbse',
                'code': 'cbse',
                'name': 'CBSE',
                'description': '',
                'index': 2,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_icse',
                'code': 'icse',
                'name': 'ICSE',
                'description': '',
                'index': 3,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_upboard',
                'code': 'upboard',
                'name': 'State (Uttar Pradesh)',
                'description': 'State (Uttar Pradesh)',
                'index': 4,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_apboard',
                'code': 'apboard',
                'name': 'State (Andhra Pradesh)',
                'description': 'State (Andhra Pradesh)',
                'index': 5,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_tnboard',
                'code': 'tnboard',
                'name': 'State (Tamil Nadu)',
                'description': 'State (Tamil Nadu)',
                'index': 6,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_ncte',
                'code': 'ncte',
                'name': 'NCTE',
                'description': '',
                'index': 7,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_mscert',
                'code': 'mscert',
                'name': 'State (Maharashtra)',
                'description': 'State (Maharashtra)',
                'index': 8,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_bser',
                'code': 'bser',
                'name': 'State (Rajasthan)',
                'description': 'State (Rajasthan)',
                'index': 9,
                'category': 'board',
                'status': 'Live'
            },
            {
                'identifier': 'ncf_board_others',
                'code': 'others',
                'name': 'Other',
                'description': 'Other',
                'index': 10,
                'category': 'board',
                'status': 'Live'
            }
        ]
    },
    inputData: ['NCERT',
        'CBSE',
        'ICSE',
        'State (Uttar Pradesh)' ,
        'State (Andhra Pradesh)' ,
        'State (Tamil Nadu)',
        'NCTE',
        'State (Maharashtra)',
        'State (Rajasthan)',
        'Other'],
        inputData2: [
        'CBSE',
        'ICSE',
        'State (Uttar Pradesh)' ,
        'State (Andhra Pradesh)' ,
        'State (Tamil Nadu)',
        'NCTE',
        'State (Maharashtra)',
        'State (Rajasthan)',
        'Other'],
    selectAll: {
        'NCERT': true,
        'CBSE': true,
        'ICSE': true,
        'State (Uttar Pradesh)': true,
        'State (Andhra Pradesh)': true,
        'State (Tamil Nadu)': true,
        'NCTE': true,
        'State (Maharashtra)': true,
        'State (Rajasthan)': true,
        'Other': true
    },
    selected: {
        'CBSE': true,
        'ICSE': true,
        'State (Uttar Pradesh)': true,
        'State (Andhra Pradesh)': true,
        'State (Tamil Nadu)': true,
        'NCTE': true,
        'State (Maharashtra)': true,
        'State (Rajasthan)': true,
        'Other': true
    },
    selectAllFalse: {
        'NCERT': false,
        'CBSE': false,
        'ICSE': false,
        'State (Uttar Pradesh)': false,
        'State (Andhra Pradesh)': false,
        'State (Tamil Nadu)': false,
        'NCTE': false,
        'State (Maharashtra)': false,
        'State (Rajasthan)': false,
        'Other': false
    }

};
