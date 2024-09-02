import { useContext } from "react";
import { RefreshContext } from "../contexts/RefreshContext";

export const useRefresh = () => {
  const { refresh, setRefresh } = useContext(RefreshContext);

  return { refresh, setRefresh };
};
