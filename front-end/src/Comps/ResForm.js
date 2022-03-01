import React from "react";
import { useState } from "react-router-dom";

const ResForm = ({ handleSubmit }) => {
  const initNewRes = {
    first_name: "",
    last_name: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };

  const [res, setRes] = useState({ ...initNewRes });

  const handleChange = (event) => {
    setRes({ ...res, [event.target.id]: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="first_name">First name:</label>
        <input
          name="first_name"
          type="text"
          id="firstName"
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
          required
        />
      </div>
      <div>
        <label htmlFor="people">People</label>
        <input
          name="people"
          type="text"
          id="people"
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit" value="submit">
        Submit
      </button>
    </form>
  );
};

export default ResForm;
