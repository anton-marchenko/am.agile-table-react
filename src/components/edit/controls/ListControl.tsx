import { DictionaryItem } from "../../../table.models";
import "./ListControl.css";

export const ListControl = <T extends string | number>({
  dictionary,
  value,
  onChange,
}: {
  value: T;
  dictionary: readonly DictionaryItem<T>[] | null;
  onChange: (v: T) => void;
}) => {
  if (!dictionary) {
    return (
      <select disabled className="ListControl__select" defaultValue="Loading">
        <option value="Loading">Loading...</option>
      </select>
    );
  }

  return (
    <select
      className="ListControl__select"
      value={value}
      onChange={(e) => {
        /**
         * Because e.currentTarget.value is always a string,
         * even if we specify numeric values for our options.
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
