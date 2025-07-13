import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import authService from "../services/auth.js";

/* Flow
User -> LoginFomr -> Fill details
--> AsyncThunk --> Takes details --> does send request to backend -->for that time properly sets pending, fulfilled, rejected state globally --> onSuccess 

onSuccess -->
    -- properly check if it success and token and user details are there
    -- for proper notificaiton delays of 1000 ms in output after successfull login
    -- then using setLogin to set the isLoggedIn state and localstorage so no conflicts
    -- and then navigating to DashBoard
    -- handling error properly and setting state poprly
*/

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, thunkAPI) => {
    try {
      const response = await authService.login(credentials);
      return {authToken: response.token, authUser: {username: response.username, name: response.name}}
    } catch (error) {
        console.log(error);
      const message = error.response.data.error || "Login Failed";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const signupUser = createAsyncThunk(
    "auth/signupUser",
    async (credentials, thunkAPI) => {
        try {
            const response = await authService.signup(credentials);
            return {authToken: response.token, authUser: { username: response.username, name: response.name }}
        } catch (error) {
            const message = error.response.data.error || "SignUp Failed";
            return thunkAPI.rejectWithValue(message);
        }
    }
)

const initialState = {
  authToken: localStorage.getItem("authToken"),
  authUser: JSON.parse(localStorage.getItem("authUser") || "null"),
  isLoggedIn: !!localStorage.getItem("authToken"),
  loading: false,
  error: null,
  success: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin(state, action) {
      const { authToken, authUser } = action.payload;
      state.authToken = authToken;
      state.authUser = authUser;
      state.isLoggedIn = true;
      state.error = null;
      state.loading = false;
      state.success = true;

      localStorage.setItem("authToken", authToken);
      localStorage.setItem("authUser", JSON.stringify(authUser));
    },
    setLogOut(state) {
      state.authToken = null;
      state.authUser = null;
      state.isLoggedIn = false;
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      state.error = null;
      state.loading = false;
      state.success = false;
    },
    resetAuthState(state) {
        state.loading = false;
        state.success = false;
        state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
    // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { authToken, authUser } = action.payload;

        state.authToken = authToken;
        state.authUser = authUser;

        state.success = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to Login";
        state.success = false;
      })

    //   SignUp
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error=null;
        state.success = false;
      })
      .addCase(signupUser.fulfilled, (state, action) => {
        const {authToken, authUser } = action.payload;
        state.authToken = authToken;
        state.authUser = authUser;
        
        state.loading= false;
        state.success=true;
        state.error =null;
      })
      .addCase(signupUser.rejected, (state,action) => {
        state.loading=false;
        state.error=action.payload || "SignUp Failed";
        state.success = false;
      })
  },
});


export const {setLogin, setLogOut, resetAuthState } = authSlice.actions;
export default authSlice.reducer;
