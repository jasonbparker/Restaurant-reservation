const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservations) => createdReservations[0]);
}

function list() {
  return knex("reservations").select("*");
}

module.exports = {
  create,
  list,
};
