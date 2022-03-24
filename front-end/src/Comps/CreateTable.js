import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";
import { Button } from "react-bootstrap";

export default function CreateTable() {
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
    const abortController = new AbortController();
    event.preventDefault();
    try {
      await createTable(table, abortController.signal);
      history.push("/");
    } catch (error) {
      setErrors(error);
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <h1>Create Table</h1>
      <div>
        <ErrorAlert error={errors} />
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="table_name">Table name</label>
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
    </div>
  );
}
