import { GroupEntityStatus, GroupMemberRole, GroupMembershipType } from '@project-fmps/client-services/models';

export const GroupDetailsData = {
    groupData : {
        'membershipType': GroupMembershipType.INVITE_ONLY,
        'updatedBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
        'createdBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
        'activities': [
          {
            'id': 'do_1130958935577886721105',
            'type': 'PracticeQuestionSet'
          }
        ],
        'members': [
          {
            'userId': '8454cb21-3ce9-4e30-85b5-fade097880d8',
            'groupId': 'dcffdb33-edbe-4ea8-8ed5-4d6781c2e2e7',
            'role': GroupMemberRole.ADMIN,
            'status': GroupEntityStatus.ACTIVE,
            'createdOn': '2020-09-09 07:05:27:543+0000',
            'createdBy': '8454cb21-3ce9-4e30-85b5-fade097880d8',
            'updatedOn': null,
            'updatedBy': null,
            'removedOn': null,
            'removedBy': null,
            'name': 'Mentor First User',
            'title': 'Mentor first user (You)',
            'initial': 'M',
            'identifier': '8454cb21-3ce9-4e30-85b5-fade097880d8',
            'isAdmin': true,
            'isCreator': true,
            'isSelf': true,
            'isMenu': false,
            'indexOfMember': 0
          }
        ],
        'name': 'My testing group',
        'description': '',
        'id': 'dcffdb33-edbe-4ea8-8ed5-4d6781c2e2e7',
        'updatedOn': '2020-09-09 07:21:15:380+0000',
        'createdOn': '2020-09-09 07:05:27:528+0000',
        'status': GroupEntityStatus.ACTIVE,
        'isCreator': true,
        'isAdmin': true,
        'initial': 'M'
      }
};
