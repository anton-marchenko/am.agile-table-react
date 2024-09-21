import { createContext } from "react";
import {
  DictionaryState,
  RowDto,
  RowEditModel,
  TableColumnsDto,
  TableRowsDto,
} from "./table.models";
import { getEmptyRow } from "./table.utils";

/**
 * Чтение словарей
 */
export const DictionaryContext = createContext<DictionaryState>(null);

/**
 * Чтение таблицы
 */
export const TableContext = createContext<{
  rows: TableRowsDto | null;
  columns: TableColumnsDto | null;
  setColumns: (columns: TableColumnsDto) => void
}>({ rows: null, columns: null, setColumns: () => {} });

/**
 * row edit action
 */
export const RowActionContext = createContext<{
  onEdit: (rowId: number) => void;
}>({ onEdit: () => {} });

/**
 * Редактирование строки
 */
export const RowEditContext = createContext<{
  row: RowEditModel;
  updateRow: (value: RowEditModel) => void;
}>({ row: getEmptyRow(), updateRow: () => {} });

/**
 * Сохранение данных на бек
 * (фризит нажат кнопок в UI)
 */
export const DataSavingContext = createContext<boolean>(false);
