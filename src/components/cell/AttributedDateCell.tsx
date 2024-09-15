import { useMemo } from "react";
import { AttributedColumnDto, RowDto } from "../../table.models";
import { EMPTY_CELL_VALUE } from "../../table.constants";
import { format } from "date-fns";

export const AttributedDateCell = ({
  column,
  row,
}: {
  column: AttributedColumnDto;
  row: RowDto;
}) => {
  const cellValue = useMemo(() => {
    const cell = row.attributed.date.find(
      (item) => item.attributeId === column.attributeId
    );

    if (!cell?.value) {
      return EMPTY_CELL_VALUE;
    }

    return format(cell.value, "dd.MM.yyyy");
  }, [column, row]);

  return <>{cellValue}</>;
};
