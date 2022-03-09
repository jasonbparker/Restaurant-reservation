import React, { useEffect, useState } from "react";
import { listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";

export default function LoadTables({ date }) {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const newDate = useQuery().get("date") ?? date;

  useEffect(loadDashboard, [newDate]);

  console.log(tables);

  function loadDashboard() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  return (
    <div>
      <ErrorAlert error={tablesError} />
      {tables.map((table) => (
        <div>
          <div>{table.table_name}</div>
          <div>{table.capacity}</div>
        </div>
      ))}
    </div>
  );
}
