db = db.getSiblingDB('percp_scope_1');

db.user_privileges.drop();
db.interaction_actions.drop();

db.user_privileges.insert({
    userId: 'kirankumar',
    interactionType: 'QA',
    interactionActions: [{
        action: 'rate',
        privilege: true
    }, {
        action: 'answer',
        privilege: true
    }, {
        action: 'commentOnPost',
        privilege: true
    }, {
        action: 'markAsSpam',
        privilege: true
    }, {
        action: 'unMarkAsSpam',
        privilege: false
    }, {
        action: 'follow',
        privilege: true
    }, {
        action: 'markAsFrivolous',
        privilege: true
    }, {
        action: 'markAsDuplicate',
        privilege: true
    }, {
        action: 'askQuestion',
        privilege: true
    }, {
        action: 'markAsAnswered',
        privilege: true
    }]
});

db.user_privileges.insert({
    userId: 'ashoknair',
    interactionType: 'QA',
    interactionActions: [{
        action: 'rate',
        privilege: true
    }, {
        action: 'answer',
        privilege: true
    }, {
        action: 'commentOnPost',
        privilege: false
    }, {
        action: 'markAsSpam',
        privilege: true
    }, {
        action: 'unMarkAsSpam',
        privilege: false
    }, {
        action: 'follow',
        privilege: true
    }, {
        action: 'markAsFrivolous',
        privilege: true
    }, {
        action: 'markAsDuplicate',
        privilege: true
    }, {
        action: 'askQuestion',
        privilege: true
    }, {
        action: 'markAsAnswered',
        privilege: true
    }]
});

db.user_privileges.insert({
    userId: 'eswarsharma',
    interactionType: 'QA',
    interactionActions: [{
        action: 'rate',
        privilege: false
    }, {
        action: 'answer',
        privilege: false
    }, {
        action: 'commentOnPost',
        privilege: true
    }, {
        action: 'markAsSpam',
        privilege: false
    }, {
        action: 'unMarkAsSpam',
        privilege: false
    }, {
        action: 'follow',
        privilege: true
    }, {
        action: 'markAsFrivolous',
        privilege: false
    }, {
        action: 'markAsDuplicate',
        privilege: false
    }, {
        action: 'askQuestion',
        privilege: false
    }, {
        action: 'markAsAnswered',
        privilege: true
    }]
});

db.user_privileges.insert({
    userId: 'suhasini',
    interactionType: 'QA',
    interactionActions: [{
        action: 'rate',
        privilege: true
    }, {
        action: 'answer',
        privilege: true
    }, {
        action: 'commentOnPost',
        privilege: true
    }, {
        action: 'markAsSpam',
        privilege: true
    }, {
        action: 'unMarkAsSpam',
        privilege: true
    }, {
        action: 'follow',
        privilege: true
    }, {
        action: 'markAsFrivolous',
        privilege: false
    }, {
        action: 'markAsDuplicate',
        privilege: true
    }, {
        action: 'askQuestion',
        privilege: false
    }, {
        action: 'markAsAnswered',
        privilege: true
    }]
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'rate',
    occurrence: 1,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'answer',
    occurrence: 100,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'commentOnPost',
    occurrence: 100,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: [],
    defaultUserPrivilege: false
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'markAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'markAsNotRelevant',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'unMarkAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'follow',
    occurrence: 1,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'markAsFrivolous',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'interaction',
    action: 'markAsDuplicate',
    occurrence: 1,
    occurrenceType: 'PerInteraction',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'comment',
    action: 'rate',
    occurrence: 1,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'comment',
    action: 'commentOnPost',
    occurrence: 100,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: [],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'comment',
    action: 'markAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'comment',
    action: 'unMarkAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'comment',
    action: 'markAsFrivolous',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'comment',
    action: 'markAsAnswered',
    occurrence: 1,
    occurrenceType: 'PerInteraction',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'user',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'PostComment',
    action: 'markAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'QA',
    postType: 'PostComment',
    action: 'unMarkAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'observer',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'rate',
    occurrence: 1,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'answer',
    occurrence: 100,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'commentOnPost',
    occurrence: 100,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: [],
    defaultUserPrivilege: false
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'markAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'markAsNotRelevant',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'unMarkAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'follow',
    occurrence: 1,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'markAsFrivolous',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'interaction',
    action: 'markAsDuplicate',
    occurrence: 1,
    occurrenceType: 'PerInteraction',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'comment',
    action: 'rate',
    occurrence: 1,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Disabled'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'comment',
    action: 'commentOnPost',
    occurrence: 100,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: [],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'comment',
    action: 'markAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'comment',
    action: 'unMarkAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'comment',
    action: 'markAsFrivolous',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'comment',
    action: 'markAsAnswered',
    occurrence: 1,
    occurrenceType: 'PerInteraction',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Editable'
    }, {
        roleType: 'user',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'PostComment',
    action: 'markAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Disabled',
        actionDisplayState: 'Disabled'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'AdminQA',
    postType: 'PostComment',
    action: 'unMarkAsSpam',
    occurrence: 1,
    occurrenceType: 'PerPost',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: false,
        accessDisplayState: 'Hidden',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['postOwner', 'interactionOwner'],
    defaultUserPrivilege: true
});

db.interaction_actions.insert({
    interactionType: 'TutorQA',
    postType: 'interaction',
    action: 'answer',
    occurrence: 100,
    occurrenceType: 'PerUser',
    scope: 'interactions',
    interactionRoles: [{
        roleType: 'forumAdmin',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'postOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'interactionOwner',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'moderator',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }, {
        roleType: 'user',
        access: true,
        accessDisplayState: 'Enabled',
        actionDisplayState: 'Hidden'
    }],
    interationRolesPriority: ['interactionOwner'],
    defaultUserPrivilege: true
});
