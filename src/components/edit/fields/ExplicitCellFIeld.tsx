import { useContext } from "react";
import { ExplicitColumnDto } from "../../../table.models";
import { RowEditContext } from "../../../context";
import { TextControl } from "../controls/TextControl";
import { AuthorCellField } from "./AuthorCellField";

export const ExplicitCellField = ({
  column,
  handleChange,
}: {
  column: ExplicitColumnDto;
  handleChange: (val: string) => void;
}) => {
  const {row} = useContext(RowEditContext);

  if (column.alias === "rating") {
    return (
      <TextControl
        type="number"
        value={row.explicit.rating}
        onChange={(value) => handleChange(value)}
      />
    );
  }

  if (column.alias === "author") {
    return (
      <AuthorCellField
        value={row.explicit.author}
        handleChange={handleChange}
      ></AuthorCellField>
    );
  }

  return <></>;
};
