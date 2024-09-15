/**
 * Именования:
 *
 * хххResponse - бековая модель данных
 * хххDto (data transfer object) - фронтовая модель данных (может совпадать с моделью бека)
 *
 * Explicit columns = predefined and NOT customizable
 * Attributed columns = created by user and customizable
 */

/** ======= COLUMNS ====== */
export type TableColumnsResponse = readonly (
  | ExplicitColumnDto
  | AttributedColumnResponse
)[];

export type ExplicitColumnAlias = "author" | "rating";

type ColumnBase<T extends "explicit" | "attributed"> = {
  readonly kind: T;
  /** column title for UI */
  readonly name: string;
  readonly sortable?: boolean;
  readonly width?: number;
};

export type AttrCellType = "text" | "date" | "multiList";

type AttributedColumnResponse = ColumnBase<"attributed"> & {
  readonly attributeId: number;
  readonly cellType: AttrCellType;
  /**
   * id from dictionary
   * for cellType=multiList ONLY.
   * (можно было вынести cellType=multiList с listId в отдельный тип
   * но этого не стал делать для упрощения системы типов)
   */
  readonly listId?: number;
};

export type ExplicitColumnDto = ColumnBase<"explicit"> & {
  readonly alias: string;
};

export type AttributedColumnDto = AttributedColumnResponse & {
  readonly alias: string;
};

export type TableColumnsDto = readonly GridColumnDto[];
export type GridColumnDto = ExplicitColumnDto | AttributedColumnDto;

/** ===== ROWS  ==== */
// export type TableRowsResponse = readonly RowDto[];
export type TableRowsDto = readonly RowDto[];
export type RowDto = {
  readonly rowId: number;
  readonly explicit: ExplicitCellsDto;
  readonly attributed: AttributedCellsDto;
};

/**
 * Модель для постоения формы редактирования строки
 *
 * The value you pass to controlled components should not be undefined or null.
 * If you need the initial value to be empty (such as with the firstName field below),
 * initialize your state variable to an empty string ('').
 *
 * https://react.dev/reference/react-dom/components/input#controlling-an-input-with-a-state-variable
 */

export type AttributedCellEditModelCollection = {
  text: {
    [alias: string]: {
      id: number | null;
      attributeId: number;
      value: string;
    };
  };
  date: {
    [alias: string]: {
      id: number | null;
      attributeId: number;
      value: string;
    };
  };
  multiList: {
    [alias: string]: {
      id: number | null;
      attributeId: number;
      value: number[];
    };
  };
};

export type RowEditModel = {
  rowId: number | null;
  readonly explicit: {
    rating: string;
    author: string;
  };
  attributed2: AttributedCellEditModelCollection;
  readonly attributed: {
    text: readonly {
      id: number | null;
      attributeId: number;
      value: string;
    }[];
    date: readonly {
      id: number | null;
      attributeId: number;
      value: string;
    }[];
    multiList: readonly {
      id: number | null;
      attributeId: number;
      listItemId: number;
    }[];
  };
};

/** ===== CELLS ==== */

export type DictionaryItem<T extends string | number> = {
  readonly id: T;
  readonly name: string;
};

export type Dictionary<T extends string | number> =
  readonly DictionaryItem<T>[];

export type CellValueBase = {
  /**
   * Аттрибуты (типизированные колонки)
   * создаются динамически пользователем и заносятся в БД.
   * У каждого атрибута есть attributeId
   */
  readonly attributeId: number;
  /**
   * ETag является идентификатором специфической версии ресурса.
   * Используется для разруливания конфликтов при одновременном редактировании
   * одной и той же таблицы несколькими пользователями
   */
  readonly etag: string;
  /**
   * Уникальный айди ячейки
   */
  readonly id: number;
};

export type MultiListValueDto = CellValueBase & { readonly listItemId: number };
export type TextValueDto = CellValueBase & { readonly value: string | null };
export type DateValueDto = CellValueBase & { readonly value: string | null };

export type ExplicitCellsDto = {
  readonly rating: number | null;
  readonly author: DictionaryItem<string> | null;
};

export type AttributedCellsDto = {
  readonly text: readonly TextValueDto[];
  readonly date: readonly DateValueDto[];
  readonly multiList: readonly MultiListValueDto[];
};

/** ==== SORT ==== */

export type SortDirection = "asc" | "desc";

/** === DICTIONARY === */

/**
 * С бека данные словарей прилетают в одном массиве в формате:
 * listItemId: number - айдишник элемента списка
 * item: string - само значение элемента списка,
 * listId: number - айдишник словаря
 * (у словарей есть айдишник который можно прилинковать
 * к кастомной клонке если эта колонка типа multiList)
 */
export type ListResponse = readonly ListItemDto[];
export type ListItemDto = {
  readonly listItemId: number;
  readonly listId: number;
  readonly item: string;
};

/**
 * Стейт со всеми словарями приложения (прилетают одним запросом)
 * key - айдишник словаря (listId)
 * null - состояние загрузки словарей (loading)
 */
export type DictionaryState = Map<number, Dictionary<number>> | null;
