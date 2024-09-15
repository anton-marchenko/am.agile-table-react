import { useContext, useEffect, useState } from "react";
import { RowEditContext, TableContext } from "../../context";
import {
  AttributedColumnDto,
  GridColumnDto,
  RowDto,
  RowEditModel,
} from "../../table.models";
import "./RowEditForm.css";
import { getEmptyRow, resolveRowForm } from "../../table.utils";
import { ExplicitCellField } from "./fields/ExplicitCellFIeld";
import { AttributedCellTextField } from "./fields/AttributedCellTextField";
import { AttributedCellMultiListField } from "./fields/AttributedCellMultiListField";

const AttributedCellField = ({
  column,
  handleChange,
}: {
  column: AttributedColumnDto;
  handleChange: (val: string) => void;
}) => {
  const {row} = useContext(RowEditContext);
  const handleMl = (v: any) => {
    console.log("JO", v);
  };

  if (column.cellType === "multiList") {
    return (
      <>
        <div>
          <AttributedCellMultiListField
            row={row}
            column={column}
            onChange={handleMl}
          />
        </div>
      </>
    );
  }

  return (
    <AttributedCellTextField
      cellType={column.cellType}
      alias={column.alias}
    />
  );
};

const CellForm = ({ column }: { column: GridColumnDto }) => {
  if (column.kind === "explicit") {
    return (
      <ExplicitCellField
        column={column}
        handleChange={() => {}}
      ></ExplicitCellField>
    );
  }

  return (
    <AttributedCellField
      column={column}
      handleChange={() => {}}
    ></AttributedCellField>
  );
};

const ColumnItem = ({ column }: { column: GridColumnDto }) => {
  return (
    <div className="RowEditForm__column-data-box">
      <div className="RowEditForm__column-data-title">{column.name}</div>
      <CellForm column={column}></CellForm>
    </div>
  );
};

const columnItems = (columns: readonly GridColumnDto[]) => {
  return columns.map((column) => (
    <ColumnItem key={column.alias} column={column}></ColumnItem>
  ));
};

export const RowEditForm = ({ row }: { row?: RowDto }) => {
  const { columns } = useContext(TableContext);
  const [rowFormData, setRowFormData] = useState<RowEditModel>(getEmptyRow());

  useEffect(() => {
    if (!columns) {
      return;
    }
    if (!row) {
      return;
    }

    setRowFormData(resolveRowForm(row, columns));
  }, [row, columns]);

  if (!columns) {
    return <>No columns data</>;
  }

  return (
    <RowEditContext.Provider value={{ row: rowFormData, updateRow: setRowFormData}}>
      <div className="RowEditForm__form-box">
        {/* <div className="RowEditForm__processing-box">Saving...</div> */}
        {columnItems(columns)}
      </div>
      <div>
        {JSON.stringify(rowFormData)}
      </div>
    </RowEditContext.Provider>
  );
};
