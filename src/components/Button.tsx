import { ReactNode, useContext } from "react";
import { DataSavingContext } from "../context";

export const Button = ({
  onClick,
  children
}: {
  onClick: () => void;
  children?: ReactNode;
}) => {
  const dataSaving = useContext(DataSavingContext);

  return (
    <button disabled={dataSaving} onClick={onClick}>
      {children}
    </button>
  );
};
