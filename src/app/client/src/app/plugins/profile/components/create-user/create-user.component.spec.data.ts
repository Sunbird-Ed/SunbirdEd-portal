export const mockRes = {
    formData: [{
        'code': 'name',
        'dataType': 'text',
        'name': 'Name',
        'label': 'Name',
        'description': 'Enter your name',
        'editable': true,
        'inputType': 'input',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'fieldColumnWidth': 'twelve'
        },
        'index': 1
    }, {
        'code': 'tnc',
        'dataType': 'text',
        'name': 'tnc',
        'label': 'I understand and accept the {instance} Terms of Use.',
        'description': '',
        'editable': true,
        'inputType': 'checkbox',
        'required': true,
        'displayProperty': 'Editable',
        'visible': true,
        'renderingHints': {
            'fieldColumnWidth': 'twelve'
        },
        'index': 2
    }],
    tncParsedConfigData: {
        'latestVersion': 'v1',
        'v1': {
            'url': 'https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html'
        },
        'v2': {
            'url': 'https://preprodall.blob.core.windows.net/termsandcond/terms-and-conditions-v2.html'
        },
        'v4': {
            'url': 'https://preprodall.blob.core.windows.net/termsandcond/terms-and-conditions-v4.html'
        }
    },
    tncConfigData: {
        'id': 'api.system.settings.get.tncConfig',
        'ver': 'v1',
        'ts': '2020-05-26 09:10:12:378+0000',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'id': 'tncConfig',
                'field': 'tncConfig',
                'value': '{\'latestVersion\':\'v1\',\'v1\':{\'url\':\'https://dev-sunbird-temp.azureedge.net/portal/terms-and-conditions-v1.html\'},\'v2\':{\'url\':\'https://preprodall.blob.core.windows.net/termsandcond/terms-and-conditions-v2.html\'},\'v4\':{\'url\':\'https://preprodall.blob.core.windows.net/termsandcond/terms-and-conditions-v4.html\'}}'
            }
        }
    },
    createUser: {
        'id': '',
        'ver': 'v4',
        'ts': '2020-05-26 09:46:38:598+0000',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS',
            'userId': '4da27444-7c96-48f3-a85f-d7d82709519d'
        }
    },
    tncAccept: {
        'id': 'api.user.tnc.accept',
        'ver': 'v1',
        'ts': '2020-05-26 09:46:38:767+0000',
        'params': {
            'resmsgid': null,
            'msgid': null,
            'err': null,
            'status': 'success',
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': 'SUCCESS'
        }
    }
};
