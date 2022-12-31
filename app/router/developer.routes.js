const router = require('express').Router()
const bcrypt = require('bcrypt')
/**
 * @swagger
 *  tags:
 *      name : Developer-Routes
 *      description: developer Routes
 */

/**
 * @swagger
 *  /developer/password-hash/{password}:
 *      get:
 *          summary: login user in use panel with phone number
 *          description: one time password(OTP) login
 *          tags: [Developer-Routes]
 *          parameters:
 *          -   name: mobile
 *              description: fa-IRI phone number
 *              in: formData
 *              required: true
 *              type: string
 *          responses:
 *              201:
 *                  description: Success
 *              400:
 *                  description: Bad Request
 *              401:
 *                  description: Unauthorized
 *              500:
 *                  description: Internal Server Error
 *
 */
router.get('/password-hash/:password', (req, res, next) => {
  const {password} = req.params
  const salt = bcrypt.genSalt(10)
  console.log(salt)
  return bcrypt.hashSync(password, salt)
})

module.exports = {
  DeveloperRoutes: router,
}
