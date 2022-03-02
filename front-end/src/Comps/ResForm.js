import React, { useState } from "react";
import { createReservations } from "../utils/api";

const ResForm = () => {
  const initNewRes = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [res, setRes] = useState({ ...initNewRes });

  console.log(res);

  const handleChange = (event) => {
    setRes({ ...res, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    await createReservations(res);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="first_name">First name:</label>
        <input
          name="first_name"
          type="text"
          id="firstName"
          value={res.first_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="last_name">Last name:</label>
        <input
          name="last_name"
          type="text"
          id="lastName"
          onChange={handleChange}
          value={res.last_name}
          required
        />
      </div>
      <div>
        <label htmlFor="mobile_number">Mobile number:</label>
        <input
          name="mobile_number"
          type="integer"
          id="mobile_number"
          onChange={handleChange}
          value={res.mobile_number}
          required
        />
      </div>
      <div>
        <label htmlFor="reservation_date">Date</label>
        <input
          name="reservation_date"
          type="date"
          id="reservation_date"
          onChange={handleChange}
          value={res.reservation_date}
          required
        />
      </div>
      <div>
        <label htmlFor="reservation_time">Time</label>
        <input
          name="reservation_time"
          type="text"
          id="reservation_time"
          onChange={handleChange}
          value={res.reservation_time}
          required
        />
      </div>
      <div>
        <label htmlFor="people">People</label>
        <input
          name="people"
          type="number"
          id="people"
          onChange={handleChange}
          value={res.people}
          required
          min="1"
        />
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

export default ResForm;
