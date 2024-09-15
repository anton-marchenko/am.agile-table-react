export const TextControl = ({
  type,
  value,
  onChange,
}: {
  type: "text" | "number" | "datetime-local";
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <input
      value={value}
      type={type}
      onChange={(e) => onChange(e.target.value)}
    />
  );
};
