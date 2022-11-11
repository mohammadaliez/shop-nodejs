const HomeController = require("../../http/controllers/api/HomeController");

const router = require("express").Router();

router.post("/",HomeController.indexPage)
module.exports = {
    HomeRoutes : router
}