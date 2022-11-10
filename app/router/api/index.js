const HomeController = require("../../http/controllers/api/HomeController");

const router = require("express").Router();

router.get("/",HomeController.indexPage)
module.exports = {
    HomeRoutes : router
}