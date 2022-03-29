import React from "react";
import { Button } from "react-bootstrap";

export default function ResForm({
  reservation,
  handleChange,
  handleSubmit,
  goToPreviousPath,
}) {
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="first_name">First name </label>
          <input
            name="first_name"
            type="text"
            id="firstName"
            value={reservation.first_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="last_name">Last name </label>
          <input
            name="last_name"
            type="text"
            id="lastName"
            onChange={handleChange}
            value={reservation.last_name}
            required
          />
        </div>
        <div>
          <label htmlFor="mobile_number">Mobile number </label>
          <input
            name="mobile_number"
            type="integer"
            id="mobile_number"
            onChange={handleChange}
            value={reservation.mobile_number}
            required
          />
        </div>
        <div>
          <label htmlFor="reservation_date">Date </label>
          <input
            name="reservation_date"
            type="date"
            id="reservation_date"
            onChange={handleChange}
            value={reservation.reservation_date}
            required
          />
        </div>
        <div>
          <label htmlFor="reservation_time">Time </label>
          <input
            name="reservation_time"
            type="time"
            id="reservation_time"
            onChange={handleChange}
            value={reservation.reservation_time}
            required
          />
        </div>
        <div>
          <label htmlFor="people">People </label>
          <input
            name="people"
            type="number"
            id="people"
            onChange={handleChange}
            value={reservation.people}
            required
            min="1"
          />
        </div>
        <Button type="submit" className="mr-2">
          <span className="oi oi-check"></span> Submit
        </Button>
        <Button variant="secondary" name="cancel" onClick={goToPreviousPath}>
          <span className="oi oi-x"></span> Cancel
        </Button>
      </form>
    </div>
  );
}
