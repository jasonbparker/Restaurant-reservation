import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { listReservations, cancelReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { previous, next, today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import LoadTables from "../Comps/LoadTables";
import { Col, Row, Container, Button } from "react-bootstrap";
import Table from "react-bootstrap/Table";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const history = useHistory();
  const [tables, setTables] = useState([]);

  const newDate = useQuery().get("date") ?? date;

  async function cancelRes(reservationId) {
    if (window.confirm("Are you sure you want to delete this reservation")) {
      try {
        await cancelReservation(reservationId);
        history.go();
      } catch (error) {
        setReservationsError(error);
      }
    }
  }

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
    <Container fluid>
      <Row>
        <Col>
          <main>
            <h1>Dashboard</h1>
            <div className="d-md-flex mb-3">
              <h4 className="mb-0">Reservations for {newDate}</h4>
            </div>
            <div>
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
            <ErrorAlert error={reservationsError} />
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
                    <td>{reservation.status}</td>
                    <td>
                      {reservation.status == "booked" && (
                        <div>
                          <a
                            className="btn btn-primary"
                            href={`/reservations/${reservation.reservation_id}/seat`}
                            size="sm"
                          >
                            Seat
                          </a>
                          <Link
                            to={{
                              reservation,
                              pathname: `/reservations/${reservation.reservation_id}/Edit`,
                            }}
                          >
                            <Button>Edit</Button>
                          </Link>
                          <Button
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
            <LoadTables tables={tables} setTables={setTables} />
          </main>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
