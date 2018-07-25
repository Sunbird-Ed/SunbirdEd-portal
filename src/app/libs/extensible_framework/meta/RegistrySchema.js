"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrySchema = {
    "type": "cassandra",
    "private": true,
    "config": {
        "replication": {
            "class": "SimpleStrategy",
            "replication_factor": 1
        }
    },
    "keyspace_prefix": "core",
    "keyspace_name": "framework",
    "column_families": [
        {
            "table_name": "plugin_registry",
            "fields": {
                "id": {
                    "type": "varchar"
                },
                "name": {
                    "type": "varchar"
                },
                "version": {
                    "type": "varchar"
                },
                "repo": {
                    "type": "varchar"
                },
                "status": {
                    "type": "int"
                },
                "registered_on": {
                    "type": "timestamp",
                    "default": { "$db_function": "toTimestamp(now())" }
                },
                "cassandra_keyspace": {
                    "type": "varchar"
                },
                "elasticsearch_index": {
                    "type": "map",
                    "typeDef": "<text, text>"
                },
                "manifest": {
                    "type": "varchar"
                }
            },
            "key": ["id"]
        }
    ]
};
