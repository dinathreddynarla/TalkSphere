import React from "react";
import { Navigate } from "react-router-dom";

const Protected = ({ children, role }) => {
  const session = JSON.parse(localStorage.getItem("session"));

  if (!session) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;
