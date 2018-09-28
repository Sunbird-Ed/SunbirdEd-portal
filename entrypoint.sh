#!/bin/bash
cd /home/sunbird/app_dist/cassandra_migration/release-1.11/form-plugin-migration
npm install
node migrate.js
cd -
node server.js &