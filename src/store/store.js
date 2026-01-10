import { configureStore } from "@reduxjs/toolkit";
import { authReducer, postReducer } from "./slicer.js";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        post: postReducer,
    },
});