import React from "react";
import { Link } from "react-router-dom";
import TableForm from "./TableForm";

export default function CreateTable() {
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
            Create Table
          </li>
        </ol>
      </nav>

      <h1>Create Table</h1>

      <TableForm />
    </div>
  );
}
