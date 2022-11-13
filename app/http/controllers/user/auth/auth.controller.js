const createHttpError = require('http-errors')
const {UserModel} = require('../../../../models/users')
const {EXPIRES_IN, USER_ROLE} = require('../../../../utils/constants')
const {randomNumberGenerator} = require('../../../../utils/functions')
const {authSchema} = require('../../../validators/user/auth.schema')
const Controller = require('../../controller')

module.exports = new (class UserAthController extends Controller {
  async login(req, res, next) {
    try {
      await authSchema.validateAsync(req.body)
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
