import { useEffect, useState } from "react";
import "./App.css";
import { CommonTable } from "./components/CommonTable";
import {
  DataSavingContext,
  DictionaryContext,
  RowActionContext,
  RowEditContext,
  TableContext,
} from "./context";
import {
  DictionaryState,
  GridColumnDto,
  ListItemDto,
  RowDto,
  RowEditModel,
  TableColumnsDto,
  TableRowsDto,
} from "./table.models";
import {
  getEmptyRow,
  resolveDictionaryState,
  resolveGridColumns,
  resolveRowForm,
  mockResolveUpdatedRow,
  resolvePatchedRowData,
} from "./table.utils";
import { RowEditForm } from "./components/edit/RowEditForm";
import { Button } from "./components/Button";
import { AttributeConfigurator } from "./components/AttributeConfigurator";
import { fetchAllStoreData, updateDB } from "./db";

const CreateButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="App__create-btn-box">
      <Button onClick={onClick}>Create row</Button>
    </div>
  );
};

const findRow = (rows: TableRowsDto | null, rowId: number) =>
  rows?.find((row) => row.rowId === rowId);

function App() {
  const [dictionaries, setDictionaries] = useState<DictionaryState>(null);
  const [rows, setRows] = useState<TableRowsDto | null>(null);
  const [columns, setColumns] = useState<TableColumnsDto | null>(null);
  const [dataSaving, setDataSaving] = useState(false);
  const [displayRowEditForm, setDisplayRowEditForm] = useState(false);
  const [rowFormData, setRowFormData] = useState<RowEditModel>(getEmptyRow());

  useEffect(() => {
    fetchAllStoreData<RowDto>("rows", (data) => {
      setRows(data);
    });

    fetchAllStoreData<GridColumnDto>("columns", (data) => {
      const value = data ? resolveGridColumns(data) : null;

      setColumns(value);
    });

    setTimeout(() => {
      fetchAllStoreData<ListItemDto>("listItems", (data) => {
        const value = data ? resolveDictionaryState(data) : null;

        setDictionaries(value);
      });
    }, 2000);
  }, []);

  return (
    <DataSavingContext.Provider value={dataSaving}>
      <DictionaryContext.Provider value={dictionaries}>
        <TableContext.Provider value={{ rows, columns, setColumns }}>
          <RowActionContext.Provider
            value={{
              onEdit: (rowId: number) => {
                const selectedRow = findRow(rows, rowId);

                if (!selectedRow) {
                  return;
                }

                setRowFormData(resolveRowForm(selectedRow, columns!));
                setDisplayRowEditForm(true);
              },
            }}
          >
            <RowEditContext.Provider
              value={{ row: rowFormData, updateRow: setRowFormData }}
            >
              <div className="App__box">
                <div className="App__left-side">
                  <CommonTable />
                  <CreateButton
                    onClick={() => {
                      const emptyRow = getEmptyRow();

                      setRowFormData(emptyRow);
                      setDisplayRowEditForm(true);
                    }}
                  />
                  <RowEditForm
                    display={displayRowEditForm}
                    onSaved={() => {
                      const operation = rowFormData.rowId ? "update" : "create";
                      const newRow = mockResolveUpdatedRow(rowFormData);

                      updateDB(operation, "rows", newRow, (dbKey) => {
                        setDataSaving(false);
                        setDisplayRowEditForm(false);
                        setRowFormData(getEmptyRow());

                        const newData = resolvePatchedRowData({
                          rowId: Number(dbKey),
                          operation,
                          rows: rows ?? [],
                          patchedRow: newRow,
                        });

                        setRows(newData);
                      });
                    }}
                    onSaving={() => {
                      setDataSaving(true);
                    }}
                    onClose={() => {
                      setDisplayRowEditForm(false);
                      setRowFormData(getEmptyRow());
                    }}
                  />
                </div>

                <div className="App__right-side">
                  <AttributeConfigurator />
                </div>
              </div>
            </RowEditContext.Provider>
          </RowActionContext.Provider>
        </TableContext.Provider>
      </DictionaryContext.Provider>
    </DataSavingContext.Provider>
  );
}

export default App;
