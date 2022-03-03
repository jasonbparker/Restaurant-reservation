const service = require("./reservations.service.js");
//const hasProperties = require("../errors/hasProperties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// const hasRequiredProperties = hasProperties(
//   "first_name",
//   "last_name",
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people"
// );

async function list(req, res) {
  const mobile_number = req.query.mobile_number;
  const data = await (mobile_number
    ? service.search(mobile_number)
    : service.list(req.query.date));
  res.json({
    data,
  });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}

// const VALID_PROPERTIES = [
//   "first_name",
//   "last_name",
//   "mobile_number",
//   "reservation_date",
//   "reservation_time",
//   "people",
// ];

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  const validFields = new Set([
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
    "status",
    "created_at",
    "updated_at",
    "reservation_id",
  ]);

  const invalidFields = Object.keys(data).filter(
    (field) => !validFields.has(field)
  );

  if (invalidFields.length)
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  next();
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

const has_first_name = bodyDataHas("first_name");
const has_last_name = bodyDataHas("last_name");
const has_mobile_number = bodyDataHas("mobile_number");
const has_reservation_date = bodyDataHas("reservation_date");
const has_reservation_time = bodyDataHas("reservation_time");
//const has_people = bodyDataHas("people");
// const has_capacity = bodyDataHas("capacity");
// const has_table_name = bodyDataHas("table_name");
// const has_reservation_id = bodyDataHas("reservation_id");

module.exports = {
  create: [
    hasValidFields,
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    // has_people,
    // isValidDate,
    // isTime,
    // isValidNumber,
    // checkStatus,
    asyncErrorBoundary(create),
  ],
  //read: [hasReservationId, reservationExists, asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  //reservationExists: [hasReservationId, reservationExists],
  // status: [hasReservationId, reservationExists, unfinishedStatus, asyncErrorBoundary(status)],
  // update: [
  //     hasValidFields,
  //     has_first_name,
  //     has_last_name,
  //     has_mobile_number,
  //     has_reservation_date,
  //     has_reservation_time,
  //     has_people,
  //     isValidDate,
  //     isTime,
  //     isValidNumber,
  //     checkStatus,
  //     hasReservationId,
  //     reservationExists,
  //    asyncErrorBoundary(update)
  // ]
};
