var express = require("express");
var router = express.Router();
const validations = require("../module/validations");
const logger = require("../logger");
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
  console.log("Connected to Database forms");
  const db = client.db(dbName);
  const formColeection = db.collection(collectionName);
  router
    .route("/:id")
    .get(function (req, res) {
      formColeection
        .findOne({ id: req.params.id }, { projection: { _id: 0 } })
        .then((result) => {
          res.status(200).json(result);
        });
    })
    .delete(function (req, res) {
      formColeection
        .deleteOne({ id: req.params.id })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No form to delete");
          }
          logger.log("info", `deleted form with id=>${req.params.id}`);
          res.status(200).send("form deleted succesfully");
        })
        .catch((error) => console.error(error));
    })
    .put(function (req, res) {
      id = req.params.id;
      formColeection
        .findOneAndUpdate(
          { id: id },
          { $set: req.body },
          {
            upsert: true,
          }
        )
        .then((result) => {
          logger.log("info", `updated form with id=>${req.params.id}`);
          res.status(200).send("form updated");
        })
        .catch((error) => console.error(error));
    });

  router.post("/create", (req, res) => {
    let data = req.body;

    data.response = [];
    //for calcute sum of numeric item
    let sum = {};
    data.fields.map((field) => {
      if (field.type == "Number") {
        sum[field.name] = parseInt(0);
      }
    });
    data.sum = sum;

    formColeection
      .insertOne(data)
      .then((result) => {
        logger.log("info", `create new form with id=>${req.body.id}`);
        res.send("form added successfully");
      })
      .catch((error) => console.error(error));

    res.status(200).send("form added succesfull");
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
