import { createApi } from "@reduxjs/toolkit/query/react";
import axios from 'axios';

const baseURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

const axiosBaseQuery = ({baseURL}) => async ({url, method, data, params }) => {
    try {
        const result = await axios({
            url:baseURL+url,
            method,
            data,
            params,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
        })
        return { data: result.data };
    } catch (error) {
        let err = axiosError;
        return {
            error: {
                status: err.response?.status,
                data: err.response?.data?.error || err.message
            }
        }
    }
}


export const todoApi = createApi({
    reducerPath: 'todoApi',
    baseQuery: axiosBaseQuery({baseURL}),
    tagTypes: ['Todos'],
    endpoints: (builder) => ({
        getTodos: builder.query({
            query: () => ({url: '/todos', method: 'get'}),
            providesTags: ['Todos'],
        }),
        createTodo: builder.mutation({
            query: (todo) => ({
                url: '/todos',
                method: 'post',
                data: todo,
            }),
            invalidatesTags: ['Todos'],
        }),
        updateTodo: builder.mutation({
            query: ({id, ...updates}) => ({
                url : `/todos/${id}`,
                method: 'put',
                data: updates,
            }),
            invalidatesTags: ['Todos'],
        }),
        deleteTodo: builder.mutation({
            query: (id) => ({
                url: `/todos/${id}`,
                method: 'delete'
            }),
            invalidatesTags: ['Todos']
        })
    })
})

export const {
    useGetTodosQuery,
    useCreateTodoMutation,
    useUpdateTodoMutation,
    useDeleteTodoMutation,
} = todoApi

export const { resetApiState } = todoApi.util;
