import { configureStore, createSlice } from "@reduxjs/toolkit";
import authReducer from './reducers/authReducer.js';
import { todoApi } from "./services/todo.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        [todoApi.reducerPath]: todoApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(todoApi.middleware),
})

export default store;