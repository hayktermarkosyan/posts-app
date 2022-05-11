import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useUserAuth();

  console.log('aaa', user, loading)
  if(loading) (<div>loading</div>)

  return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;