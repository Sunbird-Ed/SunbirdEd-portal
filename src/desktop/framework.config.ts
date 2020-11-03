import * as path from "path";

export const frameworkConfig = {
  db: {
    cassandra: {
      contactPoints: ["127.0.0.1"]
    },
    elasticsearch: {
      host: "127.0.0.1:9200",
      disabledApis: [
        "cat",
        "cluster",
        "ingest",
        "nodes",
        "remote",
        "snapshot",
        "tasks"
      ]
    },
    couchdb: {
      url: "http://localhost:5984"
    },
    pouchdb: {
      path: "./"
    }
  },
  plugins: [
    {
      id: "openrap-sunbirded-plugin",
      ver: "1.0"
    }
  ],
  pluginBasePath: path.join(__dirname, "node_modules") + "/"
};
