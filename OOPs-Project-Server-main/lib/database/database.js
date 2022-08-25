var mysql = require('mysql')

class Database {
  constructor (dbName) {
    this.dbName = dbName
    if (dbName == 'oops') {
      this.pool = require('./dbpool.js')
    }
  }

  call(query, params) {
    return new Promise((resolve, reject) => {
      this.pool.query(query, params, (err, result, fields) => {
        if (err) {
          err.message = 'Database connection error'
          err.status = 500
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

module.exports = Database