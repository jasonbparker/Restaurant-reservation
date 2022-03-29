import React, { useState, useEffect } from "react";
import { createReservation } from "../utils/api";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import ResForm from "../Comps/ResForm";

export default function CreateRes() {
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

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setReservation({ ...reservation, [name]: value });
  };

  useEffect(() => {
    const abortController = new AbortController();
    async function loadRes() {
      try {
        setReservation({ ...initNewRes });
      } catch (error) {
        setErrors(error);
      }
    }
    loadRes();
    return () => abortController.abort();
    // eslint-disable-next-line
  }, [reservationId]);

  async function handleSubmit(event) {
    if (typeof reservation.people !== "number") {
      reservation.people = parseInt(reservation.people);
    }
    event.preventDefault();
    const abortController = new AbortController();

    try {
      await createReservation(reservation);
      history.push(`/dashboard?date=${reservation.reservation_date}`);
      setReservation({ ...initNewRes });
    } catch (error) {
      setErrors(error);
    }
    return () => abortController.abort();
  }

  return (
    <div>
      <h1>Create Reservation</h1>
      <ErrorAlert error={errors} />
      <ResForm
        reservation={reservation}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        goToPreviousPath={goToPreviousPath}
      />
    </div>
  );
}
