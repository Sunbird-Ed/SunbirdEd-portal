export const MY_GROUPS = 'my-groups';
export const GROUP_DETAILS = 'group-details';
export const WORKSPACE =  {
    GROUP_ID: `${GROUP_DETAILS}/:groupId`
};
export const ADD_MEMBER = 'add-member-to-group';
export const ADD_MEMBER_TO_GROUP = `${WORKSPACE.GROUP_ID}/${ADD_MEMBER}`;
export const CREATE_EDIT_GROUP  = 'create-edit-group';
export const ADD_ACTIVITY_TO_GROUP = 'add-activity-to-group';
export const ACTIVITY_DETAILS = 'activity-details';
export const COURSES = 'courses';
export const CREATE_GROUP  = 'create-edit-group';
export const EDIT_GROUP  = `${WORKSPACE.GROUP_ID}/${CREATE_GROUP}`;
