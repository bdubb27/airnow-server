const secrets = require('@cloudreach/docker-secrets')
const mysql = require('mysql2/promise')
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: secrets.MYSQL_USER,
  password: secrets.MYSQL_PASSWORD,
  database: secrets.MYSQL_DATABASE
})

module.exports = { mysql, pool }
