"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = {
    db: {
        cassandra: {
            contactPoints: ['127.0.0.1'],
            defaultKeyspaceSettings: {
                replication: {
                    'class': 'SimpleStrategy',
                    'replication_factor': '1'
                }
            }
        },
        elasticsearch: {
            host: '127.0.0.1:9200',
            disabledApis: ['cat', 'cluster', 'ingest', 'nodes', 'remote', 'snapshot', 'tasks']
        }
    },
    plugins: [],
    pluginBasePath: '',
    logLevel: 'debug',
    port: 9000 // default
};
