import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './Sidebar2.css';
import { FaHome, FaPlus, FaBars, FaTimes, FaWarehouse,  FaEye, FaSignInAlt, FaUser, FaPlayCircle, FaCompactDisc } from 'react-icons/fa'; // Added FaWarehouse for Inventory

function Sidebar({ onNavigate, onOpenLogin}) {
    const [isOpen, setIsOpen] = useState(false);
    const [userInfo, setUserInfo] = useState({ fullName: "", companyName: "" });

    useEffect(() => {
    const fetchUserInfo = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/profile/profile", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            const profileData = response.data.profile;
            const userRole = profileData.role;
            
            setUserInfo({
                fullName: userRole === "admin" ? profileData.fullName : `${profileData.firstName} ${profileData.lastName}`.trim(),
                companyName: profileData.companyName || "No Company", // Fetch both separately
                role: profileData.role, // Store role in case you need it for UI logic
            });

        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };

    fetchUserInfo();
}, []);


    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = (page) => {
        onNavigate(page);
        setIsOpen(false);  // Close the sidebar after navigation
    };

    const handleLogin = () => {
        onOpenLogin(); // Call the function to open the login modal
        setIsOpen(false); // Close the sidebar
    };

    return (
        // <div className="sidebar-wrapper">
        //     <buttonn
        //         className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
        //         onClick={toggleSidebar}>
        //         {isOpen ? <FaTimes /> : <FaBars />}
        //     </buttonn>

        //     <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
        //         <nav className="sidebar">
        //         <div className="company-info">
        //     <img
        //     //   src={userInfo?.companyName || "/default-logo.png"}
        //       alt="Company Logo"
        //       className="company-logo"
        //     />
        //     <h3 className="company-name">{userInfo?.companyName || "Company"}</h3>
        //   </div>
        //             <ul>
        //             <li>
        //                     <Link to="/" onClick={() => setIsOpen(false)}>
        //                         <FaHome /> Home
        //                     </Link>
        //                 </li>
        //                 <li>
        //                     <Link to="/view-lots" onClick={() => setIsOpen(false)}>
        //                         <FaEye /> View Lots
        //                     </Link>
        //                 </li>
        //                 <li>
        //                     <Link to="/add-data" onClick={() => setIsOpen(false)}>
        //                         <FaPlus /> Add Data
        //                     </Link>
        //                 </li>
        //                 <li>
        //                     <Link to="/inventory" onClick={() => setIsOpen(false)}>
        //                         <FaWarehouse /> Inventory
        //                     </Link>
        //                 </li>
        //                 <li>
        //                     <Link to="/report" onClick={() => setIsOpen(false)}>
        //                         <FaWarehouse /> Report 
        //                     </Link>
        //                 </li>
        //                 <li>
        //                     <Link to = "/admin-dashboard" onClick={() => setIsOpen(false)}>
        //                         <FaUser /> User Management
        //                     </Link>
        //                 </li>
        //                 <li>
        //                     <Link to="/profile-page" onClick={() => setIsOpen(false)}>
        //                     <FaUser /> {userInfo.fullName || "Profile"}
        //                     </Link>
        //                 </li>
        //             </ul>
        //         </nav>
        //     </div>

        //     {/* Overlay for mobile */}
        //     {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        // </div>
        <div className="sidebar-wrapper">
            {/* <button
                className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
                onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button> */}
            <buttonn
                className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
                onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </buttonn>

            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar">
                    <div className="company-info">
                        <img
                            src='/Embellish.png'
                            alt="Company Logo"
                            className="company-logo"
                        />
                        <h3 className="company-name">{userInfo?.companyName || "Company"}</h3>
                    </div>
                    <ul className="sidebar-links">
                        <li>
                            <Link to="/" onClick={() => setIsOpen(false)}>
                                <FaHome /> Home
                            </Link>
                        </li>
                        <li>
                            <Link to="/view-lots" onClick={() => setIsOpen(false)}>
                                <FaEye /> View Lots
                            </Link>
                        </li>
                        <li>
                            <Link to="/add-data" onClick={() => setIsOpen(false)}>
                                <FaPlus /> Add Data
                            </Link>
                        </li>
                        <li>
                            <Link to="/inventory" onClick={() => setIsOpen(false)}>
                                <FaWarehouse /> Inventory
                            </Link>
                        </li>
                        <li>
                            <Link to="/report" onClick={() => setIsOpen(false)}>
                                <FaWarehouse /> Report
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin-dashboard" onClick={() => setIsOpen(false)}>
                                <FaUser /> User Management
                            </Link>
                        </li>
                    </ul>
                    <div className="sidebar-bottom">
                        <li>
                            <Link to="/profile-page" onClick={() => setIsOpen(false)}>
                                <FaUser /> {userInfo.fullName || "Profile"}
                            </Link>
                        </li>
                    </div>
                </nav>
            </div>

            {/* Overlay for mobile */}
            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </div>
    );
}

export default Sidebar;
