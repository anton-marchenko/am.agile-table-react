import { useContext, useMemo } from "react";
import { AttributedColumnDto, Dictionary, RowDto } from "../../table.models";
import { DictionaryContext } from "../../context";
import { EMPTY_CELL_VALUE } from "../../table.constants";

const findItemName = (listItemId: number, dictionary: Dictionary<number>) => {
  const item = dictionary.find((item) => item.id === listItemId);

  return item?.name ?? EMPTY_CELL_VALUE;
};

const MultiListCellValue = ({
  listItemId,
  dictionary,
}: {
  listItemId: number;
  dictionary: Dictionary<number>;
}) => {
  const value = useMemo(
    () => findItemName(listItemId, dictionary),
    [listItemId, dictionary]
  );

  return <>{value}</>;
};

export const AttributedMultiListCell = ({
  column,
  row,
}: {
  column: AttributedColumnDto;
  row: RowDto;
}) => {
  const dictionaries = useContext(DictionaryContext);
  const values = useMemo(
    () =>
      row.attributed.multiList.filter(
        (item) => item.attributeId === column.attributeId
      ),
    [row, column]
  );

  if (!column.listId) {
    return <>{EMPTY_CELL_VALUE}</>;
  }

  if (!dictionaries) {
    return <>loading...</>;
  }

  const dictionary = dictionaries.get(column.listId);

  if (!dictionary) {
    return <>{EMPTY_CELL_VALUE}</>;
  }

  if (!values.length) {
    return <>{EMPTY_CELL_VALUE}</>;
  }

  return (
    <>
      {values.map((value) => (
        <div key={value.id}>
          <MultiListCellValue
            dictionary={dictionary}
            listItemId={value.listItemId}
          ></MultiListCellValue>
        </div>
      ))}
    </>
  );
};
