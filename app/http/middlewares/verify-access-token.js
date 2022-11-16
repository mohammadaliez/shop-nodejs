const createHttpError = require('http-errors')
const JWT = require('jsonwebtoken')
const {UserModel} = require('../../models/users')
const {ACCESS_TOKEN_SECRET_KEY} = require('../../utils/constants')
function verifyAccessToken(req, res, next) {
  const headers = req.headers
  if (!headers['access-token'])
    return next(createHttpError.Unauthorized('please login'))
  const [bearer, token] = headers['access-token'].split(' ')
  if (token && bearer?.toLowerCase() === 'bearer') {
    JWT.verify(token, ACCESS_TOKEN_SECRET_KEY, async (err, payload) => {
      if (err) return next(createHttpError.Unauthorized('please login'))
      const {mobile} = payload || {}
      console.log(mobile)
      const user = await UserModel.findOne({mobile}, {password: 0, otp: 0})
      if (!user) return next(createHttpError.Unauthorized('user not found'))
      req.user = user
      return next()
    })
  } else return next(createHttpError.Unauthorized('please login again'))
}
module.exports = {
  verifyAccessToken,
}
