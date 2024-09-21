import { useContext, useMemo } from "react";
import { RowEditContext } from "../../../context";
import { TextControl } from "../controls/TextControl";
import { getRowWithPatchedAttributedCell } from "../../../table.utils";

export const AttributedCellTextField = ({
  cellType,
  alias,
}: {
  alias: string;
  cellType: "text" | "date";
}) => {
  const { row, updateRow } = useContext(RowEditContext);
  const value = useMemo(() => {
    const cell = row.attributed[cellType][alias];

    return cell?.value ?? "";
  }, [row, alias, cellType]);
  const valueType = useMemo(
    () => (cellType === "text" ? "text" : "datetime-local"),
    [cellType]
  );

  return (
    <TextControl
      type={valueType}
      value={value}
      onChange={(value) => {
        const newRow = getRowWithPatchedAttributedCell({
          row,
          cellType,
          alias,
          value,
        });

        updateRow(newRow);
      }}
    />
  );
};
