var express = require("express");
var router = express.Router();
const validations = require("../module/validations");
const logger = require("../logger");
const polygonModule = require("../module/polygon");
var converter = require("json-2-csv");

const { request } = require("express");

var MongoClient = require("mongodb").MongoClient;
var url =
  "mongodb+srv://parrvaz:134625@cluster0.acrsm.mongodb.net/nodejsDB?retryWrites=true&w=majority";
var dbName = process.env.DB_NAME;

const collectionName = "forms";

router.use("/", function (req, res, next) {
  logger.log("info", `${req.method} request`);
  //validation of input form
  next();
});

MongoClient.connect(url, { useUnifiedTopology: true }).then((client) => {
  console.log("Connected to Database control");
  const db = client.db(dbName);
  const formColeection = db.collection(collectionName);

  router.get("/:id/csv", function (req, res) {
    formColeection
      .findOne({ id: req.params.id }, { projection: { _id: 0 } })
      .then((result) => {
        converter.json2csv(result.response, (err, csv) => {
          if (err) {
            throw err;
          }
          console.log(result.response);
          res.attachment(`report-${req.params.id}.csv`);
          res.status(200).send(csv);
        });
      });
  });

  router.get("/:id/:area", function (req, res) {
    formColeection
      .findOne({ id: req.params.id }, { projection: { _id: 0 } })
      .then((result) => {
        let records = [];

        //find record inside area
        result.response.map((res) => {
          res.area.map((geo) => {
            if (geo.id == req.params.area) {
              Object.keys(res).map((item) => {
                if ((typeof res[item] == "object") & (item != "area")) {
                  res[item] = polygonModule.searchPolygonsName(
                    res[item],
                    res.area
                  );
                }
              });
              records.push(res);
            }
          });
        });

        result.response = records;
        delete result.sum;
        res.status(200).json(result);
      });
  });

  router.get("/:id", function (req, res) {
    formColeection
      .findOne({ id: req.params.id }, { projection: { _id: 0 } })
      .then((result) => {
        //find aera
        result.response.map((res) => {
          Object.keys(res).map((item) => {
            if ((typeof res[item] == "object") & (item != "area")) {
              res[item] = polygonModule.searchPolygonsName(res[item], res.area);
            }
          });
        });

        //push sum of number
        result.response.push(result.sum);

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
