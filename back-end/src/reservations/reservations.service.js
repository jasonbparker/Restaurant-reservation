const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((createdReservations) => createdReservations[0]);
}

function list(date) {
  return (
    knex(tableName)
      .where("reservation_date", date)
      //   .whereNotIn("status", ["finished", "cancelled"])
      .orderBy("reservation_time")
  );
}

module.exports = {
  create,
  list,
};
