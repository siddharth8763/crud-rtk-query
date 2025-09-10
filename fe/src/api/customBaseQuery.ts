import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout, setAccessToken } from "../redux/slices/AuthSlice";
import { authApi } from "./authApi";
import { RootState } from "../redux/store/store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include", // Only for refresh token via cookie
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    // Attempt to refresh the access token using the refresh endpoint (cookie-based)
    const refreshResult = await api.dispatch(authApi.endpoints.refresh.initiate());
    if (refreshResult.data && refreshResult.data.accessToken) {
      api.dispatch(setAccessToken(refreshResult.data.accessToken));
      result = await baseQuery(args, api, extraOptions); // Retry request
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};







