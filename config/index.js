require('dotenv-finder')
require('dotenv').config({ path: findDotEnvFile() })
require('./server.config.js')
require('./mysql-db.config.js')
