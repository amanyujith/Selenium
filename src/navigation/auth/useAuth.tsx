import React, { createContext } from "react";
import { HdMeetAuthProvider } from "./auth";

interface AuthContextType {
    user: any;
    signin: (user: string, callback: VoidFunction) => void;
    signout: (callback: VoidFunction) => void;
  }


// Context API used for Auth related information and methods.
const AuthContext = createContext<AuthContextType>(null!);

// Context Provider to wrap the whole app within and make auth information available.
export function AuthProvider({ children }: { children: React.ReactNode }) {
    let [user, setUser] = React.useState<any>(null);

    let signin = (newUser: string, callback: VoidFunction) => {
      return HdMeetAuthProvider.signin(() => {
        setUser(newUser);
        callback();
      });
    };
  
    let signout = (callback: VoidFunction) => {
      return HdMeetAuthProvider.signout(() => {
        setUser(null);
        callback();
      });
    };
  
    let value = { user, signin, signout };
  
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
} 

// Custom hook to access auth related data and methods.
// Most important hook to be used throughout
export function useAuth() {
    return React.useContext(AuthContext);
}