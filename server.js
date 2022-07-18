const express = require('express')
const app = express()
const { AirNowFile, getObservations, setCities } = require('./lib')

app.get('/api/observations', async (req, res) => {
  try {
    let data = await getObservations(req.query)
    res.setHeader('Content-Type', 'application/json')
    res.send(data[0])
  } catch (error) {
    console.log(error)
  }
})

app.get('/api/observations/get', async (req, res) => {
  let airNowFile = new AirNowFile('HourlyAQObs', new Date().getUTCMinutes() < 35 ? -2 : -1)
  try {
    let message = await airNowFile.getFile()
    res.setHeader('Content-Type', 'application/json')
    res.send(message)
  } catch (error) {
    console.log(error)
  }
})

app.post('/api/observations/add', async (req, res) => {
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

app.patch('/api/aqsid/cities', async (req, res) => {
  try {
    let message = await setCities()
    res.setHeader('Content-Type', 'application/json')
    res.send(message)
  } catch (error) {
    console.log(error)
  }
})

app.get('*', (req, res) => {
  res.json({ message: '404' })
})

app.listen(process.env.PORT || 3000, () => {
  console.log(`air-quality-info server listening on ${process.env.PORT || 3000}`)
})
