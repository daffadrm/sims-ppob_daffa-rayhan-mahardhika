import type { JSX } from "react";

import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

import type { RootState } from "../store/store";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = useSelector((state: RootState) => state.auth.token);

  if (!token) return <Navigate to="/login" />;
  return children;
};

export default ProtectedRoute;
