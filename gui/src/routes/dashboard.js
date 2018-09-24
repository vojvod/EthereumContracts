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
    {redirect: true, path: "/", to: "/about", name: "About"}
];

export default dashboardRoutes;
