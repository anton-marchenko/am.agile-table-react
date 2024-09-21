import { useContext, useEffect, useState } from "react";
import { Button } from "./Button";
import { TableContext } from "../context";
import { TextControl } from "./edit/controls/TextControl";
import { TableColumnsDto } from "../table.models";

export const AttributeConfigurator = () => {
  const { columns, setColumns } = useContext(TableContext);
  const [columnsForm, setColumnsForm] = useState<TableColumnsDto>([]);

  useEffect(() => {
    setColumnsForm(columns ?? []);
  }, [columns]);

  const columnItems = () =>
    columnsForm.map((col) => (
      <div key={col.alias}>
        <div>Title</div>
        <div>
          <TextControl
            type="text"
            value={col.name}
            onChange={(value) => {
              setColumnsForm(
                columnsForm.map((colF) => {
                  if (colF.alias === col.alias) {
                    return {
                      ...colF,
                      name: value,
                    };
                  }

                  return colF;
                })

            );
            
            setTimeout(() => {
                setColumns(columnsForm)
            }, 2000)
            }}
          />
        </div>
      </div>
    )) ?? <></>;

  return (
    <>
      <div>
        <Button
          onClick={() => {
            // !!!
          }}
        >
          Create text column
        </Button>
      </div>
      <div>{columnItems()}</div>
    </>
  );
};
