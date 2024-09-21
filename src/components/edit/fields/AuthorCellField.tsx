import { useEffect, useState } from "react";
import { fetchData } from "../../../table.utils";
import { Dictionary } from "../../../table.models";
import { ListControl } from "../controls/ListControl";

type UsersDictionary = Dictionary<string> | null;

export const AuthorCellField = ({
  handleChange,
  value,
}: {
  value: string;
  handleChange: (value: string) => void;
}) => {
  const [users, setUsers] = useState<UsersDictionary>(null);

  useEffect(() => {
    setTimeout(() => {
      if (users) {
        return;
      }
      fetchData<UsersDictionary>("users", (data) => {
        setUsers(data);
      });
    }, 2000); // Моковая задержка для демотнстрации состояния лоадинга
  });

  return (
    <ListControl
      type="single"
      value={value}
      dictionary={users}
      onChange={handleChange}
    ></ListControl>
  );
};
