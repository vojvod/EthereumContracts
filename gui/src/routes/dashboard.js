// import Dashboard from "../views/Dashboard/Dashboard";
// import UserProfile from "../views/UserProfile/UserProfile";
// import TableList from "../views/TableList/TableList";
// import Typography from "../views/Typography/Typography";
// import Icons from "../views/Icons/Icons";
// import Maps from "../views/Maps/Maps";
// import Notifications from "../views/Notifications/Notifications";
// import Upgrade from "../views/Upgrade/Upgrade";

import Details from "../views/Details/Details";
import Proof from "../views/Proof/Proof";
import AddProof from "../views/AddProof/AddProof";
import RemoveProof from "../views/RemoveProof/RemoveProof";
import About from "../views/About/About";

const dashboardRoutes = [
    {
        path: "/fileDetails",
        name: "File Details",
        icon: "pe-7s-id",
        component: Details
    },
    {
        path: "/addNewFile",
        name: "Add New File",
        icon: "pe-7s-mail-open-file",
        component: Proof
    },
    {
        path: "/addOwner",
        name: "Add Owner",
        icon: "pe-7s-add-user",
        component: AddProof
    },
    {
        path: "/removeowner",
        name: "Remove Owner",
        icon: "pe-7s-delete-user",
        component: RemoveProof
    },
    {
        upgrade: true,
        path: "/about",
        name: "About",
        icon: "pe-7s-info",
        component: About
    },
    // {
    //     path: "/dashboard",
    //     name: "Dashboard",
    //     icon: "pe-7s-graph",
    //     component: Dashboard
    // },
    // {
    //     path: "/user",
    //     name: "User Profile",
    //     icon: "pe-7s-user",
    //     component: UserProfile
    // },
    // {
    //     path: "/table",
    //     name: "Table List",
    //     icon: "pe-7s-note2",
    //     component: TableList
    // },
    // {
    //     path: "/typography",
    //     name: "Typography",
    //     icon: "pe-7s-news-paper",
    //     component: Typography
    // },
    // {
    //     path: "/icons",
    //     name: "Icons",
    //     icon: "pe-7s-science",
    //     component: Icons
    // },
    // {
    //     path: "/maps",
    //     name: "Maps",
    //     icon: "pe-7s-map-marker",
    //     component: Maps
    // },
    // {
    //     path: "/notifications",
    //     name: "Notifications",
    //     icon: "pe-7s-bell",
    //     component: Notifications
    // },
    // {
    //     upgrade: true,
    //     path: "/upgrade",
    //     name: "Upgrade to PRO",
    //     icon: "pe-7s-rocket",
    //     component: Upgrade
    // },
    {redirect: true, path: "/", to: "/about", name: "About"}
];

export default dashboardRoutes;
