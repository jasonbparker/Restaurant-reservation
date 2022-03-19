import React, { useEffect, useState } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import { listTables, updateTable, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const [seat, setSeat] = useState("");
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const { reservationId } = useParams();
  // const reservationId = window.location.pathname.split("/")[1];
  // console.log(window.location.pathname);
  // console.log(reservation);

  function handleChange(event) {
    //let name = event.target.name;
    let value = event.target.value;
    console.log("value", value);
    // console.log("reservation", reservation);
    // console.log("resID", reservationId);
    setSeat(value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    setErrors(null);
    async function reserveTable() {
      try {
        await updateTable(
          { reservation_id: reservationId },
          seat,
          abortController.signal
        );
        history.push("/dashboard");
      } catch (error) {
        setErrors(error);
      }
    }
    reserveTable();
    return () => abortController.abort();
  }

  useEffect(() => {
    const abortController = new AbortController();
    readReservation(reservationId, abortController.signal)
      .then(setReservation)
      .catch((error) => console.log(error));
    listTables(abortController.signal)
      .then(setTables)
      .catch((error) => console.log(error));

    return () => abortController.abort();
  }, []);
  console.log("reservation", reservation);
  console.log("reservationId", reservationId);

  return (
    <div>
      <ErrorAlert error={errors} />
      <div>Seat Reservation</div>
      <div>
        #{reservationId} - {reservation.first_name} {reservation.last_name} on{" "}
        {reservation.reservation_date} at {reservation.reservation_time} for{" "}
        {reservation.people}
      </div>
      <select required onChange={handleChange} name="table_id">
        <option value="">select a seat</option>
        {tables.map((table, i) => (
          <option key={i} value={table.table_id}>
            {table.table_name} - {table.capacity}
          </option>
        ))}
      </select>
      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <Link to="/">
        <button>Cancel</button>
      </Link>
    </div>
  );
}
