const https = require('https')
const fs = require('fs')
const fsp = require('fs/promises')
const { parseObservationFile } = require('./file-parser-service.js')
const { insertIntoAqObs } = require('./sql-service.js')
const HOUR_MS = 36e5
const BUCKET_URL = 'https://s3-us-west-1.amazonaws.com//files.airnowtech.org/airnow/'

function yearMonthDayHourUTC(offset_ms = 0) {
  let ms = Date.now()
  let date = new Date(ms + offset_ms)
  let year = date.getUTCFullYear()
  let month = ('0' + (date.getUTCMonth() + 1)).slice(-2)
  let day = ('0' + date.getUTCDate()).slice(-2)
  let hour = ('0' + date.getUTCHours()).slice(-2)
  return year + month + day + hour
}

function pather(dateAndHour) {
  return dateAndHour.slice(0, 4) + '/' + dateAndHour.slice(0, -2) + '/'
}

function filenamer(dateAndHour, product) {
  let filename = product
  switch(product) {
    case 'HourlyAQObs':
      filename += '_' + dateAndHour + '.dat';
      break;
  }
  return filename
}

async function getFile(filename, path = 'today/') {
  let url = BUCKET_URL + path + filename
  let message
  try {
    let test = await fsp.readFile('dat/' + filename, 'utf8')
    if (test) {
      message = `${filename} already exists`
    }
  } catch (error) {
    if (error.errno === -2) {
      let file = fs.createWriteStream('dat/' + filename)

      https.get(url, function(res) {
        res.pipe(file)

        file.on('finish', () => {
          file.close()
        })
      })
      message = `${Date()} - Download complete: ${path}${filename}`
      console.log(message)
    }
  }
  return message
}

class AirNowFile {
  #product
  #todayPath
  #date
  #path
  filename
  message
  data

  constructor(product, offset = -1, todayPath = false) {
    this.#product = product
    this.#todayPath = todayPath
    this.#date = yearMonthDayHourUTC(offset * HOUR_MS)
    this.#path = pather(this.#date)
    this.filename = filenamer(this.#date, this.#product)
    this.message = ''
  }

  async getFile() {
    this.message = await getFile(this.filename, this.#todayPath ? "today/" : this.#path)
    return this.message
  }

  async parseFile() {
    this.data = await parseObservationFile(this.filename)
    return this.data
  }

  async insert(data) {
    return await insertIntoAqObs(data || this.data)
  }
}

module.exports = { AirNowFile }
