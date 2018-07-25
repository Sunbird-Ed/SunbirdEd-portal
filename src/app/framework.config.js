const envHelper = require('./helpers/environmentVariablesHelper.js')

module.exports = {
  db: {
    cassandra: {
      contactPoints: envHelper.PORTAL_CASSANDRA_URLS,
      defaultKeyspaceSettings: {
        replication: {
          'class': 'SimpleStrategy',
          'replication_factor': '1'
        }
      }
    },
    elasticsearch: { // currently not required
      host: '',
      disabledApis: ['cat', 'cluster', 'ingest', 'nodes', 'remote', 'snapshot', 'tasks']
    }
  },
  plugins: [
    { id: 'form-service', ver: '1.0' }
  ],
  pluginBasePath: __dirname + '/node_modules/',
  logLevel: 'error'
}
