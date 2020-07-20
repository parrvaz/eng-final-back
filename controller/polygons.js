var express = require("express");
var router = express.Router();
const validations = require("../module/validations");
const polygonModule = require("../module/polygon");
const logger = require("../logger");

router.use("/", function (req, res, next) {
  logger.log("info", `${req.method} request`);
  //validation of input polygons
  next();
});
router
  .route("/:id")
  .get(function (req, res) {
    let result = polygonModule.getSinglePolygon(req.params.id);
    if (result === false) {
      logger.log("info", `not found any polygon with id=>${req.params.id}`);
      return res.json({
        status: "error",
        message: "not found any area",
      });
    }
    res.status(200).json(result);
  })
  .delete(function (req, res) {
    let result = polygonModule.deletePolygon(req.params.id);
    if (result == false)
      return res.json({
        status: "error",
        message: "not found any area",
      });

    res.status(200).send("polygon deleted");
  })
  .put(function (req, res) {
    let result = polygonModule.updatePolygon(req.body, req.params.id);
    if (result == false)
      return res.json({
        status: "error",
        message: "not found any area",
      });

    res.status(200).send("polygon updated");
  });

router.post("/create", (req, res) => {
  let data = req.body;
  let result = polygonModule.addPolygon(data);
  res.status(200).send("polygons created");
});

router.get("/", (req, res) => {
  let result = polygonModule.getPolygon();
  res.status(200).json(result);
});

module.exports = router;
