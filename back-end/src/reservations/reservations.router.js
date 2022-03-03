const router = require("express").Router();
const controller = require("./reservations.controller");
//const methodNotAllowed = require("../errors/methodNotAllowed");

router.route("/").post(controller.create).get(controller.list);

module.exports = router;
