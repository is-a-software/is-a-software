'use client';

import { createContext, useContext, useCallback, useEffect, useState } from 'react';

const WaitlistContext = createContext(null);

export function WaitlistProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('waitlistDismissed');
    if (!dismissed) {
      setIsOpen(true);
    }
  }, []);

  const openWaitlist = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeWaitlist = useCallback(() => {
    setIsOpen(false);
    localStorage.setItem('waitlistDismissed', 'true');
  }, []);

  return (
    <WaitlistContext.Provider value={{ isOpen, openWaitlist, closeWaitlist }}>
      {children}
    </WaitlistContext.Provider>
  );
}

export function useWaitlist() {
  const ctx = useContext(WaitlistContext);
  if (!ctx) {
    throw new Error('useWaitlist must be used within a WaitlistProvider');
  }
  return ctx;
}
