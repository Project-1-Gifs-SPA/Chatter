import { useContext } from "react";
import AppContext from "../context/AppContext";
import { Navigate, useLocation } from "react-router-dom";

export default function AuthenticatedRoute({ children }) {

    const { user, setUser } = useContext(AppContext);
    const location = useLocation();

    if (user === null) {
        return <Navigate to="/sign-in" path={location.pathname} > </Navigate>;
    }

    return children;
}