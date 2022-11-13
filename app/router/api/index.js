const HomeController = require("../../http/controllers/api/HomeController");

const router = require("express").Router();
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
router.get("/",HomeController.indexPage)
module.exports = {
    HomeRoutes : router
}