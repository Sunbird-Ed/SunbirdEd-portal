export const actionsData = {
    collectionId: 'do_31280207754511974412082',
    resourceBundle: {
        messages: {
            fmsg: {
                m0096: 'Could not Update. Try again later',
                m0091: 'Could not copy content. Try again later',
                m0090: 'Could not download. Try again later'
            },
            stmsg: {
                m0138: 'FAILED',
                m0140: 'DOWNLOADING',
                desktop: {
                    deleteContentSuccessMessage: 'Content deleted successfully',
                }
            },
            etmsg: {
                deleteContentErrorMessage: 'Unable to delete content. Please try again..',
            },
            smsg: {
                m0059: 'Content successfully copied',
                m0056: 'You should be online to update the content'
            }
        }
    },
    downloadList:
    {
        'id': 'api.content.download.list',
        'ver': '1.0',
        'ts': '2020-01-09T09:36:46.405Z',
        'params': {
            'resmsgid': '3580f558-7f76-4fc2-8b8a-4c568f321e27',
            'msgid': '7669e658-9248-459c-be11-c9f83efc9e1a',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'response': {
                'contents': [
                    {
                        'id': '264c47da-2436-4652-9214-b89ad11778f0',
                        'contentId': 'do_31276385539644620815652',
                        'identifier': 'do_31276385539644620815652',
                        'resourceId': 'do_31275241153060864018150',
                        'mimeType': 'application/vnd.ekstep.content-collection',
                        'name': '10 ವಿಜ್ಞಾನ ಭಾಗ 2',
                        'status': 'completed',
                        'createdOn': 1578562459472,
                        'pkgVersion': 3,
                        'contentType': 'TextBook',
                        'addedUsing': 'download'
                    }
                ]
            }
        }
    },
    contentData: {
        artifactUrl: 'do_31275241153060864018150/1556698449702_do_31275241153060864018150.zip',
        audience: ['Learner'],
        baseDir: 'content/do_31275241153060864018150',
        board: 'State (Karnataka)',
        channel: 'in.ekstep',
        contentType: 'Resource',
        desktopAppMetadata: {
            addedUsing: 'download',
            createdOn: 1578562460132, updatedOn: 1578562460132,
            isAvailable: true, lastUpdateCheckedOn: 1578562537306,
            updateAvailable: true
        },
        downloadStatus: 'DOWNLOADED',
        downloadUrl: 'do_31275241153060864018150/1556698449702_do_31275241153060864018150.zip',
        gradeLevel: ['Class 10'],
        identifier: 'do_31275241153060864018150',
        keywords: ['alkanes', 'methane', 'alcohols', 'acids', 'ketones', 'esters', 'soaps', 'detergents'],
        language: ['English'],
        me_averageRating: 2,
        mediaType: 'content',
        medium: 'Kannada',
        mimeType: 'application/vnd.ekstep.ecml-archive',
        name: 'CARBON AND ITS COMPOUNDS (ಕಾರ್ಬನ್ ಮತ್ತು ಅದರ ಸಂಯುಕ್ತಗಳು)',
        objectType: 'Content',
        pkgVersion: 2,
        prevState: 'Review',
        previewUrl: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/ecml/do_31275241153060864018150-latest',
        resourceType: 'Test',
        // tslint:disable-next-line: max-line-length
        s3Key: 'ecar_files/do_31275241153060864018150/carbon-and-its-compounds-kaarbn-mttu-adr-snyuktgllu_1556698450057_do_31275241153060864018150_1.0.ecar',
        size: 368578,
        status: 'Live',
        // tslint:disable-next-line: max-line-length
        streamingUrl: 'https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/ecml/do_31275241153060864018150-latest',
        subject: 'Science',
        version: 2,
        versionKey: '1560245792364',
        visibility: 'Parent',

    },
    downloadContent: {
        success: {
            'id': 'api.content.download',
            'ver': '1.0',
            'ts': '2020-01-09T13:01:21.624Z',
            'params': {
                'resmsgid': 'e0c138b3-337b-4b15-ac23-ca71cebfd4c0',
                'msgid': 'b53395e2-7ffa-49c7-901c-1084309b5f7e',
                'status': 'successful',
                'err': null,
                'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
                'downloadId': '82eba9b0-7650-4ebd-a28b-56c240056231'
            }
        },
        error: {

            'id': 'api.content.download',
            'ver': '1.0',
            'ts': '2020-01-09T13:11:09.835Z',
            'params': {
                'resmsgid': '17b6ce47-a381-4d10-8dc1-54e8b07cecd7',
                'msgid': '4b85b3c0-0a14-443f-a92b-6ddeef109f87',
                'status': 'failed',
                'err': 'ERR_INTERNAL_SERVER_ERROR',
                'errmsg': 'Error while processing the request'
            },
            'responseCode': 'INTERNAL_SERVER_ERROR',
            'result': {}
        }

    },
    updateContent: {
        error: {
            'id': 'api.content.update',
            'ver': '1.0',
            'ts': '2020-01-09T13:26:30.759Z',
            'params': {
                'resmsgid': '474e6035-aac1-4065-8bd8-1a9c0e421bb8',
                'msgid': '9fcb1d7a-38fc-474a-82d3-c032b2f14e02',
                'status': 'failed',
                'err': 'ERR_BAD_REQUEST',
                'errmsg': 'Update not available'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
        },
        success: {
            id: 'api.content.update',
            params: {
                err: null,
                errmsg: null,
                msgid: '43a0b86b-9078-4f3d-89bd-7d163914eef3',
                resmsgid: '7c91d2ba-e3da-4ec8-9617-869ce15b733c',
                status: 'successful'
            },
            responseCode: 'OK',
            result: 'c30bb48c-d838-42fd-9a4c-fd802d7fbaf7',
            ts: '2020-01-09T13:28:39.797Z',
            ver: '1.0'
        }
    },
    deleteContent: {
        success: {
            'id': 'api.content.delete',
            'ver': '1.0',
            'ts': '2020-01-09T16:16:37.993Z',
            'params': {
                'resmsgid': '762c9459-ec28-44de-aea6-1ce41efa636b',
                'msgid': '72dbc649-6287-46e8-9c15-8a675bd9fc1d',
                'status': 'successful',
                'err': null,
                'errmsg': null
            },
            'responseCode': 'OK',
            'result': {
                'deleted': ['do_31275241153060864018150'],
                'failed': []
            }
        },
        error: {
            'id': 'api.content.delete',
            'ver': '1.0',
            'ts': '2020-01-09T16:18:38.060Z',
            'params': {
                'resmsgid': '17d08cb1-c600-44a5-a553-40febf7b7a74',
                'msgid': '4eeef24c-bcc5-4402-b4cf-6cb9f49a1ab0',
                'status': 'failed',
                'err': 'ERR_BAD_REQUEST',
                'errmsg': 'MISSING_CONTENTS'
            },
            'responseCode': 'CLIENT_ERROR',
            'result': {}
        }
    },
    exportContent: {
        success: {
            destFolder: '/Users/icoblr/Downloads',
            message: 'SUCCESS',
            responseCode: 'OK',
        },
        error: {
            message: 'Ecar dest folder not selected',
            responseCode: 'NO_DEST_FOLDER'
        }
    },
    actionButtonEvents: {
        UPDATE: {
            data: {
                name: 'update'
            }
        },
        DOWNLOAD: {
            data: {
                name: 'download'
            }
        },
        DELETE: {
            data: {
                name: 'delete'
            }
        },
        RATE: {
            data: {
                name: 'rate'
            }
        },
        SHARE: {
            data: {
                name: 'share'
            }
        },
    }
};
