import React from "react";
import { AuthData } from "../../AuthWrapper";

const ProfilePage = () => {
  const { user, isValidToken } = AuthData();
  return (
    <div>
      <div>Profile Page</div>
      <div>{JSON.stringify(user)}</div>
      <div>{isValidToken() ? "Valid Token" : "Invalid Token"}</div>
    </div>
  );
};

export default ProfilePage;
