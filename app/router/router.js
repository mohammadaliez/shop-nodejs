const {HomeRoutes} = require('./api')
const {UserAuthRoutes} = require('./user/auth')

const {DeveloperRoutes} = require('./developer.routes')
const router = require('express').Router()
router.use('/user', UserAuthRoutes)
router.use('/developer', DeveloperRoutes)
router.use('/', HomeRoutes)

module.exports = {
  AllRoutes: router,
}
