import { useContext } from "react";
import { ExplicitColumnDto, RowEditModel } from "../../../table.models";
import { RowEditContext } from "../../../context";
import { TextControl } from "../controls/TextControl";
import { AuthorCellField } from "./AuthorCellField";
import { patchExplicitCell as getRowWithPatchedExplicitCell } from "../../../table.utils";

export const ExplicitCellField = ({
  column,
}: {
  column: ExplicitColumnDto;
}) => {
  const { row, updateRow } = useContext(RowEditContext);

  if (column.alias === "rating") {
    return (
      <TextControl
        type="number"
        value={row.explicit.rating}
        onChange={(value) => {
          const updatedRow: RowEditModel = getRowWithPatchedExplicitCell({
            row,
            newData: {
              rating: value,
            },
          });

          updateRow(updatedRow);
        }}
      />
    );
  }

  if (column.alias === "author") {
    return (
      <AuthorCellField
        value={row.explicit.author}
        handleChange={(value) => {
          const updatedRow: RowEditModel = getRowWithPatchedExplicitCell({
            row,
            newData: {
              author: value,
            },
          });

          updateRow(updatedRow);
        }}
      ></AuthorCellField>
    );
  }

  return <></>;
};
