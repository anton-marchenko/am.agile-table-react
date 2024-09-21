import { useContext, useMemo } from "react";
import { AttributedColumnDto } from "../../../table.models";
import { DictionaryContext, RowEditContext } from "../../../context";
import { getRowWithPatchedAttributedCell } from "../../../table.utils";
import { ListControl } from "../controls/ListControl";

export const AttributedCellMultiListField = ({
  column,
}: {
  column: AttributedColumnDto;
}) => {
  const { row, updateRow } = useContext(RowEditContext);
  const dictionaries = useContext(DictionaryContext);
  const dictionary = dictionaries?.get(column.listId || -1);
  const values = useMemo(() => {
    return row.attributed.multiList[column.alias]?.value ?? [];
  }, [row, column]);

  return (
    <ListControl
      type="multiple"
      dictionary={dictionary}
      value={values}
      onChange={(values) => {
        const newRow = getRowWithPatchedAttributedCell({
          row,
          cellType: "multiList",
          alias: column.alias,
          value: values,
        });

        updateRow(newRow);
      }}
    />
  );
};
