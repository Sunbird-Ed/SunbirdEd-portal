module.exports = {
  fields: {
    id: {
      type: 'uuid',
      default: {'$db_function': 'uuid()'}
    },
    contexttype: 'text',
    contextid: 'text',
    pluginid: 'text',
    rolemap: 'blob',
    visibility: 'text',
    access: 'text',
    status: 'int',
    createdby: 'text',
    createddate: 'text',
    updatedby: 'text',
    updateddate: 'text'
  },
  key: [['contexttype', 'contextid'], 'pluginid']
}
