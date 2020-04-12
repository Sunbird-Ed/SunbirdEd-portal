const { Pool } = require('pg')
const { envVariables } = require('../environmentVariablesHelper');

const pool = new Pool({
  host: "ec2-54-210-128-153.compute-1.amazonaws.com",
  database: "dad2ajovds5hqp",
  port: 5432,
  password: "363ce1022b29054d193276cb23cecf0208e1454e2f89e21540dd97ac1c863437",
  user: "gzpbllwhptxvgm"
})

module.exports = {
  query: (text, params) => pool.query(text, params)
}