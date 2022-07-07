const { PORT } = require('./config')
const express = require('express')
const app = express()
const cors = require('cors')
const { getObservations } = require('./lib/sql-service.js')

app.use(cors())

app.get('/api/observations', async (req, res) => {
  console.log('/api/observations was called...');
  try {
    let data = await getObservations(req.query)
    res.setHeader('Content-Type', 'application/json')
    res.send(data)
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
