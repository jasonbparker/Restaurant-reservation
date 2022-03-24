import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { listReservations, cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import LoadTables from "../Comps/LoadTables";
import { Col, Row, Container, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import "./Dashboard.css";

function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const [tables, setTables] = useState([]);

  const newDate = useQuery().get("date") ?? date;

  async function cancelRes(reservationId) {
    if (window.confirm("Do you want to cancel this reservation?")) {
      try {
        await cancelReservation(reservationId);
        history.go();
      } catch (error) {
        setReservationsError(error);
      }
    }
  }

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
    <Container fluid>
      <Row>
        <Col>
          <main className="main">
            <div className="d-md-flex mb-3"></div>
            <ErrorAlert error={reservationsError} />
            <h1>Reservations for {newDate}</h1>
            <div className="pad">
              <Link to={`/dashboard?date=${previous(newDate)}`}>
                <Button value="previous">previous</Button>
              </Link>
              <Link to={`/dashboard?date=${today(date)}`}>
                <Button value="current">current</Button>
              </Link>
              <Link to={`/dashboard?date=${next(newDate)}`}>
                <Button value="next">next</Button>
              </Link>
            </div>
            <div>{!reservations.length && <h4>No reservations found.</h4>}</div>
            {reservations.length > 0 && (
              <Table responsive striped size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>NAME</th>
                    <th>PHONE</th>
                    <th>DATE</th>
                    <th>TIME</th>
                    <th>PEOPLE</th>
                    <th>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation, i) => (
                    <tr key={reservation.reservation_id}>
                      <td>{i + 1}</td>
                      <td>{`${reservation.first_name} ${reservation.last_name}`}</td>
                      <td>{reservation.mobile_number}</td>
                      <td>{reservation.reservation_date}</td>
                      <td>{reservation.reservation_time}</td>
                      <td>{reservation.people}</td>
                      <td
                        data-reservation-id-status={`${reservation.reservation_id}`}
                      >
                        {reservation.status}
                      </td>
                      <td>
                        {reservation.status === "booked" && (
                          <div>
                            <Link
                              to={{
                                pathname: `/reservations/${reservation.reservation_id}/seat`,
                              }}
                            >
                              <Button>Seat</Button>
                            </Link>
                            <Link
                              to={{
                                pathname: `/reservations/${reservation.reservation_id}/edit`,
                              }}
                            >
                              <Button>Edit</Button>
                            </Link>
                            <Button
                              data-reservation-id-cancel={`${reservation.reservation_id}`}
                              onClick={() =>
                                cancelRes(reservation.reservation_id)
                              }
                            >
                              Cancel
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
            <h1 className="pad">Tables</h1>
            <LoadTables tables={tables} setTables={setTables} />
          </main>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
