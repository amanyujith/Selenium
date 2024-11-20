import { useNavigate } from "react-router-dom"
import { useAuth } from "../../navigation/auth/useAuth";

const SchedulePage = () => {
    const navigate = useNavigate();
    const auth = useAuth();

    const doLogout = () => {
        auth.signout(() => {
            
        })
    }
    
    return (
        <div>
            <h6>This is schedule Page</h6>
            <button onClick={doLogout}>Logout</button>
        </div>
        
    )
}
export default SchedulePage