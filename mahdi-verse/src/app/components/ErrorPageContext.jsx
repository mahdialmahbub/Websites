"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const ErrorPageContext = createContext({
  isErrorPage: false,
  setIsErrorPage: () => {},
});

export const ErrorPageProvider = ({ children }) => {
  const [isErrorPage, setIsErrorPage] = useState(false);

  const value = useMemo(
    () => ({ isErrorPage, setIsErrorPage }),
    [isErrorPage]
  );

  return (
    <ErrorPageContext.Provider value={value}>
      {children}
    </ErrorPageContext.Provider>
  );
};

export const useErrorPage = () => useContext(ErrorPageContext);

// not-found / error page e boshale navbar e "Contact Me" dekhabe
export const ErrorPageMarker = () => {
  const { setIsErrorPage } = useErrorPage();

  useEffect(() => {
    setIsErrorPage(true);
    return () => setIsErrorPage(false);
  }, [setIsErrorPage]);

  return null;
};