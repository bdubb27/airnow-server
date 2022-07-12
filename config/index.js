const secrets = require('@cloudreach/docker-secrets')
const mysql = require('mysql2/promise')
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || '127.0.0.1',
  user: secrets.MYSQL_USER || process.env.MYSQL_USER || 'root',
  password: secrets.MYSQL_PASSWORD || process.env.MYSQL_PASSWORD || 'password',
  database: secrets.MYSQL_DATABASE || process.env.MYSQL_DATABASE || 'aqi'
})

module.exports = { mysql, pool }
