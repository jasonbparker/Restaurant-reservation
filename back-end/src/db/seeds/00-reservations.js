const reservations = require("./00-reservations.json");
console.log(reservations);
exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    .then(() => knex("reservations").insert(reservations));
};
