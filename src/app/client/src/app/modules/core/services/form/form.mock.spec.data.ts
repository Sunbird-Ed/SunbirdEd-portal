export const mockFormData = {
    error: {
        'id': 'api.form.read',
        'ver': '1.0', 'ts': '2018-04-12T12:43:51.570Z',
        'params': {
            'resmsgid': '27319720-3e4f-11e8-9601-6bb03ac3785c',
            'msgid': '272e62d0-3e4f-11e8-ba4c-69964c53fa34',
            'status': 'successful', 'err': null, 'errmsg': null
        }, 'responseCode': 'OK', 'result': { 'tenantPreference': [] }
    },
    success: {
        'id': 'api.form.read',
        'ver': '1.0',
        'ts': '2018-04-12T12:29:30.124Z',
        'params':
            {
                'resmsgid': '25bb5cc0-3e4d-11e8-9601-6bb03ac3785c',
                'msgid': '25b73e10-3e4d-11e8-ba4c-69964c53fa34',
                'status': 'successful', 'err': null, 'errmsg': null
            },
        'responseCode': 'OK',
        'result': {
            'form': {
                'type': 'content', 'action': 'create',
                'subType': 'lessonplan', 'rootOrgId': 'b00bc992ef25f1a9a8d63291e20efc8d',
                'framework': 'NCF', 'data': {
                    'templateName': 'defaultTemplate',
                    'action': 'create',
                    'fields': [{
                        'code': 'name', 'dataType': 'text', 'name': 'Name',
                        'lable': 'Name', 'description': 'Name', 'editable': true,
                        'placeholder': 'Name', 'inputType': 'text', 'required': false,
                        'displayProperty': 'Editable', 'visible': true,
                        'renderingHints': { 'semanticColumnWidth': 'twelve' }, 'index': 1
                    }, {
                        'code': 'board', 'dataType': 'text', 'name': 'Board',
                        'lable': 'Board', 'description': 'Education Board (Like MP Board, NCERT, etc)',
                        'editable': true, 'placeholder': 'Board', 'inputType': 'select',
                        'required': false, 'displayProperty': 'Editable', 'visible': true,
                        'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 2,
                        'depends': ['gradeLevel']
                    }, {
                        'code': 'gradeLevel', 'dataType': 'text',
                        'name': 'Grade', 'lable': 'Grade', 'description': 'Grade', 'editable': true,
                        'placeholder': 'Grade', 'inputType': 'multiSelect', 'required': false,
                        'displayProperty': 'Editable', 'visible': true,
                        'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 3,
                        'depends': ['subject']
                    }, {
                        'code': 'subject', 'dataType': 'text', 'name': 'Subject',
                        'lable': 'Subject', 'description': 'Subject of the Content to use to teach',
                        'editable': true, 'placeholder': 'Grade', 'inputType': 'select', 'required': false,
                        'displayProperty': 'Editable', 'visible': true,
                        'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 4
                    }, {
                        'code': 'medium', 'dataType': 'text', 'name': 'Medium', 'lable': 'Medium',
                        'description': 'Medium of instruction', 'editable': true, 'placeholder': 'Medium',
                        'inputType': 'select', 'required': false, 'displayProperty': 'Editable',
                        'visible': true, 'renderingHints': { 'semanticColumnWidth': 'six' }, 'index': 5
                    }]
                }
            }
        }
    }
};

