import React, { createContext, useMemo } from "react";
import { navigation } from './navigation/navigation.config';

interface NavContextType {
    title: string,
    path: string,
    icon: string,
    transalate: string,
    permissions: string[],
    config?: any,
}
interface AppContextType {
    layout: string;
    routes: NavContextType[]
}

// Context API used for Auth related information and methods.
const AppContext = createContext<AppContextType>(null!);

// Context Provider to wrap the whole app within and make auth information available.
export function AppProvider({ children }: { children: React.ReactNode }) {
    
    const data = {
        layout: 'layout1',
        routes: navigation
    };
  
    return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
}

// Custom hook to access auth related data and methods.
// Most important hook to be used throughout
export function useApp() {
    return React.useContext(AppContext);
}