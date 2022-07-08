const { mysql, pool } = require('../config')
const reverseGeo = require('reverse-geocode')

async function setCities() {
  let p = await pool
  let res = await p.query('SELECT AQSID, Latitude, Longitude, Country FROM aqsid_info')
  for (const site of res) {
    if (site.Country === 'US') {
      let geo = reverseGeo.lookup(site.Latitude, site.Longitude, 'us')
      let pres = await p.query('UPDATE aqsid_info SET City = ?, State = ? WHERE AQSID = ?', [geo.city, geo.state, site.AQSID])
      console.log(pres)
    }
  }
}

//setCities()
console.log(reverseGeo.lookup(32.437028, -84.999653, 'us'))
