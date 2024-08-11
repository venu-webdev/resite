import { createContext, useContext, useEffect, useState } from "react";
import {
  RenderRoutes,
  RenderMenu,
} from "./components/structure/RenderNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { setAccessTokenToAxios, withRefreshToken } from "./axios";

axios.defaults.baseURL = "http://localhost:3000/api";
const authContext = createContext();
export const AuthData = () => useContext(authContext);

function AuthWrapper() {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    role: "",
    username: "",
    isAuthenticated: false,
    isValidToken: false,
  });

  //set the Access & Refresh Tokens as COOKIES
  const setTokens = (accessToken, refreshToken) => {
    Cookies.set("jwt-access-token", accessToken, {
      path: "/",
      sameSite: "strict",
    });

    Cookies.set("jwt-refresh-token", refreshToken, {
      path: "/",
      sameSite: "strict",
    });
  };

  const getAccessToken = () => {
    const token = Cookies.get("jwt-access-token");
    if (token) return token;
    else return "";
  };

  const decodeToken = () => {
    const decodedToken = jwtDecode(getAccessToken());
    if (decodedToken) return decodedToken;
    else return "";
  };

  const isValidToken = () => {
    console.log("inside isValidToken function__");
    const currentDate = new Date();
    console.log("currenttime 1", currentDate.getTime());
    const decodedToken = decodeToken();
    if (decodedToken) {
      console.log(
        "decodedToken: ",
        decodedToken.exp * 1000,
        currentDate.getTime()
      );
      if (decodedToken.exp * 1000 < currentDate.getTime()) {
        console.log("currenttime 2", currentDate.getTime());
        return false;
      } else {
        console.log("currenttime 2", currentDate.getTime());
        return true;
      }
    }
  };

  const getRefreshToken = () => {
    const token = Cookies.get("jwt-refresh-token");
    if (token) return token;
    else return "";
  };

  const getNewTokens = () => {
    withRefreshToken
      .post("/api/refresh", { token: getRefreshToken() })
      .then((res) => {
        console.log("res.data in getNewAT: ", res.data);
        if (res.data.accessToken) {
          Cookies.remove("jwt-access-token", { path: "/" });
          Cookies.remove("jwt-refresh-token", { path: "/" });
          setTokens(res.data.accessToken, res.data.refreshToken);
          setAccessTokenToAxios();
        }
      });
  };

  const setNewTokenInterval = () => {
    setInterval(() => {
      console.log("refreshing the tokens");
      getNewTokens();
      console.log("tokens refreshed");
    }, 600000);
  };

  useEffect(() => {
    const presentAccessToken = Cookies.get("jwt-access-token");
    if (presentAccessToken) {
      const { username, email, role, exp } = jwtDecode(presentAccessToken);
      console.log("Exp: ", exp * 1000);
      setUser({
        email,
        role,
        username,
        isAuthenticated: true,
        isValidToken: isValidToken(),
      });
      clearInterval(setNewTokenInterval);
      setNewTokenInterval();
    }
  }, []);

  //login user
  const login = ({ email, password }) => {
    // console.log("logging in as ", email, password);
    return new Promise((resolve, reject) => {
      axios.post("/login", { email, password }).then((res) => {
        console.log("login status: ", res.data);
        let { msg, accessToken, refreshToken } = res.data;

        if (accessToken && refreshToken) {
          setTokens(accessToken, refreshToken);

          const decode = jwtDecode(accessToken);

          if (decode) {
            setUser({
              email,
              role: decode.role,
              username: decode.username,
              isAuthenticated: true,
              isValidToken: isValidToken(),
            });
            setNewTokenInterval();
            return navigate("/");
          } else {
            reject("Error in decoding the Access Token");
          }
        } else if (msg) {
          console.log("in msg: ", msg);
          reject(res.data.msg);
        }
      });
    });
  };

  //register user
  const signup = async ({ username, email, password }) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/register", { username, email, password })
        .then((res) => {
          console.log("register status: ", res.data);

          let { msg, accessToken, refreshToken } = res.data;

          if (accessToken && refreshToken) {
            setTokens(accessToken, refreshToken);

            const { email, role, username } = jwtDecode(accessToken);

            setUser({
              email,
              role,
              username,
              isAuthenticated: true,
            });
            return navigate("/");
          } else if (msg) {
            console.log("in msg: ", msg);
            reject(res.data.msg);
          }
        })
        .catch((err) => reject(err));
    });
  };

  //logout user
  const logout = () => {
    Cookies.remove("jwt-access-token", { path: "/" });
    Cookies.remove("jwt-refresh-token", { path: "/" });
    setUser({
      email: "",
      role: "",
      username: "",
      isAuthenticated: false,
      isValidToken: false,
    });
    clearInterval(setNewTokenInterval);
    console.log("logging out");
    return navigate("/");
  };

  return (
    <authContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        getNewTokens,
        setNewTokenInterval,
        getAccessToken,
        isValidToken,
      }}
    >
      <RenderMenu />
      <RenderRoutes />
    </authContext.Provider>
  );
}

export default AuthWrapper;
