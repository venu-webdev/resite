import React from "react";
import { AuthData } from "../../AuthWrapper";

const ProfilePage = () => {
  const { user } = AuthData();
  return (
    <div>
      <div>Profile Page</div>
      {JSON.stringify(user)}
    </div>
  );
};

export default ProfilePage;
