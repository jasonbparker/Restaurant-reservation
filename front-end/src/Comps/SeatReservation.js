import React, { useEffect, useState } from "react";
import { useHistory, Link, useParams } from "react-router-dom";
import { listTables, updateTable, readReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { Col, Row, Container, Button, Form } from "react-bootstrap";

export default function SeatReservation() {
  const [tables, setTables] = useState([]);
  const [reservation, setReservation] = useState({});
  const [seat, setSeat] = useState("");
  const [errors, setErrors] = useState(null);
  const history = useHistory();
  const { reservationId } = useParams();

  function handleChange(event) {
    let value = event.target.value;
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
  }, [reservationId]);

  return (
    <Container fluid>
      <Row>
        <Col>
          <div>
            <ErrorAlert error={errors} />
            <h1>Seat Reservation</h1>
            <h3>
              #{reservationId} - {reservation.first_name}{" "}
              {reservation.last_name}
            </h3>
            <h3>on {reservation.reservation_date}</h3>
            <h3>
              at {reservation.reservation_time} for {reservation.people}
            </h3>
            <Form.Select required onChange={handleChange} name="table_id">
              <option value="">select a seat</option>
              {tables.map((table) => (
                <option key={table.table_id} value={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              ))}
            </Form.Select>
            <Button type="submit" onClick={handleSubmit}>
              Submit
            </Button>
            <Link to="/">
              <Button>Cancel</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
