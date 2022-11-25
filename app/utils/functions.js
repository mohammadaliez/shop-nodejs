const createHttpError = require('http-errors')
const jwt = require('jsonwebtoken')
const {UserModel} = require('../models/users')
const {
  ACCESS_TOKEN_SECRET_KEY,
  REFRESH_TOKEN_SECRET_KEY,
} = require('./constants')
function randomNumberGenerator() {
  return Math.floor(Math.random() * 90000 + 10000)
}
function signAccessToken(userID) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userID)
    const payload = {
      mobile: user.mobile,
      userID: user._id,
    }
    const options = {
      expiresIn: '1h',
    }
    jwt.sign(payload, ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err) reject(createHttpError.InternalServerError('Server Error'))
      resolve(token)
    })
  })
}
function signRefreshToken(userID) {
  return new Promise(async (resolve, reject) => {
    const user = await UserModel.findById(userID)
    const payload = {
      mobile: user.mobile,
      userID: user._id,
    }
    const options = {
      expiresIn: '1y',
    }
    jwt.sign(payload, REFRESH_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err) reject(createHttpError.InternalServerError('Server Error'))
      resolve(token)
    })
  })
}
function verifyRefreshToken(token) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, REFRESH_TOKEN_SECRET_KEY, async (err, payload) => {
      if (err) reject(createHttpError.Unauthorized('please login'))
      const {mobile} = payload || {}
      const user = await UserModel.findOne({mobile}, {password: 0, otp: 0})
      if (!user) reject(createHttpError.Unauthorized('user not found'))
      resolve(mobile)
    })
  })
}
module.exports = {
  randomNumberGenerator,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
}
