import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { today } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import { createTables } from "../utils/api";

export default function TableForm() {
  const history = useHistory();
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
    event.preventDefault();
    try {
      await createTables(table);
      history.push("/dashboard");
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
          <label htmlFor="last_name">Capacity</label>
          <input
            name="capacity"
            type="number"
            id="capacity"
            onChange={handleChange}
            value={table.capacity_name}
            required
            min="1"
          />
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
