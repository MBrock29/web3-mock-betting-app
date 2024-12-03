'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [fractions, setFractions] = useState(true);
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    const savedFractions = localStorage.getItem('fractions');
    if (savedFractions !== null) {
      setFractions(savedFractions === 'true');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('fractions', fractions);
  }, [fractions]);

  const handleChange = (event) => {
    setFractions(event.target.value === 'Fractions');
  };

  const depositFunction = () => {
    setSettings(false);
    setDepositing(true);
    setWithdrawing(false);
  };

  const withdrawFunction = () => {
    setWithdrawing(true);
    setDepositing(false);
    setSettings(false);
  };

  const settingsFunction = () => {
    setSettings(true);
    setDepositing(false);
    setWithdrawing(false);
  };

  return (
    <AppContext.Provider
      value={{
        fractions,
        setFractions,
        handleChange,
        depositFunction,
        withdrawFunction,
        depositing,
        withdrawing,
        settings,
        setDepositing,
        setWithdrawing,
        setSettings,
        settingsFunction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
