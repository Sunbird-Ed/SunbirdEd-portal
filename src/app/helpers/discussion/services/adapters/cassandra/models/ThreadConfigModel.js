module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: {'$db_function': 'uuid()'}
    },
    threadid: 'text',
    groupid: 'text',
    config: 'blob',
    createddate: 'text',
    updateddate: 'text'
  },
  key: ['groupid', 'threadid']
}
