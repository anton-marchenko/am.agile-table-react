type Props =
  | {
      type: "text" | "datetime-local";
      value: string;
      onChange: (value: string) => void;
    }
  | {
      type: "number";
      value: number;
      onChange: (value: number) => void;
    };

export const TextControl = ({ type, value, onChange }: Props) => {
  return (
    <input
      value={value}
      type={type}
      onChange={(e) => {
        const value = e.target.value;

        if (type === "number") {
          onChange(Number(value));

          return;
        }

        onChange(value);
      }}
    />
  );
};
