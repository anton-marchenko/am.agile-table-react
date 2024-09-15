import { useContext, useMemo } from "react";
import { RowEditContext } from "../../../context";
import { TextControl } from "../controls/TextControl";
import { patchRow } from "../../../table.utils";

export const AttributedCellTextField = ({
  cellType,
  alias,
}: {
  alias: string;
  cellType: "text" | "date";
}) => {
  const { row, updateRow } = useContext(RowEditContext);
  const value = useMemo(() => {
    const cell = row.attributed2[cellType][alias];

    return cell?.value ?? "";
  }, [row, alias, cellType]);

  return (
    <TextControl
      type={cellType === "text" ? "text" : "datetime-local"}
      value={value}
      onChange={(value) => {
        const newRow = patchRow({
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
