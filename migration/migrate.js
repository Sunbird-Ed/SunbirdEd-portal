const cassandra = require('cassandra-driver');
const source_client = new cassandra.Client({ contactPoints: [process.env.sunbird_cassandra_urls || '127.0.0.1'], keyspace: 'sunbird' });
const dest_client = new cassandra.Client({ contactPoints: [process.env.sunbird_cassandra_urls || '127.0.0.1'], keyspace: 'dlyjp_form_service' });

let transformed_data = [];
let dest_obj = {
  root_org: undefined,
  framework: undefined,
  type: undefined,
  subtype: undefined,
  component: undefined,
  action: undefined,
  created: new Date(),
  last_modified: undefined,
  data: undefined
}
const query = 'SELECT * FROM sunbird.tenant_preference';
source_client.execute(query)
  .then(result => {
    console.log('result.rows.length', result.rows.length);
    result.rows.forEach((row) => {
      let temp = Object.assign({}, dest_obj);
      temp.root_org = row.orgid;
      if (row.key && row.key.length) {
        temp.type = row.key.split(".")[0]
        temp.subtype = row.key.split(".")[1]
        temp.action = row.key.split(".")[2]
      } else {
        temp.type = "*";
        temp.subtype = "*";
        temp.action = "*";
      }
      temp.component = "*"; //default, since it's new field
      if (row.data) {
        if (typeof row.data === "string")
          try {
            row.data = JSON.parse(row.data);
          } catch (e) {
            console.log('JSON parse error! :', row.orgid);
          }
        if (typeof row.data === "object") {
          Object.keys(row.data).forEach((key) => {
            if (key === "default") {
              temp.framework = "*";
            } else {
              temp.framework = key;
            }
            temp.data = row.data[key];
            transformed_data.push(temp);
          })
        } else {
          temp.data = row.data;
          temp.framework = "*";
          transformed_data.push(temp);
        }
      }
    })
  })
  .then(_ => {
    transformed_data.forEach(data => {
      let query = "INSERT INTO dlyjp_form_service.form_data(root_org, framework, type, subtype, action, component, created, last_modified, data) values(?,?,?,?,?,?,?,?,?)"
      dest_client.execute(query, [data.root_org, data.framework, data.type, data.subtype, data.action, data.component, data.created, data.last_modified, JSON.stringify(data.data) ]);
    });
  })
  .then(_ => {
    // log the output
    transformed_data.forEach(data => {
      console.log('data: \n', data);
    })
    console.log('transformed_data.length', transformed_data.length);
  })
  .catch(error => {
    console.log(error);
  })

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
  // application specific logging, throwing an error, or other logic here
});