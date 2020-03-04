export const response = {
    onFilterChangeEvent: {
        'filters': {
            'board': ['State (Test 1)'],
            'appliedFilters': true,
            'medium': ['English'],
            'gradeLevel': ['Class 4']
        },
        'channelId': '01285019302823526477'
    },
    constructSearchRequestWithFilter: {
        'filters': {
            'channel': '01285019302823526477',
            'contentType': ['TextBook']
        },
        'mode': 'soft',
        'facets': ['board', 'medium', 'gradeLevel', 'subject'],
        'params': {
            'orgdetails': 'orgName,email',
            'online': false
        },
        'softConstraints': {
            'badgeAssertions': 98,
            'board': 99,
            'channel': 100
        },
    },
    constructSearchRequestWithOutFilter: {
        'filters': {
            'contentType': ['TextBook']
        },
        'mode': 'soft',
        'facets': ['board', 'medium', 'gradeLevel', 'subject'],
        'params': {
            'orgdetails': 'orgName,email',
            'online': false
        },
        'softConstraints': {
            'badgeAssertions': 98,
            'board': 99,
            'channel': 100
        }
    },
    searchResult: {
        'id': 'api.content.search',
        'ver': '1.0',
        'ts': '2019-12-04T11:52:42.421Z',
        'params': {
            'resmsgid': 'f5214487-8ab8-4e6d-ba8b-1fa74e43753a',
            'msgid': 'f63666bc-7742-48de-b3cd-7a9cc37e58aa',
            'status': 'successful',
            'err': null,
            'errmsg': null
        },
        'responseCode': 'OK',
        'result': {
            'content': [{
                'ownershipType': ['createdFor'],
                'publish_type': null,
                'keywords': ['Addition', 'Carry Over'],
                'subject': 'Mathematics',
                'channel': '01248978648941363234',
                'downloadUrl': 'do_31280197775324774412235/addition_with_carry_over_-_english360p.mp4',
                'organisation': ['Test 1'],
                'language': ['English'],
                'mimeType': 'video/mp4',
                'variants': null,
                'objectType': 'Content',
                'gradeLevel': ['Class 5'],
                'appIcon': 'content/do_31280197775324774412235/dsert-econtent-logo_priority-1_1525846239148.thumb.png',
                'appId': 'prod.diksha.portal',
                'artifactUrl': 'do_31280197775324774412235/addition_with_carry_over_-_english360p.mp4',
                'contentEncoding': 'identity',
                'lockKey': '2d4ec763-5e2e-4308-8f9d-b62a0dfd57c3',
                'contentType': 'Resource',
                'lastUpdatedBy': 'e119d868-0934-4a51-9e6d-9ceb73f87f20',
                'identifier': 'do_31280197775324774412235',
                'audience': ['Learner'],
                'visibility': 'Default',
                'consumerId': '89490534-126f-4f0b-82ac-3ff3e49f3468',
                'mediaType': 'content',
                'osId': 'org.ekstep.quiz.app',
                'lastPublishedBy': 'a85c9122-66ad-4449-9dd0-506ef161f589',
                'version': 1,
                'tags': ['Addition', 'Carry Over'],
                'prevState': 'Review',
                'size': 19204051,
                'lastPublishedOn': '2019-07-18T05:40:47.738+0000',
                'name': 'Addition_with_Carry_Over',
                'attributions': ['Akshara Foundation', ' Bengaluru'],
                'status': 'Live',
                'code': 'e20ad433-9bb7-48c0-a9de-3b7490bd48b0',
                'publishError': null,
                'creators': 'eContent, DSERT',
                'medium': 'English',
                'idealScreenSize': 'normal',
                'createdOn': '2019-07-10T06:50:24.956+0000',
                'contentDisposition': 'inline',
                'lastUpdatedOn': '2019-07-18T05:40:47.259+0000',
                'SYS_INTERNAL_LAST_UPDATED_ON': '2019-07-10T06:50:42.639+0000',
                'dialcodeRequired': 'No',
                'owner': 'Test 1',
                'createdFor': ['01248978648941363234'],
                'creator': 'DSERT eContent',
                'lastStatusChangedOn': '2019-07-18T05:40:47.249+0000',
                'os': ['All'],
                'flagReasons': null,
                'pkgVersion': 1,
                'versionKey': '1563428447259',
                'idealScreenDensity': 'hdpi',
                'framework': 'ka_k-12',
                'lastSubmittedOn': '2019-07-10T06:54:36.925+0000',
                'createdBy': 'e119d868-0934-4a51-9e6d-9ceb73f87f20',
                'compatibilityLevel': 1,
                'contributors': 'Akshara Foundation, Bengaluru',
                'ownedBy': '01248978648941363234',
                'board': 'State (Test 1)',
                'resourceType': 'Learn',
                'baseDir': 'content/do_31280197775324774412235',
                'desktopAppMetadata': {
                    'addedUsing': 'download',
                    'createdOn': 1575460343022,
                    'updatedOn': 1575460343022
                }
            }],
            'count': 1
        }
    }
};
