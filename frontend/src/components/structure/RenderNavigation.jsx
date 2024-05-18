import { AuthData } from "../../AuthWrapper";
import navlinks from "../../navlinks";
import { NavLink, Route, Routes } from "react-router-dom";
import Dashboardpage from "../pages/Dashboardpage";
import ProfilePage from "../pages/ProfilePage";

export const RenderRoutes = () => {
  const { user } = AuthData();

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
            <Route path={"dashboard"} element={<Dashboardpage />} />
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
    <div className="flex justify-between p-4">
      <div>Resite</div>
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
