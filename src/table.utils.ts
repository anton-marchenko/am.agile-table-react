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
  TableRowsDto,
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
      rating: 0,
      author: "",
    },
    attributed: {
      text: {},
      date: {},
      multiList: {},
    },
  };
};

export const resolvePatchedRowData = ({
  operation,
  rowId,
  rows,
  patchedRow,
}: {
  operation: "create" | "update";
  rowId: number;
  rows: TableRowsDto;
  patchedRow: RowDto;
}) => {
  if (operation === "create") {
    return [
      ...rows,
      {
        ...patchedRow,
        rowId: Number(rowId),
      },
    ];
  }

  return rows.map((row) => {
    if (row.rowId === rowId) {
      return patchedRow;
    }

    return row;
  });
};

export const mockResolveUpdatedRow = (
  rowForm: RowEditModel
  // columns: TableColumnsDto
): RowDto => {
  const randomId = () => new Date().getTime();
  const idPart = rowForm.rowId ? { rowId: rowForm.rowId } : {};

  return {
    ...idPart,
    explicit: {
      rating: rowForm.explicit.rating,
      author: {
        id: rowForm.explicit.author,
        name: "JOPA!" + randomId(),
      },
    },
    attributed: {
      text: Object.entries(rowForm.attributed.text).map(([k, v]) => ({
        ...v,
        id: v.id ?? randomId(),
        etag: "",
      })),
      date: [],
      multiList: [],
    },
  } as any as RowDto;
};

export const resolveRowForm = (
  row: RowDto,
  columns: TableColumnsDto
): RowEditModel => {
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
                  // TODO - продумать как сохранять мультилист.
                  // Тут может быть будет проблема CRUD
                  attributeId: column.attributeId,
                  value,
                },
              },
            };
          }

          const resolveTextValue = (cellType: "text" | "date") => {
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

          return resolveTextValue(column.cellType);
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
      rating: row.explicit.rating || 0,
      author: row.explicit.author?.id ?? "",
    },
    attributed: resolveAttrCollection(),
  };
};

export const patchExplicitCell = ({
  row,
  newData,
}: {
  row: RowEditModel;
  newData: Partial<RowEditModel["explicit"]>;
}) => {
  const newRow: RowEditModel = {
    ...row,
    explicit: {
      ...row.explicit,
      ...newData,
    },
  };

  return newRow;
};

type RowWithPatchedAttributedCellParams =
  | {
      row: RowEditModel;
      cellType: "text" | "date";
      alias: string;
      value: string;
    }
  | {
      row: RowEditModel;
      cellType: "multiList";
      alias: string;
      value: number[];
    };

export const getRowWithPatchedAttributedCell = ({
  row,
  cellType,
  alias,
  value,
}: RowWithPatchedAttributedCellParams) => {
  const cell = row.attributed[cellType][alias];
  const newRow: RowEditModel = {
    ...row,
    attributed: {
      ...row.attributed,
      [cellType]: {
        ...row.attributed[cellType],
        [alias]: {
          ...cell,
          value,
        },
      },
    },
  };

  return newRow;
};

// @deprecated сейчас вместо сервера используется IndexedDB
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
