import Dashboardpage from "./components/pages/Dashboardpage";
import Homepage from "./components/pages/Homepage";
import Loginpage from "./components/pages/Loginpage";
import MissingPage from "./components/pages/MissingPage";
import ProfilePage from "./components/pages/ProfilePage";
import RegisterPage from "./components/pages/RegisterPage";

const navlinks = [
  {
    path: "/",
    name: "Home",
    element: <Homepage />,
    isPrivate: false,
    isMenu: true,
  },
  {
    path: "/login",
    name: "Login",
    element: <Loginpage />,
    isPrivate: false,
    isMenu: false,
  },
  {
    path: "/register",
    name: "Register",
    element: <RegisterPage />,
    isPrivate: false,
    isMenu: false,
  },
  {
    path: "/profile",
    name: "Profile",
    element: <ProfilePage />,
    isPrivate: true,
    isMenu: false,
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    element: <Dashboardpage />,
    isPrivate: true,
    isNonBasic: true,
    isMenu: false,
  },
  {
    path: "*",
    name: "Missing Page",
    element: <MissingPage />,
    isPrivate: false,
    isMenu: false,
  },
];

export default navlinks;
