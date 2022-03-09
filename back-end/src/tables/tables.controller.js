const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service.js");

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
async function list(req, res) {
  const data = await service.list();
  res.json({ data });
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}
function isValidCap(req, res, next) {
  const { data = {} } = req.body;
  console.log(data);
  if (!Number.isInteger(data["capacity"])) {
    return next({ status: 400, message: `Invalid capacity` });
  }
  next();
}

function hasLength(req, res, next) {
  const { data = {} } = req.body;
  console.log(data);
  const table_name = data["table_name"];
  if (table_name.length < 2) {
    return next({ status: 400, message: `Table name is too short.` });
  }
  next();
}

const has_table_name = bodyDataHas("table_name");
const has_cap = bodyDataHas("capacity");

module.exports = {
  create: [
    has_table_name,
    has_cap,
    isValidCap,
    hasLength,
    asyncErrorBoundary(create),
  ],
  list: [asyncErrorBoundary(list)],
};
