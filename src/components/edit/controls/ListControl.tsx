import { useMemo } from "react";
import { DictionaryItem } from "../../../table.models";
import "./ListControl.css";

type Props<T extends string | number> =
  | {
      type: "single";
      value: T;
      dictionary: readonly DictionaryItem<T>[] | null | undefined;
      onChange: (v: T) => void;
    }
  | {
      type: "multiple";
      value: number[];
      dictionary: readonly DictionaryItem<number>[] | null | undefined;
      onChange: (v: number[]) => void;
    };

export const ListControl = <T extends string | number>({
  type,
  dictionary,
  value,
  onChange,
}: Props<T>) => {
  const preparedValue = useMemo(() => {
    if (type === "multiple") {
      return value.map((val) => String(val));
    }

    return value;
  }, [type, value]);

  if (!dictionary) {
    return (
      <select
        disabled
        multiple={type === "multiple"}
        className="ListControl__select"
        defaultValue="Loading"
      >
        <option value="Loading">Loading...</option>
      </select>
    );
  }

  return (
    <select
      className="ListControl__select"
      multiple={type === "multiple"}
      value={preparedValue}
      onChange={(e) => {
        if (type === "multiple") {
          const selectedIndexes = Array.from(e.target.selectedOptions);
          const values = selectedIndexes.map(
            (element) => dictionary[element.index].id
          );

          onChange(values);

          return;
        }

        /**
         * Because e.currentTarget.value is always a string,
         * even if we specify numeric values for our options.
         *
         * @link https://mariusschulz.com/blog/passing-generics-to-jsx-elements-in-typescript
         */
        const { selectedIndex } = e.currentTarget;
        const id = dictionary[selectedIndex].id;

        onChange(id);
      }}
    >
      {dictionary.map((item) => (
        <option key={item.id} value={item.id}>
          {item.name}
        </option>
      ))}
    </select>
  );
};
