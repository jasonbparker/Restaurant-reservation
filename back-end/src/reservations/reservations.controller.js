const service = require("./reservations.service.js");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const { date } = req.query;
  const { mobile_number } = req.query;
  let data;
  if (date) {
    data = await service.list(date);
  } else if (mobile_number) {
    data = await service.search(mobile_number);
  } else {
    data = await service.list();
  }
  res.json({ data });
}

async function create(req, res) {
  const data = await service.create(req.body.data);
  res.status(201).json({ data });
}
async function update(req, res) {
  const { reservation_id } = res.locals.reservation;
  console.log("reservation_id", reservation_id);
  const updatedReservation = {
    ...req.body.data,
    reservation_id,
  };
  const data = await service.update(updatedReservation);
  res.json({ data });
}

async function read(req, res) {
  const reservationId = res.locals.reservationId;
  const data = await service.read(reservationId);
  res.json({ data });
}

function hasValidFields(req, res, next) {
  const { data = {} } = req.body;
  console.log("hasValidFields", data);
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

async function reservationExists(req, res, next) {
  const reservationId = req.params.reservationId;
  console.log("resIdExists", reservationId);
  const reservation = await service.read(reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    res.locals.reservationId = reservationId;
    return next();
  } else {
    next({ status: 404, message: `Reservation not found: ${reservationId}` });
  }
}
function isResFinished(req, res, next) {
  const { status } = res.locals.reservation;
  console.log("isResFinished", status);
  if (status == "finished") {
    return next({ status: 400, message: `status is finished` });
  }
  next();
}

function hasValidTime(req, res, next) {
  const {
    data: { reservation_time },
  } = req.body;
  const validTimeFormat = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/;

  if (!reservation_time) {
    next({
      status: 400,
      message: `reservation_time cannot be empty. Please select a time.`,
    });
  }
  if (!reservation_time.match(validTimeFormat)) {
    return next({
      status: 400,
      message: `the reservation_time must be a valid time in the format '12:30`,
    });
  }
  if (reservation_time <= "10:29:59") {
    next({
      status: 400,
      message: "The restaurant does not open until 10:30 a.m.",
    });
  } else {
    if (reservation_time >= "21:30:00") {
      next({
        status: 400,
        message: `The restaurant closes at 22:30 (10:30 pm). Please schedule your reservation at least one hour before close.`,
      });
    }
  }
  next();
}

function isValidDate(req, res, next) {
  const { data = {} } = req.body;
  const reservation_date = new Date(data["reservation_date"]);
  const day = reservation_date.getUTCDay();

  if (isNaN(Date.parse(data["reservation_date"]))) {
    return next({ status: 400, message: `Invalid reservation_date` });
  }
  if (day === 2) {
    return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }
  if (reservation_date < new Date()) {
    return next({
      status: 400,
      message: `Reservation must be set in the future`,
    });
  }
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
function isValidNumber(req, res, next) {
  const { data = {} } = req.body;
  if (data["people"] === 0 || !Number.isInteger(data["people"])) {
    return next({ status: 400, message: `Invalid number of people` });
  }
  next();
}
function checkStatus(req, res, next) {
  const { data = {} } = req.body;
  console.log("CheckStatus", data);
  if (data["status"] === "finished") {
    return next({ status: 400, message: `status is finished` });
  }
  if (data["status"] === "seated") {
    return next({ status: 400, message: `status is seated` });
  }
  next();
}
function checksStatus(req, res, next) {
  const data = req.body.data;
  console.log("checksStatus", data);
  if (data["status"] === "unknown") {
    return next({ status: 400, message: `status is undefined/unknown` });
  }
  next();
}

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  console.log("resId", reservation_id);
  const { status = null } = req.body.data;
  console.log("status", status);
  const data = await service.updateStatus(reservation_id, status);
  res.json({ data });
}

const has_first_name = bodyDataHas("first_name");
const has_last_name = bodyDataHas("last_name");
const has_mobile_number = bodyDataHas("mobile_number");
const has_reservation_date = bodyDataHas("reservation_date");
const has_reservation_time = bodyDataHas("reservation_time");
const has_people = bodyDataHas("people");

module.exports = {
  create: [
    hasValidFields,
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    has_people,
    isValidDate,
    hasValidTime,
    isValidNumber,
    checkStatus,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  list: [asyncErrorBoundary(list)],
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    isResFinished,
    checksStatus,
    asyncErrorBoundary(updateStatus),
  ],
  update: [
    hasValidFields,
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    has_people,
    isValidDate,
    hasValidTime,
    isValidNumber,
    checkStatus,
    asyncErrorBoundary(reservationExists),
    asyncErrorBoundary(update),
  ],
};
