import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
    const [authState, setAuthState] = useState({ isLoggedIn: false, role: "" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const id = localStorage.getItem("id");
        const role = localStorage.getItem("role");

        if (id) {
            setAuthState({ isLoggedIn: true, role: role || "" });
        }
        setLoading(false);
    }, []);

    return { ...authState, loading };
};

const PrivateRoutes = ({ allowedRoles }) => {
    const auth = useAuth();

    if (auth.loading) {
        return <h1>Loading...</h1>; // Show loading state while checking auth
    }

    if (!auth.isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(auth.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PrivateRoutes;
