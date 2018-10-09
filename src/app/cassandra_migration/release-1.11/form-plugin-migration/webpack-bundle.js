const path = require('path');
const nodeExternals = require('webpack-node-externals');
module.exports = {
  target: "node",
  entry: {
    app: ["./migrate.js"]
  },
  output: {
    path: path.resolve(__dirname),
    filename: "bundle-migration.js"
  },
  externals: [nodeExternals(
    {whitelist: ['cassandra-driver', 'long']}
  )],
};