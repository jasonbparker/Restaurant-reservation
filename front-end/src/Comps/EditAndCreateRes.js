import React, { useState, useEffect } from "react";
import {
  updateReservation,
  createReservation,
  readReservation,
} from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { Button } from "react-bootstrap";

export default function EditAndCreateRes() {
  const { reservationId } = useParams();
  const history = useHistory();

  const goToPreviousPath = () => {
    history.goBack();
  };

  const initNewRes = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [reservation, setReservation] = useState({ ...initNewRes });
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    const abortController = new AbortController();
    async function loadRes() {
      try {
        if (reservationId) {
          const response = await readReservation(
            reservationId,
            abortController.signal
          );
          setReservation(response);
        } else {
          setReservation({ ...initNewRes });
        }
      } catch (error) {
        setErrors(error);
      }
    }
    loadRes();
    return () => abortController.abort();
    // eslint-disable-next-line
  }, [reservationId]);

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setReservation({ ...reservation, [name]: value });
  };

  async function createOrEditRes(event) {
    if (typeof reservation.people !== "number") {
      reservation.people = parseInt(reservation.people);
    }
    event.preventDefault();
    const abortController = new AbortController();

    try {
      if (reservationId) {
        await updateReservation(
          reservation,
          reservationId,
          abortController.signal
        );
        history.push(`/dashboard?date=${reservation.reservation_date}`);
        setReservation({ ...initNewRes });
      } else {
        await createReservation(reservation);
        history.push(`/dashboard?date=${reservation.reservation_date}`);
        setReservation({ ...initNewRes });
      }
    } catch (error) {
      setErrors(error);
    }
    return () => abortController.abort();
  }

  return (
    <div>
      {reservationId ? (
        <h1>Edit Reservation #{reservationId}</h1>
      ) : (
        <h1>Create Reservation</h1>
      )}
      <ErrorAlert error={errors} />
      <form onSubmit={createOrEditRes}>
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
