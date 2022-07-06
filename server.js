const express = require('express')
const app = express()
const cors = require('cors')
const PORT = process.env.PORT || 3001

app.use(cors())

app.get('/api/observations', (req, res) => {
  res.json({ message: 'Hello from api/observations!' })
})

app.get('*', (req, res) => {
  res.json({ message: '404' })
})

app.listen(PORT, () => {
  console.log(`air-quality-info server listening on ${PORT}`)
})
