// Contexts.js
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const DataUserContext = createContext({});

export function DataUserProvider({ defaultValue = {}, children }) {
  const [dataUser, setDataUser] = useState(defaultValue);

  useEffect(() => {
    setDataUser((prev) => ({
      ...prev,
      ...defaultValue,
    }));
  }, [defaultValue]);

  const handleChangeDataUser = (data) => {
    setDataUser((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const value = useMemo(() => {
    return {
      dataUser,
      onChangeDataUser: handleChangeDataUser,
    };
  }, [dataUser]);

  return (
    <DataUserContext.Provider value={value}>
      {children}
    </DataUserContext.Provider>
  );
}

export const useDataUserContext = () => {
  const { dataUser, onChangeDataUser } = useContext(DataUserContext);

  return {
    dataUser,
    onChangeDataUser,
  };
};
