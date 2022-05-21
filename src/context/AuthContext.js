import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export const UserAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {
      console.log("Auth", currentuser);
      setUser(currentuser);
      if(currentuser !== null) localStorage.setItem("accessToken", currentuser.accessToken);
    });

    return () => {
      unsubscribe();
    };
  });

  return (
    <UserAuthContext.Provider
      value={{ user }}
    >
      {children}
    </UserAuthContext.Provider>
  );
}