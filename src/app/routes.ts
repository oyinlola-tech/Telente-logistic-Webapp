import { createBrowserRouter } from "react-router";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Careers from "./pages/Careers";
import Contact from "./pages/Contact";
import Tracking from "./pages/Tracking";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import { ADMIN_LOGIN_PATH } from "./constants/security";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
  {
    path: "/about",
    Component: About,
  },
  {
    path: "/services",
    Component: Services,
  },
  {
    path: "/services/:id",
    Component: ServiceDetail,
  },
  {
    path: "/news",
    Component: News,
  },
  {
    path: "/news/:id",
    Component: NewsDetail,
  },
  {
    path: "/careers",
    Component: Careers,
  },
  {
    path: "/contact",
    Component: Contact,
  },
  {
    path: "/tracking",
    Component: Tracking,
  },
  {
    path: ADMIN_LOGIN_PATH,
    Component: AdminLogin,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
