import React from "react";
import { Link, useHistory, useState } from "react-router-dom";

export default function CreateRes() {
  const initNewRes = {
    first_name: "",
    last_name: "",
    reservation_date: "",
    reservation_time: "",
    people: 0,
  };
  const [res, setRes] = useState({ ...initNewRes });

  const handleSubmit = (newRes) => {};
  const handleChange = (event) => {
    setRes({ ...res, [event.target.id]: event.target.value });
  };

  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">
              <i className="bi bi-house-door-fill"></i> Home
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            Create Deck
          </li>
        </ol>
      </nav>

      <h1>Create Deck</h1>

      <DeckForm handleSubmit={handleSubmit} />
    </div>
  );
}
