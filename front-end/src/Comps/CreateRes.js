import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import ResForm from "./ResForm";
import { createReservations } from "../utils/api";

export default function CreateRes() {
  const history = useHistory();
  const [res, setRes] = useState([]);

  const handleSubmit = async () => {
    await createReservations();
  };

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <i className="bi bi-house-door-fill"></i> Cancel
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Create Reservation
          </li>
        </ol>
      </nav>

      <h1>Create Reservation</h1>

      <ResForm handleSubmit={handleSubmit} res={res} setRes={setRes} />
    </div>
  );
}
