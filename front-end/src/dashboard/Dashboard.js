import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import LoadTables from "../Comps/LoadTables";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const newDate = useQuery().get("date") ?? date;

  console.log(date, newDate);

  useEffect(loadDashboard, [newDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: newDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <ErrorAlert error={reservationsError} />
      {reservations.map((reservation) => (
        <div>
          <div>{reservation.first_name}</div>
          <div>{reservation.last_name}</div>
          <div>{reservation.mobile_number}</div>
          <div>{reservation.reservation_date}</div>
          <div>{reservation.reservation_time}</div>
          <div>{reservation.people}</div>
        </div>
      ))}
      <div>
        <div>{newDate}</div>
        <Link to={`/dashboard?date=${previous(newDate)}`}>
          <button value="previous">previous</button>
        </Link>
        <Link to={`/dashboard?date=${today(date)}`}>
          <button value="current">current</button>
        </Link>
        <Link to={`/dashboard?date=${next(newDate)}`}>
          <button value="next">next</button>
        </Link>
      </div>
      <LoadTables />
    </main>
  );
}

export default Dashboard;
