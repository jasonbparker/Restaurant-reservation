import React from "react";
import { Link } from "react-router-dom";
import ResForm from "./ResForm";

export default function CreateRes() {
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

      <ResForm />
    </div>
  );
}
