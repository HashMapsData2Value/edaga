import { useState, createContext, useContext, useEffect } from "react";

const AppContext = createContext();
const useAppContext = () => {
  return useContext(AppContext);
};

const AppContextProvider = (props) => {
  const [appState, setAppState] = useState({
    attr1: "",
    attr2: "",
  });

  // HELPERS
  const helperFunc = () => {};

  // HOOKS
  useEffect(() => {}, []);
  return (
    <AppContext.Provider
      value={{
        appState,
        setAppState,
        appFunctions: {
          helperFunc,
        },
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, useAppContext };
