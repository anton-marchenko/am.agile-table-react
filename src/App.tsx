import { useEffect, useState } from "react";
import "./App.css";
import { CommonTable } from "./components/CommonTable";
import { DictionaryContext, RowActionContext, TableContext } from "./context";
import {
  DictionaryState,
  ListResponse,
  RowDto,
  TableColumnsDto,
  TableColumnsResponse,
  TableRowsDto,
} from "./table.models";
import {
  fetchData,
  resolveDictionaryState,
  resolveGridColumns,
} from "./table.utils";
import { RowEditForm } from "./components/edit/RowEditForm";

const CreateButton = () => {
  return (
    <div className="App__create-btn-box">
      <button disabled={true} onClick={() => {}}>
        Create row
      </button>
    </div>
  );
};

const AttributeConfigurator = () => {
  return <div>xxx</div>;
};

const findRow = (rows: TableRowsDto | null, rowId: number) =>
  rows?.find((row) => row.rowId === rowId);

function App() {
  const [dictionaries, setDictionaries] = useState<DictionaryState>(null);
  const [rows, setRows] = useState<TableRowsDto | null>(null);
  const [columns, setColumns] = useState<TableColumnsDto | null>(null);
  const [selectedRow, setSelectedRow] = useState<RowDto>();
  const [displayRowEditForm, setDisplayRowEditForm] = useState(false);

  useEffect(() => {
    fetchData<TableRowsDto>("rows", (data) => {
      setRows(data);
    });

    fetchData<TableColumnsResponse>("columns", (data) => {
      const value = data ? resolveGridColumns(data) : null;

      setColumns(value);
    });

    setTimeout(() => {
      fetchData<ListResponse>("list-items", (data) => {
        const value = data ? resolveDictionaryState(data) : null;

        setDictionaries(value);
      });
    }, 2000);
  }, []);

  return (
    <DictionaryContext.Provider value={dictionaries}>
      <TableContext.Provider value={{ rows, columns }}>
        <RowActionContext.Provider
          value={{
            onEdit: (rowId: number) => setSelectedRow(findRow(rows, rowId)),
          }}
        >
          <div className="App__box">
            <div className="App__left-side">
              <CommonTable></CommonTable>

              <CreateButton></CreateButton>

              <RowEditForm row={selectedRow}></RowEditForm>
            </div>

            <div className="App__right-side">
              <AttributeConfigurator></AttributeConfigurator>
            </div>
          </div>
        </RowActionContext.Provider>
      </TableContext.Provider>
    </DictionaryContext.Provider>
  );
}

export default App;
