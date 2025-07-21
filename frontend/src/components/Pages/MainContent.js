import React, { useEffect, useState } from "react";
import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import LotCards from "./ViewLots";
import RetrieveData from "./RetrieveData";
import AddData from "./AddData";
import InventoryPage from "./Inventory";
import ReportPage from "./ReportPage";
import HomePage from "./HomePage";

const MainContent = ({ setCurrentPage }) => {
    const location = useLocation(); // ✅ Safe to use inside Router

    useEffect(() => {
        const pathToPage = {
            "/": "home",
            "/view-lots": "view-lots",
            "/retrieve-lots": "retrieve-lots",
            "/add-data": "add-data",
            "/inventory": "inventory",
            "/report": "report",
        };

        const currentPage = pathToPage[location.pathname] || "home";
        setCurrentPage(currentPage);

        // Update document title
        const pageTitles = {
            home: "Track Business - Home",
            "view-lots": "Lots",
            "retrieve-lots": "Lot Details",
            "add-data": "Add Data",
            inventory: "Inventory Overview",
            report: "Report Analytics",
        };

        document.title = pageTitles[currentPage] || "Track Business";
        localStorage.setItem("currentPage", currentPage);
    }, [location, setCurrentPage]);

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default MainContent;