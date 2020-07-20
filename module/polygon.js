const fs = require("fs");
const logger = require("../logger");
var inside = require("point-in-polygon");

const db = require("../data.json");
const { features } = require("process");
const { parse } = require("path");

const addPolygon = function (polygon) {
  let lastId = 0;
  if (db.features.length !== 0) lastId = db.features[db.features.length - 1].id;
  polygon.id = String(++lastId);
  db.features.push(polygon);
  fs.writeFileSync("data.json", JSON.stringify(db));
  logger.log("info", `push correctly in db=>${polygon}`);
  return db;
};

const getPolygon = function () {
  return db.features;
};

const getSinglePolygon = function (id) {
  id = parseInt(id);
  for (var i = 0; i < db.features.length; i++) {
    if (db.features[i].id == id) {
      logger.log(
        "info",
        `find match polygon: ${db.features[i].properties.name}`
      );
      return db.features[i];
    }
  }
  return false;
};

const deletePolygon = function (id) {
  id = parseInt(id);
  for (var i = 0; i < db.features.length; i++) {
    if (db.features[i].id == id) {
      console.log(db.features[i].id, i);

      db.features.splice(i, 1);
      fs.writeFileSync("data.json", JSON.stringify(db));

      return true;
    }
  }
  return false;
};

const updatePolygon = function (polygon, id) {
  for (var i = 0; i < db.features.length; i++) {
    if (db.features[i].id == id) {
      db.features[i] = polygon;
      db.features[i].id = id;
      fs.writeFileSync("data.json", JSON.stringify(db));
      return true;
    }
  }
  return false;
};

const searchPolygons = function (point) {
  let result = [];
  for (var i = 0; i < db.features.length; i++) {
    if (
      inside([point.lat, point.long], db.features[i].geometry.coordinates[0])
    ) {
      logger.log(
        "info",
        `find match polygon: ${db.features[i].properties.name}`
      );
      result.push(db.features[i]);
    }
  }

  return result;
};

module.exports = {
  searchPolygons,
  addPolygon,
  getPolygon,
  getSinglePolygon,
  updatePolygon,
  deletePolygon,
};
