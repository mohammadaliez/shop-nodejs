const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')
const {UserModel} = require('../models/users')
const {SECRET_KEY} = require('./constants')
function randomNumberGenerator() {
  return Math.floor(Math.random() * 90000 + 10000)
}
function signAccessToken(userID) {
  return new Promise((resolve, reject) => {
    const user = UserModel.findById(userID).then(res => res)
    const payload = {
      mobile: user.mobile,
      userID: user._id,
    }
    const options = {
      expiresIn: '1h',
    }
    jwt.sign(payload, SECRET_KEY, options, (err, token) => {
      if (err) reject(createHttpError.InternalServerError('Server Error'))
      resolve(token)
    })
  })
}
module.exports = {
  randomNumberGenerator,
  signAccessToken,
}
