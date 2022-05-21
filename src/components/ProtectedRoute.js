import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserAuthContext } from "../context/AuthContext";

const ProtectedRoute = () => {
  return (
    <UserAuthContext.Consumer>
      {({user}) => user ? <Outlet context={[user]} /> : <Navigate to="/login" />}
    </UserAuthContext.Consumer>
  )
};

export default ProtectedRoute;