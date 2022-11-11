const express = require('express')
const {default: mongoose} = require('mongoose')
const morgan = require('morgan')
const path = require('path')
const {AllRoutes} = require('./router/router')

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
  }
  configApplication() {
    this.#app.use(morgan('dev'))
    this.#app.use(express.json())
    this.#app.use(express.urlencoded({extended: true}))
    this.#app.use(express.static(path.join(__dirname, '..', 'public')))
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
  createRoutes() {
    this.#app.use(AllRoutes)
  }
  errorHandling() {
    this.#app.use((req, res, next) => {
      return res.status(404).json({
        statusCode: 404,
        message: 'Route not found',
      })
    })
    this.#app.use((error, req, res, next) => {
      const statusCode = error.status || 500
      const message = error.message || 'Internal server error'
      return res.status(statusCode).json({
        statusCode,
        message,
      })
    })
  }
}
