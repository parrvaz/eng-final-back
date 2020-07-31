var express = require("express");
var router = express.Router();
const logger = require("../logger");
const polygonModule = require("../module/polygon");

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://parrvaz:134625@cluster0.acrsm.mongodb.net/nodejsDB?retryWrites=true&w=majority";
var dbName = process.env.DB_NAME;

const collectionName = "forms";

router.use("/", function (req, res, next) {
  logger.log("info", `${req.method} request`);
  next();
});

MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
  console.log("Connected to Database fields");
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
      let tempArea = [];

      let newSum = {};
      formColeection.findOne({ id: req.params.id }).then((result) => {
        let sum = result.sum;

        //update sum
        Object.keys(sum).map((item) => {
          if (data[item] != null)
            newSum[item] = sum[item] + parseInt(data[item]);
          else newSum[item] = sum[item];
        });

        //find area
        Object.keys(data).map((item) => {
          if (typeof data[item] == "object") {
            tempArea.push(...polygonModule.searchPolygons(data[item]));
          }
        });
        data.area = [...new Set(tempArea)];

        formColeection
          .findOneAndUpdate(
            { id: id },
            { $push: { response: data }, $set: { sum: newSum } },
            {}
          )
          .then((result) => {
            logger.log("info", `updated form with id=>${req.params.id}`);
            res.status(200);
          })
          .catch((error) => console.error(error));
      });
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
