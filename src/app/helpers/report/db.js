const { Pool } = require('pg')
const { get } = require('lodash');

const pool = new Pool({
  host: get(process, 'env.sunbird_reports_db_host') || "",
  database: get(process, 'env.sunbird_reports_db_name') || "report",
  password: get(process, 'env.sunbird_reports_db_password') || "",
  user: get(process, 'env.sunbird_reports_db_user') || ""
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}