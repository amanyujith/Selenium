import { combineReducers } from "redux";
import AuthReducer from "./auth.reducer";
import FlagReducer from "./flag.reducer";
import MainReducer from "./main.reducer";
import ChatReducer from "./chat.reducers";
import BreakoutReducer from "./breakout.reducer";
import CallReducer from "./call.reducer";


const reducers = combineReducers({
    Auth: AuthReducer,
    Flag: FlagReducer,
    Main: MainReducer,
    Chat: ChatReducer,
    Breakout: BreakoutReducer,
    Call: CallReducer
});
    

export default reducers;

export type RootState = ReturnType<typeof reducers>;
