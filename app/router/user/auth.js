const router = require('express').Router()
const UserAthController = require('../../http/controllers/user/auth/auth.controller')

/**
 * @swagger
 *  tags:
 *      name : User-Authentication
 *      description: user auth section
 */

/**
 * @swagger
 *  /user/get-otp:
 *      post:
 *          summary: login user in use panel with phone number
 *          description: one time password(OTP) login
 *          tags: [User-Authentication]
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

router.post('/get-otp', UserAthController.getOtp)
/**
 * @swagger
 *  /user/check-otp:
 *    post:
 *          summary: check otp
 *          description: check otp with mobile code
 *          tags: [User-Authentication]
 *          parameters:
 *          -   name: mobile
 *              description: fa-IRI phone number
 *              in: formData
 *              required: true
 *              type: string
 *          -   name: code
 *              description: enter sms code received
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
 */
router.post('/check-otp', UserAthController.checkOtp)
/**
 * @swagger
 *  /user/refresh-token:
 *    post:
 *        summary: send refresh token for get new and refresh token
 *        description: refresh token
 *        tags: [User-Authentication]
 *        parameters:
 *        -     name: refreshToken
 *              in: formData
 *              required: true
 *              type: string
 *        responses:
 *          200:
 *              description: success
 */
router.post('/refresh-token', UserAthController.refreshToken)
module.exports = {
  UserAuthRoutes: router,
}
