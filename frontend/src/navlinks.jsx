import Dashboardpage from "./components/pages/Dashboardpage";
import Homepage from "./components/pages/Homepage";
import Loginpage from "./components/pages/Loginpage";
// import MissingPage from "./components/pages/MissingPage";
import ProfilePage from "./components/pages/ProfilePage";
import RegisterPage from "./components/pages/RegisterPage";
import ResultsPage from "./components/pages/ResultsPage";
import UploadResultsPage from "./components/pages/UploadResultsPage";

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
    children: [
      {
        path: "uploadResults",
        element: <div>HI hello uload heare</div>,
      },
    ],
    isPrivate: true,
    isNonBasic: true,
    isMenu: false,
  },
  {
    path: "/resultSetId/:id",
    name: "Result Page",
    element: <ResultsPage />,
    isPrivate: false,
    isMenu: false,
  },
  // {
  //   path: "/dashboard/uploadResults",
  //   name: "Results Upload Page",
  //   element: <UploadResultsPage />,
  //   isPrivate: true,
  //   isMenu: false,
  // },
  // {
  //   path: "*",
  //   name: "Home",
  //   element: <Homepage />,
  //   isPrivate: false,
  //   isMenu: false,
  // },
];

export default navlinks;
