# React + Vite + TypeScript CRUD App

## Overview
This project is a modern, full-featured front-end application built with React, TypeScript, Redux Toolkit, and Vite. It provides a secure authentication flow (register, login, logout, password reset), and allows authenticated users to perform CRUD (Create, Read, Update, Delete) operations on items. The app is designed for scalability, maintainability, and a smooth developer experience.

---

## Features
- **Authentication**: Register, login, logout, password reset (with email link and token)
- **Protected Routes**: Only authenticated users can access item management
- **CRUD Operations**: Create, view, update, and delete items
- **Token Refresh**: Automatic JWT refresh using cookies and access tokens
- **State Management**: Redux Toolkit with RTK Query for API calls and caching
- **Modern UI**: Responsive, accessible, and clean design

---

## Tech Stack
- **React 19** with functional components and hooks
- **TypeScript** for type safety
- **Redux Toolkit** for state management
- **RTK Query** for API data fetching and caching
- **React Router v7** for routing
- **Vite** for fast development and builds
- **ESLint** for code quality
- **jwt-decode** for JWT parsing

---

## Folder Structure
```
fe/
├── public/                # Static assets
├── src/
│   ├── api/               # RTK Query API slices (authApi, itemApi, customBaseQuery)
│   ├── components/        # React UI components (Login, Register, ItemList, ItemForm, etc.)
│   ├── hooks/             # Custom hooks (useAuth)
│   ├── redux/
│   │   ├── slices/        # Redux slices (AuthSlice)
│   │   └── store/         # Redux store setup
│   ├── types/             # TypeScript type definitions
│   ├── App.tsx            # Main app with routing
│   ├── main.tsx           # Entry point
│   └── ...
├── index.html             # HTML template
├── package.json           # Project metadata and scripts
├── vite.config.ts         # Vite configuration
├── tsconfig*.json         # TypeScript configs
└── ...
```

---

## Key Concepts & Architecture

### 1. **Authentication Flow**
Authentication is handled using JWT access tokens (stored in Redux) and refresh tokens (via HTTP-only cookies). The `authApi` slice manages all authentication-related endpoints, while the `useAuth` hook ensures the user's session is kept alive by refreshing tokens as needed. Protected routes are enforced using the `ProtectedRoute` component.

**Example: useAuth hook**
```ts
// src/hooks/useAuth.ts
export const useAuth = () => {
  const accessToken = useSelector((state: RootState) => state?.auth.accessToken as string | undefined);
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();

  useEffect(() => {
    if (!accessToken) {
      refresh()
        .unwrap()
        .then((response: { accessToken?: string }) => {
          if (response?.accessToken) {
            dispatch(setAccessToken(response.accessToken));
          } else {
            dispatch(logoutAction());
          }
        })
        .catch(() => {
          dispatch(logoutAction());
        });
    }
  }, [accessToken, refresh, dispatch]);

  const isAuthenticated = !!accessToken;
  return { isAuthenticated };
};
```

### 2. **State Management & API**
Redux Toolkit is used for global state management, and RTK Query is used for API calls, caching, and automatic invalidation. The `customBaseQuery` function automatically refreshes tokens on 401 errors.

**Example: RTK Query API slice**
```ts
// src/api/itemApi.ts
export const itemApi = createApi({
  reducerPath: "itemApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Items"],
  endpoints: (builder) => ({
    getAllItems: builder.query<Item[], void>({
      query: () => "/items",
      providesTags: ["Items"],
    }),
    // ...other endpoints...
  }),
});
```

### 3. **Item CRUD**
The app allows users to create, read, update, and delete items. All item actions are protected and require authentication. The `ItemList` component displays all items and allows editing/deleting, while `ItemForm` handles creation.

**Example: Creating an item**
```tsx
// src/components/ItemForm.tsx
const [form, setForm] = useState({ name: "", description: "" });
const [createItem, { isLoading, error, isSuccess }] = useCreateItemMutation();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  await createItem(form);
};
```

### 4. **Routing**
React Router v7 is used for navigation. Public and protected routes are defined in `App.tsx`. The `ProtectedRoute` component ensures only authenticated users can access certain routes.

**Example: ProtectedRoute**
```tsx
// src/components/ProtectedRoute.tsx
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
```

### 5. **Type Safety**
All API responses, requests, and Redux state are strongly typed using TypeScript. Types are defined in `src/types/index.ts`.

**Example: Item type**
```ts
// src/types/index.ts
export interface Item {
  _id: string;
  name: string;
  description: string;
}
```

---

## RTK (Redux Toolkit) Concepts

Redux Toolkit (RTK) simplifies Redux state management and API integration. Here are the main RTK concepts used in this project, with code snippets:

### 1. **Slice**
A slice is a collection of Redux reducer logic and actions for a single feature.

**Example: Auth Slice**
```ts
// src/redux/slices/AuthSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string | null;
}

const initialState: AuthState = { accessToken: null };

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
    },
  },
});

export const { setAccessToken, logout } = authSlice.actions;
export default authSlice.reducer;
```

### 2. **Store**
The store brings together all slices and API middleware.

**Example: Store Setup**
```ts
// src/redux/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../../api/authApi";
import { itemApi } from "../../api/itemApi";
import authReducer from "../slices/AuthSlice"

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [itemApi.reducerPath]: itemApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, itemApi.middleware),
});
```

### 3. **RTK Query API Slice**
RTK Query provides endpoints for data fetching, caching, and mutations.

**Example: Item API**
```ts
// src/api/itemApi.ts
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
    createItem: builder.mutation<Item, Partial<Item>>({
      query: (item: Partial<Item>) => ({
        url: "/items",
        method: "POST",
        body: item,
      }),
      invalidatesTags: ["Items"],
    }),
    // ...other endpoints...
  }),
});
```

### 4. **Custom Base Query**
A custom base query can be used to handle token refresh and error handling globally.

**Example: Custom Base Query**
```ts
// src/api/customBaseQuery.ts
import { fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { logout, setAccessToken } from "../redux/slices/AuthSlice";
import { authApi } from "./authApi";
import { RootState } from "../redux/store/store";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: "include",
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
    const refreshResult = await api.dispatch(authApi.endpoints.refresh.initiate());
    if (refreshResult.data && refreshResult.data.accessToken) {
      api.dispatch(setAccessToken(refreshResult.data.accessToken));
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};
```

### 5. **Hooks for API Calls**
RTK Query auto-generates hooks for each endpoint for use in components.

**Example: Using a Query Hook**
```tsx
// src/components/ItemList.tsx
import { useGetAllItemsQuery } from "../api/itemApi";

const { data: items, isLoading, error } = useGetAllItemsQuery();
```

**Example: Using a Mutation Hook**
```tsx
// src/components/ItemForm.tsx
import { useCreateItemMutation } from "../api/itemApi";

const [createItem, { isLoading, error, isSuccess }] = useCreateItemMutation();
```

---

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```sh
npm install
```

### Running the App
```sh
npm run dev
```
The app will be available at `http://localhost:5173` by default.

### Building for Production
```sh
npm run build
```

### Linting
```sh
npm run lint
```

---

## Environment Variables
- `VITE_API_URL`: Base URL for the backend API (see `.env`)

---

## Customization & Extensibility
- Add new features by creating new API endpoints in `src/api/`
- Add new Redux slices for additional state
- Extend item types in `src/types/`

---

## License
This project is licensed under the MIT License.
