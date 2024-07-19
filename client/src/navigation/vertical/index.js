import {
  CreditCard,
  User,
  Users,
  Home,
  File,
  Folder,
  Map,
  Settings,
  FileText,
} from "react-feather";
import adminRoute from "./adminRoutes";
import { isAdmin } from "../../utility/helper";
import LocalStorageService from "../../services/localstorage.service";

const allUserRoutes = [
  // {
  //   id: "template-list",
  //   title: "Dashboard",
  //   icon: <Home size={20} />,
  //   navLink: "/home"
  // },
  {
    id: "bus-list",
    title: "Bus Records",
    icon: <File size={20} />,
    navLink: "/bus-list",
  },
  {
    id: "route-list",
    navLink: "/route-list",
    title: "Route Records",
    icon: <Map size={20} />,
  },
  {
    id: "route-configuration",
    navLink: "/route-configuration",
    title: "Route Configuration",
    icon: <Settings size={20} />,
  },
  {
    id: "audit-logs",
    navLink: "/logs",
    title: "Logs",
    icon: <FileText size={20} />,
  },
];
// if (isAdmin() || LocalStorageService.isAdminUser()) {
//   allUserRoutes.push({
//     id: "Stop-Details",
//     navLink: "/stop-details",
//     title: "Admin",
//     icon: <Folder size={20} />,
//   });
// }

export default isAdmin() || LocalStorageService.isAdminUser()
  ? [...allUserRoutes, ...adminRoute]
  : allUserRoutes;
