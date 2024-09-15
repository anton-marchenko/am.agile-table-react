import { useContext, useEffect, useMemo, useState } from "react";
import { AttributedColumnDto, RowEditModel } from "../../../table.models";
import { DictionaryContext } from "../../../context";

export const AttributedCellMultiListField = ({
  row,
  column,
  onChange,
}: {
  column: AttributedColumnDto;
  row: RowEditModel;
  onChange: (v: any) => void;
}) => {
  const dictionaries = useContext(DictionaryContext);
  const dictionary = dictionaries?.get(column.listId || -1);
  const options = useMemo(() => {
    if (!dictionary) {
      return [];
    }

    return dictionary.map(
      (item) => ({ value: String(item.id), label: item.name } as const)
    );
  }, [dictionary]);
  const values = useMemo(() => {
    console.log("JO!!useMemoML");

    return row.attributed.multiList
      .filter((cell) => cell.attributeId === column.attributeId)
      .map((cell) => {
        return String(cell.listItemId);
      });
  }, [row, column]);

  const [val, setVal] = useState<readonly string[]>([]);

  useEffect(() => {
    setVal(values);
  }, [values]);

  if (!dictionary) {
    return <>loading...</>;
  }

  return (
    <>
      <div>
        <select
          className="ListControl__select"
          value={val}
          multiple={true}
          onChange={(e) => {
            /**
             * Because e.currentTarget.value is always a string,
             * even if we specify numeric values for our options.
             */
            const selectedIndexes = Array.from(e.target.selectedOptions);
            const optionValues = selectedIndexes.map(
              (element) => options[element.index].value
            );
            const dictionaryIds = selectedIndexes.map(
              (element) => dictionary[element.index].id
            );

            setVal(optionValues);
            onChange(dictionaryIds);
          }}
        >
          {options.map((item) => {
            return (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            );
          })}
        </select>
      </div>
    </>
  );
};
