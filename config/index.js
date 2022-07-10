require('dotenv-finder')
require('dotenv').config({ path: findDotEnvFile() })
require('./server.config.js')
require('./mysql-db.config.js')
const mysql = require('mysql2/promise')
const pool = mysql.createPool(MYSQL_DB_OPTS)

module.exports = { mysql, pool, PORT }
