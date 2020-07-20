var express = require("express");
var router = express.Router();
const logger = require("../logger");
const { search } = require("./forms");
const polygonModule = require("../module/polygon");
var MongoClient = require("mongodb").MongoClient;
var url = process.env.DB_URL;
var dbName = process.env.DB_NAME;

const collectionName = "forms";

router.use("/", function (req, res, next) {
  logger.log("info", `${req.method} request`);
  next();
});

MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
  console.log("Connected to Database");
  const db = client.db(dbName);
  const formColeection = db.collection(collectionName);
  router
    .route("/:id")
    .get(function (req, res) {
      formColeection
        .findOne({ id: req.params.id }, { projection: { _id: 0, response: 0 } })
        .then((result) => {
          res.status(200).json(result);
        });
    })
    .put(function (req, res) {
      id = req.params.id;
      data = req.body;

      let polygons = polygonModule.findPolygon(data.isLocation);
      data.area = polygons;

      formColeection
        .findOneAndUpdate({ id: id }, { $push: { response: data } }, {})
        .then((result) => {
          logger.log("info", `updated form with id=>${req.params.id}`);
          res.status(200).json(result);
        })
        .catch((error) => console.error(error));
    });

  router.get("/", (req, res) => {
    db.collection(collectionName)
      .find({}, { projection: { _id: 0, response: 0 } })
      .toArray()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => console.error(error));
  });
});

module.exports = router;
