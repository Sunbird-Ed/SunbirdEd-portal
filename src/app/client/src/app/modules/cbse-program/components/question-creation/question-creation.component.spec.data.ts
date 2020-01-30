export const inputData = {
    questionMetaData : {
        'mode': 'edit',
        'data': {
            'itemType': 'UNIT',
            'code': '43303a62-71de-20a1-a4ac-d42acc861438',
            'subject': 'Math',
            'qlevel': 'MEDIUM',
            'qumlVersion': 1,
            'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
            'responseDeclaration': {
            'responseValue': {
                'cardinality': 'single',
                'type': 'string',
                'correct_response': {
                // tslint:disable-next-line:max-line-length
                'value': '<p>asdkhkh</p><figure class="image"><img src="/assets/public/content/14550337729157.15.png" alt="7.15_clock" data-asset-variable="7.15_clock"></figure>'
                }
            }
            },
            'organisation': ['My School'],
            'language': ['English'],
            'media': [
            {
                'id': 'KP_FT_1579596034155',
                // tslint:disable-next-line:max-line-length
                'src': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/kp_ft_1579596034155/artifact/sample_1579596034226.mp4',
                'type': 'video',
                'assetId': 'KP_FT_1579596034155',
                'name': 'KP Integration Test Asset',
                // tslint:disable-next-line:max-line-length
                'thumbnail': 'https://sunbirddev.blob.core.windows.net/sunbird-content-dev/content/kp_ft_1579596034155/artifact/1579596035200.thumb.png'
            },
            {
                'id': '7.15_clock',
                'type': 'image',
                'src': '/assets/public/content/14550337729157.15.png',
                'baseUrl': 'https://programs.diksha.gov.in'
            }
            ],
            'program': 'NEW PROGRAM',
            'medium': 'English',
            'type': 'reference',
            'templateId': 'NA',
            'editorState': {
            'question': '<p>Testing Question</p>',
            // tslint:disable-next-line:max-line-length
            'answer': '<p>asdkhkh</p><figure class="image"><img src="/assets/public/content/14550337729157.15.png" alt="7.15_clock" data-asset-variable="7.15_clock"></figure>',
            'solutions': [
                {
                'id': '6365495a-8680-d46f-6987-e16c46252c10',
                'type': 'video',
                'value': 'KP_FT_1579596034155'
                }
            ]
            },
            'body': '<p>Testing Answer</p>',
            'createdOn': '2020-01-22T09:14:35.095+0000',
            'gradeLevel': ['Kindergarten'],
            'appId': 'local.sunbird.portal',
            'lastUpdatedOn': '2020-01-22T10:01:22.752+0000',
            'identifier': 'do_1129407752199864321441',
            'creator': 'Reviewer User HEllo',
            'lastStatusChangedOn': '2020-01-22T09:14:35.095+0000',
            'question': null,
            'author': 'Reviewer User',
            'consumerId': '5ce581d4-20cb-4845-a679-a638dc0f100c',
            'solutions': [
            {
                'id': '6365495a-8680-d46f-6987-e16c46252c10',
                'type': 'video',
                'value': 'KP_FT_1579596034155'
            }
            ],
            'bloomsLevel': ['apply', 'understand'],
            'version': 3,
            'versionKey': '1579687282752',
            'license': '@+kp_ft_license_181026718',
            'framework': 'NCFCOPY',
            'rejectComment': '',
            'name': 'vsa_NCFCOPY',
            'topic': ['Topic 4'],
            'template_id': 'NA',
            'category': 'VSA',
            'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
            'board': 'NCERT',
            'status': 'Draft'
        }
    },
    sessionContext : {
        'framework': 'NCFCOPY',
        'currentRole': 'CONTRIBUTOR',
        'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
        'program': 'NEW PROGRAM',
        'onBoardSchool': 'My School',
        'board': 'NCERT',
        'medium': ['English'],
        'gradeLevel': ['Kindergarten'],
        'subject': ['Math'],
        'topic': null,
        'currentRoleId': 1,
        'collection': 'do_1127638981486755841123',
        'collectionName': 'Math-Magic',
        'lastOpenedUnitChild': 'do_1127639026795233281128',
        'lastOpenedUnitParent': 'do_1127639026795233281128',
        'resourceIdentifier': 'do_1129407728444211201115',
        'questionType': 'vsa',
        'textBookUnitIdentifier': 'do_1127639026795233281128',
        'practiceSetConfig': {
          'id': 'ng.sunbird.practiceSetComponent',
          'ver': '1.0',
          'compId': 'practiceSetComponent',
          'author': 'Kartheek',
          'description': '',
          'publishedDate': '',
          'data': {},
          'config': {
            'No of options': 4,
            'solutionType': ['Video', 'Text & image'],
            'questionCategory': ['vsa', 'sa', 'ls', 'mcq', 'curiosity'],
            'formConfiguration': [
              {
                'code': 'learningOutcome',
                'dataType': 'list',
                'description': 'Learning Outcomes For The Content',
                'editable': true,
                'inputType': 'multiselect',
                'label': 'Learning Outcome',
                'name': 'LearningOutcome',
                'placeholder': 'Select Learning Outcomes',
                'required': false,
                'visible': true
              },
              {
                'code': 'bloomsLevel',
                'dataType': 'list',
                'description': 'Learning Level For The Content',
                'editable': true,
                'inputType': 'multiselect',
                'label': 'Learning Level',
                'name': 'LearningLevel',
                'placeholder': 'Select Learning Levels',
                'required': true,
                'visible': true,
                'defaultValue': [
                  'remember',
                  'understand',
                  'apply',
                  'analyse',
                  'evaluate',
                  'create'
                ]
              },
              {
                'code': 'creator',
                'dataType': 'text',
                'description': 'Enter The Author Name',
                'editable': true,
                'inputType': 'text',
                'label': 'Author',
                'name': 'Author',
                'placeholder': 'Enter Author Name',
                'required': true,
                'visible': true
              },
              {
                'code': 'license',
                'dataType': 'list',
                'description': 'License For The Content',
                'editable': true,
                'inputType': 'select',
                'label': 'License',
                'name': 'License',
                'placeholder': 'Select License',
                'required': true,
                'visible': true
              }
            ],
            'resourceTitleLength': '200',
            'tenantName': '',
            'assetConfig': {
              'image': {'size': '50'},
              'video': {'size': '50', 'accepted': 'pdf, mp4, webm, youtube'}
            }
          }
        },
        'contentMetadata': {
          'ownershipType': ['createdBy'],
          'unitIdentifiers': ['do_1127639026795233281128'],
          'plugins': '[{"identifier":"org.sunbird.questionunit.quml","semanticVersion":"1.1"}]',
          'subject': ['Math'],
          'channel': 'b00bc992ef25f1a9a8d63291e20efc8d',
          'language': ['English'],
          'program': 'NEW PROGRAM',
          'mimeType': 'application/vnd.ekstep.ecml-archive',
          'objectType': 'Content',
          'gradeLevel': ['Kindergarten'],
          // tslint:disable-next-line:max-line-length
          'appIcon': 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31281765358595276811728/artifact/qa_1561455529937.thumb.png',
          'appId': 'local.sunbird.portal',
          'contentEncoding': 'gzip',
          'lockKey': '135c1fdf-d736-43a2-acb6-18ec5b9091ec',
          'contentType': 'PracticeQuestionSet',
          'identifier': 'do_1129407728444211201115',
          'audience': ['Learner'],
          'visibility': 'Default',
          'author': 'Reviewer User',
          'consumerId': '273f3b18-5dda-4a27-984a-060c7cd398d3',
          'mediaType': 'content',
          'itemSets': [
            {
              'identifier': 'do_1129407728574627841145',
              'name': 'VSA',
              'description': 'Practice QuestionSet',
              'objectType': 'ItemSet',
              'relation': 'associatedTo',
              'status': 'Draft'
            }
          ],
          'osId': 'org.ekstep.quiz.app',
          'languageCode': ['en'],
          'version': 2,
          'license': 'CC BY 4.0',
          'name': 'VSA',
          'rejectComment': '',
          'topic': ['Topic 4'],
          'attributions': ['My School'],
          'status': 'Draft',
          'code': 'ec89cd01-e038-4e90-33ca-e7961f3aec2e',
          'medium': ['English'],
          'idealScreenSize': 'normal',
          'createdOn': '2020-01-22T09:09:45.114+0000',
          'contentDisposition': 'inline',
          'lastUpdatedOn': '2020-01-22T09:58:11.501+0000',
          'dialcodeRequired': 'No',
          'editorVersion': 3,
          'lastStatusChangedOn': '2020-01-22T09:09:45.114+0000',
          'creator': 'Reviewer User',
          'os': ['All'],
          'questionCategories': ['VSA'],
          'versionKey': '1579687091501',
          'idealScreenDensity': 'hdpi',
          'framework': 'NCFCOPY',
          'createdBy': '95e4942d-cbe8-477d-aebd-ad8e6de4bfc8',
          'compatibilityLevel': 1,
          'board': 'NCERT',
          'programId': '31ab2990-7892-11e9-8a02-93c5c62c03f1',
          'resourceType': 'Learn'
        },
        'resourceStatus': 'Draft',
        'licencesOptions': [
          'CC BY 4.0',
          'CC BY-NC 4.0',
          'CC BY-NC-SA 4.0',
          'CC BY-SA 4.0',
          'CC BY4.0'
        ],
        'questionList': ['do_1129407752199864321441'],
        'isReadOnlyMode': false,
        'questionsIds': [
          'do_1129407752199864321441',
          'do_1129407748288839681440',
          'do_1129407744678952961439'
        ]
      },
    telemetryEventsInput: {
        'telemetryInteractObject': {
          'id': 'do_1127638981486755841123',
          'type': 'Content',
          'ver': '1.0'
        },
        'telemetryInteractCdata': [
          {'type': '94f78180-3ce4-11ea-990a-7546c833aa3d', 'id': 'Program'}
        ],
        'telemetryInteractPdata': {
          'id': 'local.sunbird.portal',
          'ver': '2.7.0',
          'pid': 'sunbird-portal.programs'
        }
      },
    role: {
        currentRole: 'CONTRIBUTOR'
    }
};

