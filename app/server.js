const express = require('express')
const {default: mongoose} = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const {AllRoutes} = require('./router/router')
const createError = require('http-errors')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const cors = require('cors')
module.exports = class Application {
  #app = express()
  #DB_URI
  #PORT
  constructor(PORT, DB_URI) {
    this.#PORT = PORT
    this.#DB_URI = DB_URI
    this.configApplication()
    this.connectToMongoDB()
    this.createServer()
    this.createRoutes()
    this.errorHandling()
    this.initRedis()
  }
  configApplication() {
    this.#app.use(cors())
    this.#app.use(morgan('dev'))
    this.#app.use(express.json())
    this.#app.use(express.urlencoded({extended: true}))
    this.#app.use(express.static(path.join(__dirname, '..', 'public')))
    this.#app.use(
      '/api-doc',
      swaggerUI.serve,
      swaggerUI.setup(
        swaggerJsDoc({
          swaggerDefinition: {
            info: {
              title: 'Node js store',
              version: '1.0.0',
              description: 'store shop description',
            },
            servers: [
              {
                url: 'http://localhost:5000',
              },
            ],
          },
          apis: ['./app/router/*/*.js'],
        }),
      ),
    )
  }
  createServer() {
    const http = require('http')
    http.createServer(this.#app).listen(this.#PORT, () => {
      console.log('run > http://localhost:' + this.#PORT)
    })
  }
  connectToMongoDB() {
    mongoose.connect(this.#DB_URI, error => {
      if (!error) return console.log('connected to MongoDB')
      return console.log(error.message)
    })
    mongoose.connection.on('connected', () => {
      console.log('mongoose connected to db')
    })
    mongoose.connection.on('disconnected', () => {
      console.log('mongoose disconnected')
    })
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      console.log('disconnected')
      process.exit(0)
    })
  }
  initRedis() {
    require('./utils/init-redis')
  }
  createRoutes() {
    this.#app.use(AllRoutes)
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      next(createError.NotFound('Route not found'))
    })
    this.#app.use((error, req, res, next) => {
      const serverError = createError.InternalServerError()
      const statusCode = error.status || serverError.statusCode
      const message = error.message || serverError.message
      return res.status(statusCode).json({
        errors: {
          statusCode,
          message,
        },
      })
    })
  }
}
