require('../config')
const mysql = require('promise-mysql')
const _ = require('lodash')

module.exports = {
  getObservations: async (query) => {
    const pool = await mysql.createPool(MYSQL_DB_OPTS)
    query.params = query.params && JSON.parse(query.params)
    let sql
    switch (query.path) {
      case undefined:
        sql = 'SELECT * FROM latest_aq_obs'
        sql += _.isEmpty(query.params) ? '' : ' WHERE ?'
        break;
      case 'aac':
        sql = 'SELECT DISTINCT l.* FROM aac_zip_codes a INNER JOIN latest_aq_obs l ON a.local_aqsid_active_pm25 = l.AQSID'
        sql += _.isEmpty(query.params) ? '' : ' WHERE ?'
        break;
      default:
        sql = 'SELECT * FROM latest_aq_obs WHERE `AQSID` = ?'
        sql = mysql.format(sql, query.path)
        sql += _.isEmpty(query.params) ? '' : ' AND ?'
    }
    sql = mysql.format(sql, query.params).replace(/(', `)/g, '\' AND `')
    console.log(sql); // DEBUG:
    const observations = await pool.query(sql)
    return observations
  }
}
