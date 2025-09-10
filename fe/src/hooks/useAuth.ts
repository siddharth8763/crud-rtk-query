import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRefreshMutation } from "../api/authApi";
import {
  setAccessToken,
  logout as logoutAction,
} from "../redux/slices/AuthSlice";
import { RootState } from "../redux/store/store";
import {jwtDecode} from "jwt-decode";

export const useAuth = () => {
  const accessToken = useSelector(
    (state: RootState) => state?.auth.accessToken as string | undefined
  );
  const dispatch = useDispatch();
  const [refresh] = useRefreshMutation();

  // On app load, always try to refresh the token if not present
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

  // Existing logic for token expiry
  useEffect(() => {
    if (accessToken) {
      const isTokenExpired = (token: string): boolean => {
        try {
          const payload = jwtDecode<{ exp: number }>(token);
          return payload.exp * 1000 < Date.now();
        } catch {
          return true;
        }
      };
      if (isTokenExpired(accessToken)) {
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
    }
  }, [accessToken, refresh, dispatch]);

  const isAuthenticated = !!accessToken;
  return { isAuthenticated };
};
