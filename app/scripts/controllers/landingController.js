'use strict';

/**
 * @ngdoc function
 * @name playerApp.controller:communityController
 * @description
 * # communityController
 * Controller of the playerApp
 */
angular.module('playerApp')
    .controller('landingCtrl', function() {
        var landing = this;
        landing.courses = [{
                'userId': ' user1',
                'courseId': 'do_112266879223308288177',
                'name': 'ESL Course',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/media/alphabets_cover_1497421779966.png',
                'description': 'The goal of an ESL program is to improve the students\' level of English. ESL classes teach different language skills, depending on students\' English abilities, interests, and needs. All programs teach the following: conversational English, grammar, reading, listening comprehension, writing, and vocabulary.',
                'enrolledDate': '2017-05-13T10:49:58:600+0530',
                'progress': 4,
                'total': 8,
                'grade': 'A',
                'active': ' true',
                'delta': {},
                'tocurl': 'http://13.71.127.158:9000/v1/course/toc',
                'status': '1'
            },
            {
                'userId': ' user1',
                'courseId': 'do_112265805439688704113',
                'name': 'Test Course 1',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112265805439688704113/artifact/01-search-btn-active_1497290702438.thumb.png',
                'description': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                'enrolledDate': '2017-05-13T10:49:58:600+0530',
                'progress': 3,
                'total': 7,
                'grade': 'A',
                'active': ' true',
                'delta': {},
                'tocurl': 'http://13.71.127.158:9000/v1/course/toc',
                'status': '1'
            }, {
                'userId': ' user1',
                'courseId': 'do_112266879223308288177',
                'name': 'ESL Course',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/media/alphabets_cover_1497421779966.png',
                'description': 'The goal of an ESL program is to improve the students\' level of English. ESL classes teach different language skills, depending on students\' English abilities, interests, and needs. All programs teach the following: conversational English, grammar, reading, listening comprehension, writing, and vocabulary.',
                'enrolledDate': '2017-05-13T10:49:58:600+0530',
                'progress': 4,
                'total': 8,
                'grade': 'A',
                'active': ' true',
                'delta': {},
                'tocurl': 'http://13.71.127.158:9000/v1/course/toc',
                'status': '1'
            },
            {
                'userId': ' user1',
                'courseId': 'do_112265805439688704113',
                'name': 'Test Course 1',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112265805439688704113/artifact/01-search-btn-active_1497290702438.thumb.png',
                'description': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                'enrolledDate': '2017-05-13T10:49:58:600+0530',
                'progress': 3,
                'total': 7,
                'grade': 'A',
                'active': ' true',
                'delta': {},
                'tocurl': 'http://13.71.127.158:9000/v1/course/toc',
                'status': '1'
            }, {
                'userId': ' user1',
                'courseId': 'do_112266879223308288177',
                'name': 'ESL Course',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/media/alphabets_cover_1497421779966.png',
                'description': 'The goal of an ESL program is to improve the students\' level of English. ESL classes teach different language skills, depending on students\' English abilities, interests, and needs. All programs teach the following: conversational English, grammar, reading, listening comprehension, writing, and vocabulary.',
                'enrolledDate': '2017-05-13T10:49:58:600+0530',
                'progress': 4,
                'total': 8,
                'grade': 'A',
                'active': ' true',
                'delta': {},
                'tocurl': 'http://13.71.127.158:9000/v1/course/toc',
                'status': '1'
            },
            {
                'userId': ' user1',
                'courseId': 'do_112265805439688704113',
                'name': 'Test Course 1',
                'appIcon': 'https://ekstep-public-dev.s3-ap-south-1.amazonaws.com/content/do_112265805439688704113/artifact/01-search-btn-active_1497290702438.thumb.png',
                'description': 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
                'enrolledDate': '2017-05-13T10:49:58:600+0530',
                'progress': 3,
                'total': 7,
                'grade': 'A',
                'active': ' true',
                'delta': {},
                'tocurl': 'http://13.71.127.158:9000/v1/course/toc',
                'status': '1'
            }
        ];
    });