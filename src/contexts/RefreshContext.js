import React, { createContext, useState } from "react";

export const RefreshContext = createContext();

export const RefreshContextProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(0);

  return (
    <RefreshContext.Provider value={{ refresh, setRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
};
