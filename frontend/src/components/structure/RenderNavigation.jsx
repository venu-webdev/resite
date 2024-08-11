import { AuthData } from "../../AuthWrapper";
import navlinks from "../../navlinks";
import { NavLink, Route, Routes } from "react-router-dom";
import Dashboardpage from "../pages/Dashboardpage";
import ProfilePage from "../pages/ProfilePage";
import UploadResultsPage from "../pages/UploadResultsPage";
import Homepage from "../pages/Homepage";
import MissingPage from "./../pages/MissingPage";

export const RenderRoutes = () => {
  const {
    user,
    getAccessToken,
    setNewTokenInterval,
    getNewTokens,
    isValidToken,
  } = AuthData();
  const renderTokenRoutes = () => {
    return (
      <>
        <Route path={"dashboard"} element={<Dashboardpage />}></Route>
        <Route
          path={"dashboard/uploadResults"}
          element={<UploadResultsPage />}
        ></Route>
      </>
    );
  };
  // if (user.isAuthenticated) {
  //   setNewTokenInterval();
  // }
  // const renderTokenRoutesWithNewTokens = () => {
  //   return renderTokenRoutes();
  // };
  return (
    <Routes>
      {navlinks.map((r, i) => {
        if (!r.isPrivate) {
          return <Route path={r.path} element={r.element} key={i} />;
        } else return false;
      })}
      {user.isAuthenticated ? (
        user.role === "admin" || user.role === "super" ? (
          <>
            {true ? (
              renderTokenRoutes()
            ) : (
              <Route path={"*"} element={<MissingPage />} />
            )}
            <Route path={"profile"} element={<ProfilePage />} />
          </>
        ) : (
          <Route path={"profile"} element={<ProfilePage />} />
        )
      ) : (
        ""
      )}
    </Routes>
  );
};

export const RenderMenu = () => {
  const { user, logout } = AuthData();

  const MenuItem = ({ r }) => {
    return (
      <div>
        <NavLink to={r.path}>{r.name}</NavLink>
      </div>
    );
  };
  return (
    <div className="flex max-w-5xl m-auto justify-between p-4 items-center">
      <div className="text-3xl font-semibold tracking-tighter">Resite</div>
      <div className="flex gap-5">
        {navlinks.map((r, i) => {
          if (!r.isPrivate && r.isMenu) {
            return <MenuItem key={i} r={r} />;
          } else return false;
        })}
        {user.isAuthenticated ? (
          user.role === "admin" || user.role === "super" ? (
            <>
              <div>
                <NavLink to={"dashboard"}>Dashboard</NavLink>
              </div>
              <div>
                <NavLink to={"profile"}>Profile</NavLink>
              </div>
            </>
          ) : (
            <div>
              <NavLink to={"profile"}>Profile</NavLink>
            </div>
          )
        ) : (
          ""
        )}
        {user.isAuthenticated ? (
          <div>
            <NavLink to={"login"} onClick={logout}>
              Log out
            </NavLink>
          </div>
        ) : (
          <div>
            <NavLink to={"login"}>Log in</NavLink>
          </div>
        )}
      </div>
    </div>
  );
};
