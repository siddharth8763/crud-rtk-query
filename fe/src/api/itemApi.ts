import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./customBaseQuery";
import { Item } from "../types";

export const itemApi = createApi({
  reducerPath: "itemApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Items"],
  endpoints: (builder) => ({
    getAllItems: builder.query<Item[], void>({
      query: () => "/items",
      providesTags: ["Items"],
    }),
    getItem: builder.query<Item, string>({
      query: (id: string) => `/items/${id}`,
      providesTags: ["Items"],
    }),
    createItem: builder.mutation<Item, Partial<Item>>({
      query: (item: Partial<Item>) => ({
        url: "/items",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Items"],
    }),
    updateItem: builder.mutation<Item, Item>({
      query: (item: Item) => ({
        url: `/items/${item._id}`,
        method: "PUT",
        body: item,
      }),
      invalidatesTags: ["Items"],
    }),
    deleteItem: builder.mutation<void, string>({
      query: (id: string) => ({
        url: `/items/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Items"],
    }),
  }),
});

export const {
  useGetAllItemsQuery,
  useGetItemQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
} = itemApi;
