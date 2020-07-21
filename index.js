const express = require("express");
var mongo = require("mongodb");
var cors = require("cors");
const body_parser = require("body-parser");
const logger = require("./logger");

// const forms = require("./forms/form");
const forms = require("./controller/forms");
const fields = require("./controller/fields");
const control = require("./controller/control");

const polygons = require("./controller/polygons");
const app = express();

app.use(cors());
app.use(body_parser.json());
app.use(express.json());

const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;

//admin
app.use("/admin/forms", forms);
app.use("/admin/polygons", polygons);

//field agent
app.use("/fieldAgent/forms", fields);

//control center
app.use("/controlCenter/forms", control);

app.get("/", function (req, res) {
  res.send("Hi!");
});

app.listen(port, () => console.log(`Example app ${port}`));
