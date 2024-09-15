import { useMemo } from "react";
import { AttributedColumnDto, RowDto } from "../../table.models";
import { EMPTY_CELL_VALUE } from "../../table.constants";

export const AttributedTextCell = ({
  column,
  row,
}: {
  column: AttributedColumnDto;
  row: RowDto;
}) => {
  const cellValue = useMemo(() => {
    const cell = row.attributed.text.find(
      (item) => item.attributeId === column.attributeId
    );

    return cell?.value || EMPTY_CELL_VALUE;
  }, [column, row]);

  return <>{cellValue}</>;
};
