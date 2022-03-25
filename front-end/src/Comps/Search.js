import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { listReservations, cancelReservation } from "../utils/api";
import { Table, Button, Form, Row, Col, Container } from "react-bootstrap";

const Search = () => {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [noRes, setNoRes] = useState(false);
  const history = useHistory();
  const [number, setNumber] = useState("");

  function loadSearches(e) {
    e.preventDefault();
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ mobile_number: number }, abortController.signal)
      .then(setReservations)
      .then(setNoRes(true))
      .catch(setReservationsError);
    return () => abortController.abort();
  }

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

  return (
    <Container fluid>
      <Row>
        <Col>
          <ErrorAlert error={reservationsError} />
          <Form onSubmit={loadSearches}>
            <Form.Group>
              <h1>Search Reservations</h1>
              <p>Mobile Number:</p>
              <Form.Control
                type="text"
                id="header-search"
                placeholder="Enter the customer's mobile number"
                name="mobile_number"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
              />
              <Button type="submit">Find</Button>
            </Form.Group>
          </Form>

          {reservations && (
            <div>
              <Table>
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
                        {reservation.status === "booked" && (
                          <div>
                            <Link
                              to={{
                                reservation,
                                pathname: `/reservations/${reservation.reservation_id}/seat`,
                              }}
                            >
                              <Button>Seat</Button>
                            </Link>
                            <Link
                              to={{
                                reservation,
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
              {noRes && reservations.length === 0 && (
                <h1>No reservations found</h1>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Search;
