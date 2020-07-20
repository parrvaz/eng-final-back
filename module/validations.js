const geojson_validation = require("geojson-validation");
const validator = require("node-input-validator");

const isPolygon = function (polygon) {
  if (
    geojson_validation.valid(polygon) &&
    geojson_validation.isPolygon(polygon)
  ) {
    return true;
  }
  return false;
};

const isPoint = function (point) {
  if (point.lat === undefined || point.long === undefined) {
    return false;
  }
  return true;
};

module.exports = { isPolygon, isPoint };
