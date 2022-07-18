const { mysql, pool } = require('../config')
const reverseGeo = require('reverse-geocode')

async function setCities() {
  let message = 'Done updating AQSID City/State'
  let p = await pool
  let [rows, fields] = await p.query('SELECT AQSID, Latitude, Longitude, CountryCode FROM latest_aq_obs')
  for (const site of rows) {
    if (site.CountryCode === 'US') {
      let geo = reverseGeo.lookup(site.Latitude, site.Longitude, 'us')
      let [rows, fields] = await p.query('INSERT INTO aqsid_info (AQSID, City, State, Country, Latitude, Longitude) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE City = VALUES(City), State = VALUES(State), Country = VALUES(Country), Latitude = VALUES(Latitude), Longitude = VALUES(Longitude)', [site.AQSID, geo.city, geo.state_abbr, site.CountryCode, site.Latitude, site.Longitude])
    }
  }
  console.log(message)
  return message
}

module.exports = { setCities }
