const { mysql, pool } = require('../config')
const _ = require('lodash')

async function getObservations(query) {
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
  let p = await pool
  let observations = await p.query(sql)
  return observations
}

module.exports = { getObservations }
