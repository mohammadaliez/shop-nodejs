const HomeController = require('../../http/controllers/api/HomeController')
const {
  verifyAccessToken,
} = require('../../http/middlewares/verify-access-token')

const router = require('express').Router()
/**
 * tags
 *  name: Index Page
 *  description: Route of Home Page
 */
/**
 * @swagger
 *  /:
 *  get:
 *      summary: index of routes
 *      tags: [Index Page]
 *      description: get all need data for index page
 *      parameters:
 *          -   in: header
 *              name: access-token
 *              example: Bearer YourToken
 *      responses:
 *          200:
 *              description: success
 *          404:
 *              description: not found
 *
 *
 *
 *
 */
router.get('/', verifyAccessToken, HomeController.indexPage)
module.exports = {
  HomeRoutes: router,
}
