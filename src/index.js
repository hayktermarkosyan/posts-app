import React from "react";
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from "react-router-dom";
import { UserAuthContext, UserAuthContextProvider } from "./context/AuthContext";
import App from "./App";
const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <Router>
      <UserAuthContextProvider>
        <UserAuthContext.Consumer>
          {({user}) => <App user={user} />}
        </UserAuthContext.Consumer>
      </UserAuthContextProvider>
    </Router>
  </React.StrictMode>
);