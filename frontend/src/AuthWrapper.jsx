import { createContext, useContext, useEffect, useState } from "react";
import {
  RenderRoutes,
  RenderMenu,
} from "./components/structure/RenderNavigation";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

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

  useEffect(() => {
    const presentAccessToken = Cookies.get("jwt-access-token");
    if (presentAccessToken) {
      const { username, email, role } = jwtDecode(presentAccessToken);
      setUser({
        email,
        role,
        username,
        isAuthenticated: true,
      });
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
            });
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
    setUser({ email: "", role: "", username: "", isAuthenticated: false });
    console.log("logging out");
    return navigate("/");
  };

  return (
    <authContext.Provider value={{ user, login, signup, logout, setTokens }}>
      <RenderMenu />
      <RenderRoutes />
    </authContext.Provider>
  );
}

export default AuthWrapper;
