import { useContext, useEffect, useState } from "react";
import { DataSavingContext, RowEditContext, TableContext } from "../../context";
import {
  AttributedColumnDto,
  GridColumnDto,
  RowDto,
  RowEditModel,
} from "../../table.models";
import "./RowEditForm.css";
import { ExplicitCellField } from "./fields/ExplicitCellFIeld";
import { AttributedCellTextField } from "./fields/AttributedCellTextField";
import { AttributedCellMultiListField } from "./fields/AttributedCellMultiListField";
import { Button } from "../Button";

const AttributedCellField = ({ column }: { column: AttributedColumnDto }) => {
  if (column.cellType === "multiList") {
    return (
      <>
        <div>
          <AttributedCellMultiListField column={column} />
        </div>
      </>
    );
  }

  return (
    <AttributedCellTextField cellType={column.cellType} alias={column.alias} />
  );
};

const CellForm = ({ column }: { column: GridColumnDto }) => {
  if (column.kind === "explicit") {
    return <ExplicitCellField column={column}></ExplicitCellField>;
  }

  return <AttributedCellField column={column}></AttributedCellField>;
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

const ProcessingMessage = ({ message }: { message: string }) => {
  if (!message) {
    return <></>;
  }

  return <div className="RowEditForm__processing-box">{message}</div>;
};

export const RowEditForm = ({
  display,
  onSaved,
  onSaving,
  onClose,
}: {
  display: boolean;
  onSaving: () => void;
  onSaved: () => void;
  onClose: () => void;
}) => {
  const { columns } = useContext(TableContext);
  const { row } = useContext(RowEditContext);
  const dataSaving = useContext(DataSavingContext);
  const [processingMessage, setProcessingMessage] = useState<string>("");

  if (!display) {
    return <></>;
  }

  if (!columns) {
    return <>No columns data</>;
  }

  return (
    <>
      <div className="RowEditForm__form-box">
        <ProcessingMessage message={processingMessage} />
        {columnItems(columns)}
        <div className="RowEditForm__buttons-box">
          <Button
            onClick={() => {
              onSaving();
              setProcessingMessage("Saving...");

              setTimeout(() => {
                onSaved();
                setProcessingMessage("");
              }, 100);
            }}
          >
            Save
          </Button>
          <Button
            onClick={() => {
              onClose();
            }}
          >
            Close
          </Button>
        </div>
      </div>
      <div className="RowEditForm__debug-box">
        <pre>{JSON.stringify(row, undefined, 2)}</pre>
      </div>
    </>
  );
};
