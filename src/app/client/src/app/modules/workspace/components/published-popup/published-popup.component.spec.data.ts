export const mockRes = {
    publishedChecklist: {
        'id': 'api.form.read',
        'ver': '1.0',
        'ts': '2018-08-17T06:37:05.957Z',
        'params': {
            'resmsgid': 'f549c550-a1e7-11e8-878a-15765c6b84c0',
            'msgid': 'f5402860-a1e7-11e8-9874-491016c3ee39',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'form': {
                'type': 'content',
                'subType': 'resource',
                'action': 'publishchecklist',
                'data': {
                    'templateName': 'defaultTemplate',
                    'action': 'publishChecklist',
                    'fields': [
                        {
                            'title': 'Please confirm that ALL the following ',
                            'contents': [
                                {
                                    'name': 'Appropriateness',
                                    'checkList': [
                                        'No Hate speech, Abuse, Violence, Profanity',
                                        'No Sexual content, Nudity or Vulgarity',
                                        'No Discrimination or Defamation',
                                        'Is suitable for children'
                                    ]
                                },
                                {
                                    'name': 'Content details',
                                    'checkList': [
                                        'Appropriate Title, Description',
                                        'Correct Board, Grade, Subject, Medium',
                                        'Appropriate tags such as Resource Type, Concepts',
                                        'Relevant Keywords'
                                    ]
                                },
                                {
                                    'name': 'Usability',
                                    'checkList': [
                                        'Content plays correctly',
                                        'Can see the content clearly on Desktop and App',
                                        'Audio (if any) is clear and easy to understand',
                                        'No Spelling mistakes in the text',
                                        'Language is simple to understand'
                                    ]
                                }
                            ]
                        }
                    ]
                }
            }
        }
    }
};
