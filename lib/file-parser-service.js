const fs = require('fs/promises')
const dayjs = require('dayjs')

async function parseObservationFile(filename) {
  let data = await fs.readFile('dat/' + filename, 'utf8')
  data = data.split(/\r?\n/) // split each newline into an array element
  data.forEach((item, i, arr) => {
    arr[i] = item.slice(1, -1).split('","') // split each comma into an array element
    arr[i].forEach((iitem, j, arri) => {
      if (arri[j] === '' || arri[j] === 'N/A') {arri[j] = null} // null out empty values... was causing issues
      if (i > 0 && j === 10) {arri[j] = dayjs(arri[j]).format('YYYY-MM-DD')} // change the date format if not the header row
      // console.log(j + ": " + arri[j]) // DEBUG:
    })
  })
  if (data[0][0] == 'AQSID') {
    data.shift() // remove header
  }
  if (data[data.length - 1][0] == '' || data[data.length - 1][0] == null) {
    data.pop() // handle empty last line in dat files
  }
  return data
}

module.exports = { parseObservationFile }
