import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    status: false,
    userData: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            console.log('Redux login action called with:', action.payload);
            state.status = true;
            state.userData = action.payload.userData;
            localStorage.setItem('authStatus', 'true');
            localStorage.setItem('userData', JSON.stringify(action.payload.userData));
        },
        logout: (state) => {
            console.log('Redux logout action called');
            state.status = false;
            state.userData = null;
            localStorage.removeItem('authStatus');
            localStorage.removeItem('userData');
        },
    },
});
const postSlice = createSlice({
    name: "post",
    initialState: {
        posts: [],
        currentPost: null,
    },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        },
        addPost: (state, action) => {
            state.posts.push(action.payload);
        },
        updatePost: (state, action) => {
            const index = state.posts.findIndex(post => post.$id === action.payload.$id);
            if (index !== -1) {
                state.posts[index] = action.payload;
            }
        },
        deletePost: (state, action) => {
            state.posts = state.posts.filter(post => post.$id !== action.payload);
        },
        setCurrentPost: (state, action) => {
            state.currentPost = action.payload;
        },
    },
});

export const { login, logout } = authSlice.actions;
export const authReducer = authSlice.reducer;

export const { setPosts, addPost, updatePost, deletePost, setCurrentPost } = postSlice.actions;
export const postReducer = postSlice.reducer;