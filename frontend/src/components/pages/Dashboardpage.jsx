import axios from "axios";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { AuthData } from "../../AuthWrapper";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { withAccessToken } from "../../axios";
import { withRefreshToken } from "./../../axios";

const Dashboardpage = () => {
  const { user, getNewTokens, setNewTokenInterval } = AuthData();
  const [users, setUsers] = useState(null);

  const [btnClicked, setBtnClicked] = useState(false);

  const getAllUsers = () => {
    withAccessToken.get("/api/users").then((res) => {
      if (res.data.users) {
        setUsers(res.data.users);
        // setErrorMsg("");
      } else if (res.data.msg) {
        if (res.data.msg === "Token Expired") {
          getNewTokens();
          // setNewTokenInterval();
          getAllUsers();
          console.log("token expired");
        }
        setUsers(null);
        // setErrorMsg(res.data.msg);
      }
    });
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const navigate = useNavigate();
  return (
    <div>
      {/* <div className="text-2xl">Dashboardpage</div> */}
      <div className=" p-4 md:max-w-5xl flex flex-col mx-auto my-4 w-full">
        <div className="flex items-center gap-4 justify-start">
          <button
            onClick={() => {
              navigate("uploadResults");
            }}
            className="h-32 w-full hover:bg-blue-600 bg-blue-500 rounded-md p-4 text-white"
          >
            Upload Results
          </button>
          <button className="h-32 w-full hover:bg-yellow-900 bg-yellow-700 rounded-md p-4 text-white">
            Add User
          </button>
        </div>
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
    </div>
  );
};

export default Dashboardpage;
