const { PORT } = require('./config')
const express = require('express')
const app = express()
const cors = require('cors')
const { getObservations } = require('./lib/sql-service.js')
const { AirNowFile } = require('./lib/file-getter-service.js')

app.use(cors())

app.get('/api/observations', async (req, res) => {
  try {
    let data = await getObservations(req.query)
    res.setHeader('Content-Type', 'application/json')
    res.send(data)
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/observations/get', async (req, res) => {
  let airNowFile = new AirNowFile('HourlyAQObs', new Date().getUTCMinutes() < 35 ? -2 : -1)
  try {
    let data = await airNowFile.getFile()
    res.setHeader('Content-Type', 'application/json')
    res.send(airNowFile.message)
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/observations/add', async (req, res) => {
  let airNowFile = new AirNowFile('HourlyAQObs', new Date().getUTCMinutes() < 35 ? -2 : -1)
  try {
    let data = await airNowFile.parseFile()
    let dres = await airNowFile.insert(data)
    res.setHeader('Content-Type', 'application/json')
    res.send(dres)
  } catch (error) {
    console.log(error)
  }
})

app.get('*', (req, res) => {
  res.json({ message: '404' })
})

app.listen(PORT, () => {
  console.log(`air-quality-info server listening on ${PORT}`)
})
