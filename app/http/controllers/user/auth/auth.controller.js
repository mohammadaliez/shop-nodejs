const createHttpError = require('http-errors')
const {UserModel} = require('../../../../models/users')
const {EXPIRES_IN, USER_ROLE} = require('../../../../utils/constants')
const {
  randomNumberGenerator,
  signAccessToken,
} = require('../../../../utils/functions')
const {
  getOtpSchema,
  checkOtpSchema,
} = require('../../../validators/user/auth.schema')
const Controller = require('../../controller')

module.exports = new (class UserAthController extends Controller {
  async getOtp(req, res, next) {
    try {
      await getOtpSchema.validateAsync(req.body)
      const {mobile} = req.body
      const code = randomNumberGenerator()
      const result = await this.saveUser(mobile, code)
      if (!result) throw createHttpError.Unauthorized('Login not success')
      res.status(200).send({
        data: {
          statusCode: 200,
          message: 'Code send Successfully',
          code,
          mobile,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async checkOtp(req, res, next) {
    try {
      await checkOtpSchema.validateAsync(req.body)
      const {mobile, code} = req.body
      console.log(code)
      const user = await UserModel.findOne({mobile})
      if (!user) throw createHttpError.NotFound('user not found')
      if (user.otp.code != code)
        throw createHttpError.Unauthorized('sent code not correct')
      const now = Date.now()
      if (+user.otp.expiresIn < now)
        throw createHttpError.Unauthorized('code has been expired')
      const accessToken = await signAccessToken(user._id)
      return res.json({
        data: {
          accessToken,
        },
      })
    } catch (error) {
      next(error)
    }
  }

  async saveUser(mobile, code) {
    const otp = {
      code,
      expiresIn: EXPIRES_IN,
    }
    const result = await this.checkExistUser(mobile)
    if (result) {
      return await this.updateUser(mobile, {
        otp,
      })
    }

    return !!(await UserModel.create({
      mobile,
      otp,
      roles: [USER_ROLE],
    }))
  }

  async checkExistUser(mobile) {
    const user = await UserModel.findOne({mobile})
    return !!user
  }

  async updateUser(mobile, objectData = {}) {
    Object.keys(objectData).forEach(key => {
      if (['', ' ', 0, null, undefined, '0', NaN].includes(objectData[key]))
        delete objectData[key]
    })
    const updateResult = await UserModel.updateOne({mobile}, {$set: objectData})
    return !!updateResult.modifiedCount
  }
})()
