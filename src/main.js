const app = require('./app/index')

require('./app/database')

const config = require('./app/config')


app.listen(config.APP_PORT,() => {
  console.log(`start at ${config.APP_PORT}`);
})
