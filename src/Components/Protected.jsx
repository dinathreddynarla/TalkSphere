import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const Protected = ({ children, role }) => {
   const cookie = Cookies.get("session")
  const session = cookie ? JSON.parse(cookie) : null ;
  // const session = JSON.parse(localStorage.getItem("session"));

  if (!session) {
    return <Navigate to="/" />;
  }

  return children;
};

export default Protected;
