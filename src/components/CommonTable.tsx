import { ReactNode, useContext } from "react";
import {
  AttributedColumnDto,
  ExplicitColumnDto,
  GridColumnDto,
  RowDto,
  SortDirection,
  TableColumnsDto,
  TableRowsDto,
} from "../table.models";
import { isPredefinedAttr } from "../table.utils";
import "./CommonTable.css";
import { Cell } from "./cell/Cell";
import { DataSavingContext, RowActionContext, TableContext } from "../context";
import { Button } from "./Button";

const getAttributedColumnStyle = (isPredefined: boolean) =>
  isPredefined ? { color: "green" } : {};

const getAttributedColumnTitle = (isPredefined: boolean) =>
  isPredefined ? "Predefined column" : "Attributed column";

const ExplicitColumn = ({ column }: { column: ExplicitColumnDto }) => {
  return <span title="Explicit column">{column.name}</span>;
};

const AttributedColumn = ({ column }: { column: AttributedColumnDto }) => {
  const isPredefined = isPredefinedAttr(column.attributeId);
  const style = getAttributedColumnStyle(isPredefined);
  const title = getAttributedColumnTitle(isPredefined);

  return (
    <span title={title} style={style}>
      {column.name}
    </span>
  );
};

const getColumnByType = (item: GridColumnDto) =>
  item.kind === "explicit" ? (
    <ExplicitColumn column={item}></ExplicitColumn>
  ) : (
    <AttributedColumn column={item}></AttributedColumn>
  );

const colItems = (columns: TableColumnsDto) => {
  return columns.map((item) => (
    <th key={item.alias} style={{ width: item.width }}>
      <SortedColumnTitle sortable={item.sortable}>
        {getColumnByType(item)}
      </SortedColumnTitle>
    </th>
  ));
};

const rowItems = (rows: TableRowsDto | null, columns: TableColumnsDto) => {
  if (!rows) {
    return (
      <tr>
        <td className="action-col">Loading...</td>
        {columns.map((column) => (
          <td key={column.alias}>Loading...</td>
        ))}
      </tr>
    );
  }

  return rows.map((item) => (
    <TableRow key={item.rowId} columns={columns} row={item}></TableRow>
  ));
};

const SortedColumnDirIcon = ({ direction }: { direction?: SortDirection }) => {
  if (!direction) {
    return <></>;
  }

  return <span className="dir-icon">[{direction}]</span>;
};

const SortedColumnTitle = ({
  sortable,
  direction,
  children,
}: {
  sortable?: boolean;
  direction?: SortDirection;
  children?: ReactNode;
}) => {
  if (!sortable) {
    return <>{children}</>;
  }

  return (
    <>
      <span className="sort">
        {children}{" "}
        <SortedColumnDirIcon direction={direction}></SortedColumnDirIcon>
      </span>
    </>
  );
};

const TableRow = ({
  columns,
  row,
}: {
  row: RowDto;
  columns: readonly GridColumnDto[];
}) => {
  const { onEdit } = useContext(RowActionContext);

  return (
    <tr>
      <td className="action-col">
        <Button onClick={() => onEdit(row.rowId)}>Edit</Button>
      </td>
      {columns.map((column) => (
        <td key={column.alias}>
          <Cell column={column} row={row}></Cell>
        </td>
      ))}
    </tr>
  );
};

export const CommonTable = () => {
  const { rows, columns } = useContext(TableContext);

  if (!columns) {
    return <>Loading...</>;
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th className="action-col">Action</th>
          {colItems(columns)}
        </tr>
      </thead>
      <tbody>{rowItems(rows, columns)}</tbody>
    </table>
  );
};
