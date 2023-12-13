import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Navigate, useLocation } from "react-router-dom";

const AuthenticatedRoute = ({ children }) => {

  const { user } = useContext(AppContext);
  const location = useLocation();

  if (user === null) {
    return <Navigate to="/welcome" path={location.pathname} > </Navigate>;
  }

  return children;
}

export default AuthenticatedRoute;