var mysql = require('mysql')

const pool = mysql.createPool({
  connectionLimit: 10,
  port: 8889,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'oops',
  multipleStatements: true,
  timezone: 'UTC',
})

module.exports = pool