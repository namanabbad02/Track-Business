import React, { useState, useContext } from 'react';
import './NavBar.css';
import { FaHome, FaPlus, FaBars, FaTimes, FaWarehouse, FaSignInAlt, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';

function Sidebar({ onNavigate }) {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout, loading } = useContext(AuthContext);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleNavigation = (page) => {
        onNavigate(page);
        setIsOpen(false); // Close sidebar on navigation
    };

    if (loading) {
        return <div className="loading">Loading...</div>; // Show a loading state
    }

    return (
        <div className="sidebar-wrapper">
            <button
                className={`sidebar-toggle ${isOpen ? 'open' : ''}`}
                onClick={toggleSidebar}>
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <div className={`sidebar-container ${isOpen ? 'open' : ''}`}>
                <nav className="sidebar">
                    <ul>
                        {user ? (
                            <>
                                <li className="company-name">
                                    {user.companyName || 'My Company'}
                                </li>
                                <li onClick={() => handleNavigation('home')}>
                                    <FaHome /> Home
                                </li>
                                <li onClick={() => handleNavigation('add-data')}>
                                    <FaPlus /> Add Data
                                </li>
                                <li onClick={() => handleNavigation('inventory')}>
                                    <FaWarehouse /> Inventory
                                </li>
                                <li onClick={() => handleNavigation('report')}>
                                    <FaWarehouse /> Report
                                </li>
                                <li onClick={() => logout()}>
                                    <FaSignOutAlt /> Log Out
                                </li>
                            </>
                        ) : (
                            <>
                                <li onClick={() => handleNavigation('login')}>
                                    <FaSignInAlt /> Login
                                </li>
                                <li onClick={() => handleNavigation('signup')}>
                                    <FaPlus /> Sign Up
                                </li>
                            </>
                        )}
                    </ul>
                </nav>
            </div>

            {isOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </div>
    );
}

export default Sidebar;

// import React, { useState } from 'react';
// import './NavBar.css';
// import { FaHome, FaPlus, FaWarehouse, FaBars, FaTimes } from 'react-icons/fa';

// function NavBar({ onNavigate }) {
//     const [isOpen, setIsOpen] = useState(false);

//     const toggleNavBar = () => {
//         setIsOpen(!isOpen);
//     };

//     const handleNavigation = (page) => {
//         onNavigate(page);
//         setIsOpen(false); // Close the menu after navigation in mobile view
//     };

//     return (
//         <header className="navbar-wrapper">
//             <div className="navbar">
//                 <div className="navbar-brand">
//                     <button
//                         className="navbar-toggle"
//                         onClick={toggleNavBar}
//                     >
//                         {isOpen ? <FaTimes /> : <FaBars />}
//                     </button>
//                     <h1>ST Management</h1>
//                 </div>
//                 <nav className={`nav-links ${isOpen ? 'open' : ''}`}>
//                     <ul>
//                         <li onClick={() => handleNavigation('home')}>
//                             <FaHome /> Home
//                         </li>
//                         <li onClick={() => handleNavigation('add-data')}>
//                             <FaPlus /> Add Data
//                         </li>
//                         <li onClick={() => handleNavigation('inventory')}>
//                             <FaWarehouse /> Inventory
//                         </li>
//                         <li onClick={() => handleNavigation('report')}>
//                             <FaWarehouse /> Report
//                         </li>
//                     </ul>
//                 </nav>
//             </div>
//             {isOpen && <div className="overlay" onClick={toggleNavBar}></div>}
//         </header>
//     );
// }

// export default NavBar;
