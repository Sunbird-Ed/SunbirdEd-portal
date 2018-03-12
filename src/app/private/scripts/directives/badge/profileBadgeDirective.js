/**
 * @author: Anuj Gupta
 * @description: This directive useful to show badge in user profile
 */

'use strict'

angular.module('playerApp')
  .directive('profileBadge', function () {
    return {
      templateUrl: 'views/badge/profileBadge.html',
      restrict: 'E',
      scope: {
        isshowadd: '=',
        isprofilesearch: '=',
        badgelist: '=',
        otheruserid: '=',
        isprofileinfo: '='
      },
        link: function (scope, element, attrs) {// eslint-disable-line
        console.log(scope.badgelist)
        scope.badges = scope.badgelist ? scope.badgelist : [{
          'created_at': '2018-03-05T10:19:25.588718Z',
          'json': {
            'issuedOn': '2018-03-05T02:19:25.586958',
            'verify': {
              'url': 'http://localhost:8000/public/assertions/1ebceaf1-b63b-4edb-97c0-bfc6e3235408',
              'type': 'hosted'
            },
            'uid': '1ebceaf1-b63b-4edb-97c0-bfc6e3235408',
            'badge': 'http://localhost:8000/public/badges/java-se-8-programmer',
            'image': 'http://localhost:8000/public/assertions/1ebceaf1-b63b-4edb-97c0-bfc6e3235408/image',
            'type': 'Assertion',
            '@context': 'https://w3id.org/openbadges/v1',
            'recipient': {
              'salt': '17212da8-0fce-49ba-b39d-058edc73ea0d',
              'type': 'email',
              'hashed': true,
              'identity': 'sha256$2e4073c27e83948c2d75bb424fa65e8eecef013e327f071c90515904af6e3261'
            },
            'id': 'http://localhost:8000/public/assertions/1ebceaf1-b63b-4edb-97c0-bfc6e3235408'
          },
          'slug': '1ebceaf1-b63b-4edb-97c0-bfc6e3235408',
          'image': '/common/images/appblue.png',
          'recipient_identifier': 'someone@oracle.com',
          'revoked': false,
          'revocation_reason': null,
          'created_by': 'http://localhost:8000/user/1',
          'issuer': 'http://localhost:8000/public/issuers/oracle-university',
          'badge_class': 'http://localhost:8000/public/badges/java-se-8-programmer'
        }]
      }
    }
  })
