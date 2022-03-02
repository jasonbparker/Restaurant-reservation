const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").post(controller.create);
router.route("/").get(controller.list);

module.exports = router;
