import { PredefinedAttr } from "./table.constants";
import {
  AttributedCellEditModelCollection,
  AttributedColumnDto,
  DateValueDto,
  DictionaryItem,
  DictionaryState,
  GridColumnDto,
  ListItemDto,
  ListResponse,
  RowDto,
  RowEditModel,
  TableColumnsDto,
  TableColumnsResponse,
  TextValueDto,
} from "./table.models";

export const isPredefinedAttr = (attributeId: number) =>
  !!Object.values(PredefinedAttr).find((v) => v === attributeId);

/**
 * Из модели бекенда делает фронтовую модель элемента словаря
 */
export const resolveDictionaryItem = (
  listItem: ListItemDto
): DictionaryItem<number> => {
  return {
    id: listItem.listItemId,
    name: listItem.item,
  };
};

export const resolveGridColumns = (
  response: TableColumnsResponse
): readonly GridColumnDto[] | null => {
  return response.map((item) => {
    if (item.kind === "explicit") {
      return item;
    }

    return {
      ...item,
      alias: item.cellType + "_" + item.attributeId,
    };
  });
};

export const resolveDictionaryState = (
  listItems: ListResponse
): DictionaryState => {
  return listItems.reduce((acc, curr) => {
    const dictionaryItem = resolveDictionaryItem(curr);

    if (!acc.has(curr.listId)) {
      acc.set(curr.listId, []);
    }

    const currDictionary = acc.get(curr.listId);

    if (currDictionary) {
      currDictionary.push(dictionaryItem);
    }

    return acc;
  }, new Map<number, DictionaryItem<number>[]>());
};

export const getEmptyRow = (): RowEditModel => {
  return {
    rowId: null,
    explicit: {
      rating: "",
      author: "",
    },
    attributed2: {
      text: {},
      date: {},
      multiList: {},
    },
    attributed: {
      text: [],
      date: [],
      multiList: [],
    },
  };
};

export const resolveRowForm = (
  row: RowDto,
  columns: TableColumnsDto
): RowEditModel => {
  const resolveItem = <T extends TextValueDto | DateValueDto>(item: T) => ({
    ...item,
    value: item.value ?? "",
  });

  const resolveTextAttr = <T extends TextValueDto | DateValueDto>(cell: T) => {
    return {
      id: cell.id,
      attributeId: cell.attributeId,
      value: cell.value ?? "",
    };
  };

  const resolveAttrCollection = () => {
    return columns
      .filter(
        (column): column is AttributedColumnDto => column.kind === "attributed"
      )
      .reduce<AttributedCellEditModelCollection>(
        (acc, column) => {
          if (column.cellType === "multiList") {
            const cells = row.attributed.multiList.filter(
              (cell) => cell.attributeId === column.attributeId
            );

            if (!cells.length) {
              return acc;
            }

            const value = cells.map((cell) => cell.listItemId);

            return {
              ...acc,
              multiList: {
                ...acc.multiList,
                [column.alias]: {
                  id: cells[0].id, // TODO - продумать как сохранять мультилист. Тут будет проблема CRUD
                  attributeId: column.attributeId,
                  value,
                },
              },
            };
          }

          const resolveValue = (cellType: "text" | "date") => {
            const cells = row.attributed[cellType];
            const cell = cells.find(
              (cell) => cell.attributeId === column.attributeId
            );

            if (!cell) {
              return acc;
            }

            return {
              ...acc,
              [cellType]: {
                ...acc[cellType],
                [column.alias]: resolveTextAttr(cell),
              },
            };
          };

          return resolveValue(column.cellType);
        },
        {
          text: {},
          date: {},
          multiList: {},
        }
      );
  };

  return {
    rowId: row.rowId,
    explicit: {
      rating: String(row.explicit.rating || ""),
      author: row.explicit.author?.id ?? "",
    },
    attributed2: resolveAttrCollection(),
    attributed: {
      text: row.attributed.text.map(resolveItem),
      date: row.attributed.date.map(resolveItem),
      multiList: row.attributed.multiList,
    },
  };
};

export const patchRow = ({
  row,
  cellType,
  alias,
  value,
}: {
  row: RowEditModel;
  cellType: "text" | "date";
  alias: string;
  value: string;
}) => {
  const cell = row.attributed2[cellType][alias];
  const newRow: RowEditModel = {
    ...row,
    attributed2: {
      ...row.attributed2,
      [cellType]: {
        ...row.attributed2[cellType],
        [alias]: {
          ...cell,
          value,
        },
      },
    },
  };

  return newRow;
};

export const fetchData = async <T>(
  source: string,
  setDataCb: (data: T | null) => void
) => {
  const api = `https://my-json-server.typicode.com/anton-marchenko/jsons/agile-table__${source}`;

  try {
    const response = await fetch(api);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data: T = await response.json();

    setDataCb(data);
  } catch (_) {
    setDataCb(null);

    alert("[ERROR]: request error: " + api);
  }
};
