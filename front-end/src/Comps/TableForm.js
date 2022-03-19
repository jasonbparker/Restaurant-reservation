import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTables } from "../utils/api";
import { Button } from "react-bootstrap";

export default function TableForm() {
  const history = useHistory();

  const goToPreviousPath = () => {
    history.goBack();
  };

  const initNewTable = {
    table_name: "",
    capacity: "",
  };

  const [table, setTable] = useState({ ...initNewTable });
  const [errors, setErrors] = useState(null);

  const handleChange = (event) => {
    let name = event.target.name;
    let value = event.target.value;
    setTable({ ...table, [name]: value });
  };

  const handleSubmit = async (event) => {
    if (typeof table.capacity !== "number") {
      table.capacity = Number(table.capacity);
    }
    event.preventDefault();
    try {
      await createTables(table);
      history.push("/");
    } catch (error) {
      setErrors(error);
    }
  };

  return (
    <div>
      <ErrorAlert error={errors} />
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="table_name">table name</label>
          <input
            name="table_name"
            type="text"
            id="tableName"
            value={table.table_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="capacity">Capacity</label>
          <input
            name="capacity"
            type="number"
            id="capacity"
            onChange={handleChange}
            value={table.capacity}
            required
            min="1"
          />
        </div>
        <Button type="submit" className="mr-2">
          <span className="oi oi-check"></span> Submit
        </Button>
        <Button variant="secondary" name="cancel" onClick={goToPreviousPath}>
          <span className="oi oi-x"></span> Cancel
        </Button>
      </form>
    </div>
  );
}
