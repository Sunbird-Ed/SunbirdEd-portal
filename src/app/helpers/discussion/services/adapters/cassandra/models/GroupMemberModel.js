module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: {'$db_function': 'uuid()'}
    },
    groupid: 'text',
    userid: 'text',

    roles: {
      type: 'list',
      typeDef: '<text>'
    },
    scope: 'text',
    scopeid: 'text',
    status: 'int',
    joiningdate: 'text',
    createddate: 'text',
    updateddate: 'text'
  },
  key: ['groupid', 'userid']
}
