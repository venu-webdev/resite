import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthData } from "../../AuthWrapper";
import { useForm } from "react-hook-form";

const Dashboardpage = () => {
  const { user, setTokens } = AuthData();
  const [users, setUsers] = useState(null);
  // const [errorMsg, setErrorMsg] = useState("");

  const [btnClicked, setBtnClicked] = useState(false);

  const withAccessToken = axios.create({
    baseUrl: "http://localhost:3000/api",
  });

  withAccessToken.interceptors.request.use((config) => {
    const token = Cookies.get("jwt-access-token");
    config.headers.Authorization = token ? "Bearer " + token : "";
    return config;
  });

  const getRefreshToken = () => {
    console.log("called getRT");
    const token = Cookies.get("jwt-refresh-token");
    if (token) return token;
    else return "";
  };

  const withRefreshToken = axios.create({
    baseURL: "http://localhost:3000/api",
  });

  const getNewTokens = () => {
    withRefreshToken
      .post("/refresh", { token: getRefreshToken() })
      .then((res) => {
        console.log("res.data in getNewAT: ", res.data);
        if (res.data.accessToken) {
          Cookies.remove("jwt-access-token", { path: "/" });
          Cookies.remove("jwt-refresh-token", { path: "/" });
          setTokens(res.data.accessToken, res.data.refreshToken);
        }
      });
  };

  const getAllUsers = () => {
    withAccessToken.get("/users").then((res) => {
      if (res.data.users) {
        setUsers(res.data.users);
        // setErrorMsg("");
      } else if (res.data.msg) {
        if (res.data.msg === "Token Expired") {
          getNewTokens();
          getAllUsers();
        }
        setUsers(null);
        // setErrorMsg(res.data.msg);
      }
    });
  };
  useEffect(() => {
    getAllUsers();
  }, []);

  // const [form, setForm] = useForm();

  // const onSubmit = (data) => {
  //   console.log("data to be submitted is: ", data);
  // };

  return (
    <div>
      <div className="text-2xl">Dashboardpage</div>
      {user.role === "super" ? (
        <>
          <button onClick={() => setBtnClicked(true)}>Add User</button>
          {btnClicked ? "add user here" : ""}
        </>
      ) : (
        ""
      )}
      <div>
        {users
          ? users.map((user, i) => {
              return (
                <div key={i}>
                  {user.username} - {user.role}
                </div>
              );
            })
          : "no users found"}
      </div>
      {/* {errorMsg ? (
        <div className="bg-red-200 text-red-800 w-fit rounded-md p-2">
          {errorMsg}
        </div>
      ) : (
        ""
      )} */}
    </div>
  );
};

export default Dashboardpage;
