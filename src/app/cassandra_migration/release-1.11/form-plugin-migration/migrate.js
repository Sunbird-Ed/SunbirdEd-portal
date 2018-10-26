const cassandra = require("cassandra-driver");
var contactPoints = process.env.sunbird_cassandra_urls ? process.env.sunbird_cassandra_urls.split(",") : ['localhost'];
let cassandraClientOptions = { contactPoints:  contactPoints };
const client = new cassandra.Client(cassandraClientOptions);

let transformedData = [];
let dest_obj = {
  created_on: new Date()
}

const schemaCheckQuery = "Select last_modified_on,created_on From qmzbm_form_service.form_data;";
client.execute(schemaCheckQuery)
  .then((result) => {
    console.log('nothing to migrate');
    process.exit(1);
  })
  .catch((error) => {
    console.log('migrating form data');
    const sourceQuery = "SELECT * FROM sunbird.tenant_preference";
    client.execute(sourceQuery)
      .then(result => {
        console.log("no. of records to migrate:", result.rows.length);
        result.rows.forEach((row) => {
          if (row && row.key && row.key.split(".").length === 3) {
            let temp = Object.assign({}, dest_obj);
            temp.root_org = row.orgid;
            if (row.key && row.key.length) {
              temp.type = row.key.split(".")[0];
              temp.subtype = row.key.split(".")[1];
              temp.action = row.key.split(".")[2];
            } else {
              temp.type = "*";
              temp.subtype = "*";
              temp.action = "*";
            }
            temp.component = "*"; //default, since it"s new field
            if (row.data) {
              if (typeof row.data === "string")
                try {
                  row.data = JSON.parse(row.data);
                } catch (e) {
                  console.log("JSON parse error! :");
                  console.log("row.key", row.key);
                  console.log("row.orgid", row.orgid);
                  console.log("row.data", row.data);
                }
              if (typeof row.data === "object") {
                Object.keys(row.data).forEach((key) => {
                  if (key === "default") {
                    temp.framework = "*";
                  } else {
                    temp.framework = key;
                  }
                  temp.data = row.data[key];
                  transformedData.push({ ...temp });
                })
              } else {
                temp.data = row.data;
                temp.framework = "*";
                transformedData.push(temp);
              }
            }
          }
        });
      })
      .then(async _ => {
        // drop keyspace as we have changed column name in form service
        await client.execute(`DROP KEYSPACE IF EXISTS qmzbm_form_service`)
        // create keyspace if not exist
        await client.execute(`CREATE KEYSPACE IF NOT EXISTS qmzbm_form_service WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 }`)
        // create table if not exist
        await client.execute(`CREATE TABLE IF NOT EXISTS qmzbm_form_service.form_data (
      root_org text,
      framework text,
      type text,
      subtype text,
      action text,
      component text,
      created_on timestamp,
      data text,
      last_modified_on timestamp,
      PRIMARY KEY ((root_org, framework, type, subtype, action, component)))   
    `);
        for (const data of transformedData) {
          let query = "INSERT INTO qmzbm_form_service.form_data(root_org, framework, type, subtype, action, component, created_on, last_modified_on, data) values(?,?,?,?,?,?,?,?,?)"
          await client.execute(query, [data.root_org, data.framework, data.type, data.subtype, data.action, data.component, data.created_on, data.last_modified_on, JSON.stringify(data.data)], { prepare: true });
        }
        console.log("no. of records migrated after denorm:", transformedData.length);
        process.exit(1);
      })
      .catch(error => {
        console.log(error);
        process.exit(1);
      });
  });

process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});
