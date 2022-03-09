const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((createdReservations) => createdReservations[0]);
}

function list(date) {
  if (date) {
    return knex("reservations")
      .select("*")
      .where({ reservation_date: date })
      .orderBy("reservation_time");
  }
  return knex("reservations").select("*").orderBy("reservation_time");
}

module.exports = {
  create,
  list,
};
