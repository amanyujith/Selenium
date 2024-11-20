import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useAuth";

function RequireAuth({ children }: { children: JSX.Element }) {
    let auth = useAuth();
    let location = useLocation();
  
    if (!auth.user) {
      
      return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
  
    return children;
  }
  export default RequireAuth