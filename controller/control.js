var express = require("express");
var router = express.Router();
const validations = require("../module/validations");
const logger = require("../logger");
var MongoClient = require("mongodb").MongoClient;
var url = process.env.DB_URL;
var dbName = process.env.DB_NAME;

const collectionName = "forms";

router.use("/", function (req, res, next) {
  logger.log("info", `${req.method} request`);
  //validation of input form
  next();
});

MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
  console.log("Connected to Database");
  const db = client.db(dbName);
  const formColeection = db.collection(collectionName);

  router.get("/:id/csv", function (req, res) {
    formColeection
      .findOne({ id: req.params.id }, { projection: { _id: 0 } })
      .then((result) => {
        res.status(200).download(result);
      });
  });

  router.get("/:id", function (req, res) {
    formColeection
      .findOne({ id: req.params.id }, { projection: { _id: 0 } })
      .then((result) => {
        res.status(200).json(result);
      });
  });

  router.get("/", (req, res) => {
    db.collection(collectionName)
      .find()
      .toArray()
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => console.error(error));
  });
});

module.exports = router;
