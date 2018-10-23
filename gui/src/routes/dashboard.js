import React, { Component}  from 'react';
import Details from "../views/Details/Details";
import Proof from "../views/Proof/Proof";
import AddProof from "../views/AddProof/AddProof";
import RemoveProof from "../views/RemoveProof/RemoveProof";
import About from "../views/About/About";
import Manual from "../views/Manual/Manual";
import { Translate } from "react-localize-redux";

const dashboardRoutes = [
    {
        path: "/fileDetails",
        name: <Translate id="sidebar.fileDetails"/>,
        icon: "pe-7s-id",
        component: Details
    },
    {
        path: "/addNewFile",
        name: <Translate id="sidebar.addNewFile"/>,
        icon: "pe-7s-mail-open-file",
        component: Proof
    },
    {
        path: "/addOwner",
        name: <Translate id="sidebar.addOwner"/>,
        icon: "pe-7s-add-user",
        component: AddProof
    },
    {
        path: "/removeOwner",
        name: <Translate id="sidebar.removeOwner"/>,
        icon: "pe-7s-delete-user",
        component: RemoveProof
    },
    {
        upgrade: 1,
        path: "/manual",
        name: <Translate id="sidebar.manual"/>,
        icon: "pe-7s-notebook",
        component: Manual
    },
    {
        upgrade: true,
        path: "/about",
        name: <Translate id="sidebar.about"/>,
        icon: "pe-7s-info",
        component: About
    },
    {redirect: true, path: "/", to: "/about", name: "About"}
];

export default dashboardRoutes;
