const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/:reservationId/status").put(controller.updateStatus);

router.route("/:reservationId").get(controller.read).put(controller.update);

router.route("/").post(controller.create).get(controller.list);

module.exports = router;
