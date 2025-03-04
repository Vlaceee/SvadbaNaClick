/* eslint-disable react/jsx-no-constructed-context-values */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useContext, useState } from 'react';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();

  const value = {
    currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
