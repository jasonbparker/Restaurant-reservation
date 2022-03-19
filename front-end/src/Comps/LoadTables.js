import React, { useEffect, useState } from "react";
import { listTables, clearTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import useQuery from "../utils/useQuery";
import { Table, Button } from "react-bootstrap";
import { useHistory } from "react-router-dom";

export default function LoadTables({ date, tables, setTables }) {
  const history = useHistory();
  const [tablesError, setTablesError] = useState(null);

  //const newDate = useQuery().get("date") ?? date;
  console.log(tables);

  useEffect(loadDashboard, []);

  function loadDashboard() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }

  async function handleClear(table_id) {
    const abortController = new AbortController();
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      try {
        await clearTable(table_id, abortController.signal);
        loadDashboard();
        // history.go();
      } catch (error) {
        setTablesError(error);
      }
    }
  }
  const renderFinishColumn = tables.some(
    (table) => table.reservation_id !== null
  );
  return (
    <Table>
      <thead>
        <tr>
          <th>#</th>
          <th>TABLE NAME</th>
          <th>CAPACITY</th>
          <th>FREE?</th>
          {renderFinishColumn && <th></th>}
        </tr>
      </thead>
      <tbody>
        <ErrorAlert error={tablesError} />
        {tables.map((table, i) => (
          <tr key={i}>
            <td>{table.table_id}</td>
            <td>{table.table_name}</td>
            <td>{table.capacity}</td>
            <td data-table-id-status={table.table_id}>
              {!table.reservation_id ? "free" : "occupied"}
            </td>
            <td data-table-id-finish={table.table_id}>
              {table.reservation_id && (
                <Button
                  data-table-id-finish={table.table_id}
                  onClick={() => handleClear(table.table_id)}
                >
                  Finish
                </Button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
