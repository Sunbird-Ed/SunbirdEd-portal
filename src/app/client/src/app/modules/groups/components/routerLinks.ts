export const MY_GROUPS = 'my-groups';
export const GROUP_DETAILS = 'group-details';
export const WORKSPACE =  {
    GROUP_ID: `${GROUP_DETAILS}/:groupId`
};
export const ADD_MEMBER = 'add-member-to-group';
export const ADD_MEMBER_TO_GROUP = `${WORKSPACE.GROUP_ID}/${ADD_MEMBER}`;
export const CREATE_EDIT_GROUP  = 'create-edit-group';
