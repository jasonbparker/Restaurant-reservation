import React, { useState } from "react";
import { createReservations } from "../utils/api";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";

const ResForm = () => {
  const history = useHistory();
  const initNewRes = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [res, setRes] = useState(initNewRes);
  const [errors, setErrors] = useState(null);
  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setRes({ ...res, [name]: value });
  };

  const handleSubmit = async (event) => {
    if (typeof res.people !== "number") {
      res.people = parseInt(res.people);
    }
    event.preventDefault();
    try {
      await createReservations(res);
      history.push(`/dashboard?date=${res.reservation_date}`);
    } catch (error) {
      setErrors(error);
    }
  };

  return (
    <div>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">First name</label>
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
          <label htmlFor="last_name">Last name</label>
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
          <label htmlFor="mobile_number">Mobile number</label>
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
            type="time"
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
    </div>
  );
};

export default ResForm;
