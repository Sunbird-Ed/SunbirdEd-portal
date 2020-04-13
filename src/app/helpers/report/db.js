const { Pool } = require('pg')
const { envVariables } = require('../environmentVariablesHelper');

const pool = new Pool({
  host: "localhost",
  database: "report",
  port: 5432,
  password: "",
  user: ""
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}