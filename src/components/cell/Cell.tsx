import { useMemo } from "react";
import { EMPTY_CELL_VALUE, ExplicitColumnAlias } from "../../table.constants";
import { ExplicitColumnDto, GridColumnDto, RowDto } from "../../table.models";
import { AttributedMultiListCell } from "./AttributedMultiListCell";
import { AttributedTextCell } from "./AttributedTextCell";
import { AttributedDateCell } from "./AttributedDateCell";

const StarsRating = ({ value }: { value: number | null }) => {
  const title = useMemo(() => {
    if (!value) {
      return "";
    }

    return value >= 5 ? "Amazing" : "Good";
  }, [value]);

  return <span title={title}>{value || EMPTY_CELL_VALUE}</span>;
};

const ExplicitCell = ({
  column,
  row,
}: {
  column: ExplicitColumnDto;
  row: RowDto;
}) => {
  switch (column.alias) {
    case ExplicitColumnAlias.Rating:
      return <StarsRating value={row.explicit.rating}></StarsRating>;
    case ExplicitColumnAlias.Author:
      return <>{row.explicit.author?.name || EMPTY_CELL_VALUE}</>;
    default:
      return <></>;
  }
};

export const Cell = ({
  column,
  row,
}: {
  column: GridColumnDto;
  row: RowDto;
}) => {
  if (column.kind === "explicit") {
    return <ExplicitCell column={column} row={row}></ExplicitCell>;
  }

  switch (column.cellType) {
    case "text":
      return (
        <AttributedTextCell column={column} row={row}></AttributedTextCell>
      );
    case "date":
      return (
        <AttributedDateCell column={column} row={row}></AttributedDateCell>
      );
    case "multiList":
      return (
        <AttributedMultiListCell
          column={column}
          row={row}
        ></AttributedMultiListCell>
      );
    default:
      return <>{EMPTY_CELL_VALUE}</>;
  }
};
