'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserType } from '../types/gig.types';

interface UserContextType {
  userType: UserType;
  setUserType: (type: UserType) => void;
  balance: number;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userType, setUserType] = useState<UserType>('client');
  const [balance] = useState(5280.50);

  return (
    <UserContext.Provider value={{ userType, setUserType, balance }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within UserProvider');
  return context;
};
