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
 *  /user/login:
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

router.post('/login', UserAthController.login)
module.exports = {
  UserAuthRoutes: router,
}
