import { createContext, useContext, useReducer, useEffect } from "react";
import  useTokenExpiryLogout  from "../hooks/tokenhelper.js";

const AuthContext = createContext();

const initialState = {
    authToken: localStorage.getItem('authToken'),
    authUser: JSON.parse(localStorage.getItem('authUser')||"null"),
    isLoggedIn: !!localStorage.getItem("authToken")
}

const authReducer = (state, action) => {
    switch(action.type) {
        case "LOGIN":
            return {
                ...state,
                authToken: action.payload.token,
                authUser: action.payload.user,
                isLoggedIn: true
            }
        case "LOGOUT":
            return {
                ...state,
                authToken: null,
                authUser: null,
                isLoggedIn: false 
            }
        default:
            return state
    }
}

export const AuthProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    const login = (token, user) => {
        dispatch({type: "LOGIN", payload: {token, user}})
    }

    const logout = () => {
        dispatch({type: "LOGOUT"});
    }

    useTokenExpiryLogout(state.authToken, logout);

    useEffect(() => {
    if (state.authToken) {
      localStorage.setItem("authToken", state.authToken);
      localStorage.setItem("authUser", JSON.stringify(state.authUser));
    } else {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
    }
  }, [state.authToken, state.authUser]);

    return (
        <AuthContext.Provider value={{...state, login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);