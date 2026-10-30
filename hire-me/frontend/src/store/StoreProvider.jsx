/* eslint-disable react-hooks/refs */
'use client';

import { setupListeners } from '@reduxjs/toolkit/query';
import { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore } from './store';

export default function StoreProvider({ children }) {
  const storeRef = useRef(null);
  if (!storeRef.current) storeRef.current = makeStore();

  // Enables refetchOnFocus / refetchOnReconnect.
  useEffect(() => {
    if (storeRef.current) return setupListeners(storeRef.current.dispatch);
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}
