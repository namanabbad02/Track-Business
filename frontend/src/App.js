// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Sidebar from "./components/Pages/NavBar";
// import { ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import MainContent from "./components/Pages/MainContent";
// import HomePage from "./components/Pages/HomePage";
// import Header from "./components/Pages/Header";
// import SignUp from "./components/Pages/forms/SignUp";
// import Login from "./components/Pages/forms/Login";
// import ForgotPassword from "./components/Pages/forms/ForgotPassword";
// import AdminDashboard from "./components/Pages/AdminDashBoard";
// import UserDashboard from "./components/Pages/UserDashBoard";
// import SetPassword from "./components/Pages/forms/SetPassword";
// import ProfilePage from "./components/Pages/ProfilePage";
// import LotCards from "./components/Pages/ViewLots";
// import RetrieveData from "./components/Pages/RetrieveData";
// import AddData from "./components/Pages/AddData";
// import InventoryPage from "./components/Pages/Inventory";
// import ReportPage from "./components/Pages/ReportPage";


// function App() {
//     const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
//     const [darkMode, setDarkMode] = React.useState(false);
//     const [currentPage, setCurrentPage] = React.useState(() => {
//         return localStorage.getItem("currentPage") || "home";
//     });

//     React.useEffect(() => {
//         const storedSidebarState = localStorage.getItem("isSidebarOpen");
//         setIsSidebarOpen(storedSidebarState === "true");
//     }, []);

//     const handleToggleSidebar = () => {
//         setIsSidebarOpen((prevState) => {
//             const newState = !prevState;
//             localStorage.setItem("isSidebarOpen", newState);
//             return newState;
//         });
//     };

//     const toggleDarkMode = () => {
//         setDarkMode((prevMode) => !prevMode);
//         document.body.classList.toggle("dark-mode", !darkMode);
//     };

//     return (
//         <Router>
//             <div className="App">
//                 <ToastContainer
//                     position="top-right"
//                     autoClose={3000}
//                     hideProgressBar={false}
//                     newestOnTop={true}
//                     closeOnClick
//                     draggable
//                 />

//                 <Header />

//                 <Routes>
//                     {/* Authentication Routes */}
//                     <Route path="/signup" element={<SignUp />} />
//                     <Route path="/login" element={<Login />} />
//                     <Route path="/forgot-password" element={<ForgotPassword />} />
//                     <Route path="/set-password/:token" element={<SetPassword />} />

//                     {/* Protected Routes */}
//                     <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
//                     <Route path="/user-dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
//                     <Route path="/profile-page" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

//                     {/* Main Application Routes */}
//                     <Route path="/" element={<ProtectedRoute><MainContent setCurrentPage={setCurrentPage} /></ProtectedRoute>}>
//                         <Route index element={<HomePage />} />
//                         <Route path="view-lots" element={<LotCards />} />
//                         <Route path="retrieve-lots/:lotNumber" element={<RetrieveData />} />
//                         <Route path="add-data" element={<AddData />} />
//                         <Route path="inventory" element={<InventoryPage />} />
//                         <Route path="report" element={<ReportPage />} />
//                     </Route>
//                 </Routes>

//                 <Sidebar
//                     toggleSidebar={handleToggleSidebar}
//                     isSidebarOpen={isSidebarOpen}
//                 />

//                 <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
//                     <main className={`content ${isSidebarOpen ? "shifted" : ""}`}>
//                         {/* MainContent should be rendered inside the Routes */}
//                     </main>
//                 </div>
//             </div>
//         </Router>
//     );
// }

// const ProtectedRoute = ({ children }) => {
//     const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Replace with your authentication logic

//     return isAuthenticated ? children : <Navigate to="/login" />;
// };

// export default App;


// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Sidebar from "./components/Pages/NavBar";
// import { ToastContainer } from "react-toastify";
// import { Link } from 'react-router-dom';
// import "react-toastify/dist/ReactToastify.css";
// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import MainContent from "./components/Pages/MainContent";
// import HomePage from "./components/Pages/HomePage";
// import Header from "./components/Pages/Header";
// import SignUp from "./components/Pages/forms/SignUp";
// import Login from "./components/Pages/forms/Login";
// import ForgotPassword from "./components/Pages/forms/ForgotPassword";
// import AdminDashboard from "./components/Pages/AdminDashBoard";
// import UserDashboard from "./components/Pages/UserDashBoard";
// import SetPassword from "./components/Pages/forms/SetPassword";
// import ProfilePage from "./components/Pages/ProfilePage";
// import Unauthorized from "./components/Pages/Unauthorized";
// import ProtectedRoute from "./components/Pages/ProtectedRoute";
// import LotCards from "./components/Pages/ViewLots";
// import RetrieveData from "./components/Pages/RetrieveData";
// import AddData from "./components/Pages/AddData";
// import InventoryPage from "./components/Pages/Inventory";
// import ReportPage from "./components/Pages/ReportPage";

// function App() {
//   const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
//   const [darkMode, setDarkMode] = React.useState(false);
//   const [currentPage, setCurrentPage] = React.useState(() => {
//     return localStorage.getItem("currentPage") || "home";
//   });

//   React.useEffect(() => {
//     const storedSidebarState = localStorage.getItem("isSidebarOpen");
//     setIsSidebarOpen(storedSidebarState === "true");
//   }, []);

//   const handleToggleSidebar = () => {
//     setIsSidebarOpen((prevState) => {
//       const newState = !prevState;
//       localStorage.setItem("isSidebarOpen", newState);
//       return newState;
//     });
//   };

//   const toggleDarkMode = () => {
//     setDarkMode((prevMode) => !prevMode);
//     document.body.classList.toggle("dark-mode", !darkMode);
//   };

//   return (
//     <Router>
//       <div className="App">
//         <ToastContainer
//           position="top-right"
//           autoClose={3000}
//           hideProgressBar={false}
//           newestOnTop={true}
//           closeOnClick
//           draggable
//         />

//         <Header />

//         <Routes>
//           {/* Authentication Routes */}
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/forgot-password" element={<ForgotPassword />} />
//           <Route path="/set-password/:token" element={<SetPassword />} />

//           {/* Protected Routes */}
//           <Route path="/admin-dashboard" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/user-dashboard" element={
//             <ProtectedRoute allowedRoles={['user']}>
//               <UserDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/profile-page" element={
//             <ProtectedRoute allowedRoles={['admin', 'user']}>
//               <ProfilePage />
//             </ProtectedRoute>
//           } />

//           {/* Main Application Routes */}
//           <Route path="/" element={
//             <ProtectedRoute allowedRoles={['admin', 'user']}>
//               <MainContent setCurrentPage={setCurrentPage} />
//             </ProtectedRoute>
//           }>
//             <Route index element={<HomePage />} />
//             <Route path="view-lots" element={<LotCards />} />
//             <Route path="retrieve-lots/:lotNumber" element={<RetrieveData />} />
//             <Route path="add-data" element={<AddData />} />
//             <Route path="inventory" element={<InventoryPage />} />
//             <Route path="report" element={<ReportPage />} />
//           </Route>

//           {/* Unauthorized Route */}
//           <Route path="/unauthorized" element={<Unauthorized />} />
//         </Routes>

//         <Sidebar
//           toggleSidebar={handleToggleSidebar}
//           isSidebarOpen={isSidebarOpen}
//         />

//         <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
//           <main className={`content ${isSidebarOpen ? "shifted" : ""}`}>
//             {/* MainContent should be rendered inside the Routes */}
//           </main>
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from "./components/Pages/NavBar";
import { ToastContainer } from "react-toastify";
import { Link } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import MainContent from "./components/Pages/MainContent";
import HomePage from "./components/Pages/HomePage";
import Header from "./components/Pages/Header";
import SignUp from "./components/Pages/forms/SignUp";
import Login from "./components/Pages/forms/Login";
import ForgotPassword from "./components/Pages/forms/ForgotPassword";
import AdminDashboard from "./components/Pages/AdminDashBoard";
import UserDashboard from "./components/Pages/UserDashBoard";
import SetPassword from "./components/Pages/forms/SetPassword";
import ProfilePage from "./components/Pages/ProfilePage";
import Unauthorized from "./components/Pages/Unauthorized";
import PrivateRoute from "./components/Pages/PrivateRoute";
import LotCards from "./components/Pages/ViewLots";
import RetrieveData from "./components/Pages/RetrieveData";
import AddData from "./components/Pages/AddData";
import InventoryPage from "./components/Pages/Inventory";
import ReportPage from "./components/Pages/ReportPage";
import ProtectedRoute from "./components/Pages/ProtectedRoute";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [darkMode, setDarkMode] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(() => {
    return localStorage.getItem("currentPage") || "home";
  });

  React.useEffect(() => {
    const storedSidebarState = localStorage.getItem("isSidebarOpen");
    setIsSidebarOpen(storedSidebarState === "true");
  }, []);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prevState) => {
      const newState = !prevState;
      localStorage.setItem("isSidebarOpen", newState);
      return newState;
    });
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        draggable
      />

      <Header />

      <Routes>
        {/* Authentication Routes */}
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/set-password/:token" element={<SetPassword />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user-dashboard" element={
            <ProtectedRoute allowedRoles={['user']}>
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile-page" element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <ProfilePage />
            </ProtectedRoute>
          } />
          <Route path="/" element={
            <ProtectedRoute allowedRoles={['admin', 'user']}>
              <MainContent setCurrentPage={setCurrentPage} />
            </ProtectedRoute>
          }>
            <Route index element={<HomePage />} />
            <Route path="view-lots" element={<LotCards />} />
            <Route path="retrieve-lots/:lotNumber" element={<RetrieveData />} />
            <Route path="add-data" element={<AddData />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="report" element={<ReportPage />} />
          </Route>
        </Route>

        {/* Unauthorized Route */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>

      <Sidebar
        toggleSidebar={handleToggleSidebar}
        isSidebarOpen={isSidebarOpen}
      />

      <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <main className={`content ${isSidebarOpen ? "shifted" : ""}`}>
          {/* MainContent should be rendered inside the Routes */}
          <Routes>
            <Route element={<ProtectedRoute allowedRoles={['admin', 'user']}>
              <MainContent setCurrentPage={setCurrentPage} />
            </ProtectedRoute>}>
              <Route path="/" element={<HomePage />} />
              <Route path="view-lots" element={<LotCards />} />
              <Route path="retrieve-lots/:lotNumber" element={<RetrieveData />} />
              <Route path="add-data" element={<AddData />} />
              <Route path="inventory" element={<InventoryPage />} />
              <Route path="report" element={<ReportPage />} />
              <Route path="profile-page" element={<ProfilePage />} />
              <Route path="admin-dashboard" element={<AdminDashboard />} />
              <Route path="user-dashboard" element={<UserDashboard />} />
            </Route>
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;


//-------------------------------------------------------------------------------------------------------

// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import Sidebar from "./components/Pages/NavBar";
// import { ToastContainer } from "react-toastify";
// import { Link } from 'react-router-dom';
// import "react-toastify/dist/ReactToastify.css";
// import "./App.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import MainContent from "./components/Pages/MainContent";
// import HomePage from "./components/Pages/HomePage";
// import Header from "./components/Pages/Header";
// import SignUp from "./components/Pages/forms/SignUp";
// import Login from "./components/Pages/forms/Login";
// import ForgotPassword from "./components/Pages/forms/ForgotPassword";
// import AdminDashboard from "./components/Pages/AdminDashBoard";
// import UserDashboard from "./components/Pages/UserDashBoard";
// import SetPassword from "./components/Pages/forms/SetPassword";
// import ProfilePage from "./components/Pages/ProfilePage";
// import Unauthorized from "./components/Pages/Unauthorized";
// import ProtectedRoute from "./components/Pages/ProtectedRoute";
// import LotCards from "./components/Pages/ViewLots";
// import RetrieveData from "./components/Pages/RetrieveData";
// import AddData from "./components/Pages/AddData";
// import InventoryPage from "./components/Pages/Inventory";
// import ReportPage from "./components/Pages/ReportPage";
// import PrivateRoute from "./components/Pages/PrivateRoute";

// function App() {
//   const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
//   const [darkMode, setDarkMode] = React.useState(false);
//   const [currentPage, setCurrentPage] = React.useState(() => {
//     return localStorage.getItem("currentPage") || "home";
//   });

//   React.useEffect(() => {
//     const storedSidebarState = localStorage.getItem("isSidebarOpen");
//     setIsSidebarOpen(storedSidebarState === "true");
//   }, []);

//   const handleToggleSidebar = () => {
//     setIsSidebarOpen((prevState) => {
//       const newState = !prevState;
//       localStorage.setItem("isSidebarOpen", newState);
//       return newState;
//     });
//   };

//   const toggleDarkMode = () => {
//     setDarkMode((prevMode) => !prevMode);
//     document.body.classList.toggle("dark-mode", !darkMode);
//   };

//   return (
//     <div className="App">
//       <ToastContainer
//         position="top-right"
//         autoClose={3000}
//         hideProgressBar={false}
//         newestOnTop={true}
//         closeOnClick
//         draggable
//       />

//       <Header />

//       <Routes>
//         {/* Authentication Routes */}
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/set-password/:token" element={<SetPassword />} />

//         {/* Protected Routes */}
//         <Route element={<PrivateRoute />}>
//           <Route path="/admin-dashboard" element={
//             <ProtectedRoute allowedRoles={['admin']}>
//               <AdminDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/user-dashboard" element={
//             <ProtectedRoute allowedRoles={['user']}>
//               <UserDashboard />
//             </ProtectedRoute>
//           } />
//           <Route path="/profile-page" element={
//             <ProtectedRoute allowedRoles={['admin', 'user']}>
//               <ProfilePage />
//             </ProtectedRoute>
//           } />
//           <Route path="/" element={
//             <ProtectedRoute allowedRoles={['admin', 'user']}>
//               <MainContent setCurrentPage={setCurrentPage} />
//             </ProtectedRoute>
//           }>
//             <Route index element={<HomePage />} />
//             <Route path="view-lots" element={<LotCards />} />
//             <Route path="retrieve-lots/:lotNumber" element={<RetrieveData />} />
//             <Route path="add-data" element={<AddData />} />
//             <Route path="inventory" element={<InventoryPage />} />
//             <Route path="report" element={<ReportPage />} />
//           </Route>
//         </Route>

//         {/* Unauthorized Route */}
//         <Route path="/unauthorized" element={<Unauthorized />} />
//       </Routes>
      
          
//       <Sidebar
//         toggleSidebar={handleToggleSidebar}
//         isSidebarOpen={isSidebarOpen}
//       />

//       <div className={`content-wrapper ${isSidebarOpen ? "sidebar-open" : ""}`}>
//         <main className={`content ${isSidebarOpen ? "shifted" : ""}`}>
//           {/* MainContent should be rendered inside the Routes */}
//           <Routes>
//             {/* Wrap all protected routes inside ProtectedRoute */}
//             <Route element={<ProtectedRoute><MainContent setCurrentPage={setCurrentPage} /></ProtectedRoute>}>
//               <Route path="/" element={<HomePage />} />
//               <Route path="view-lots" element={<LotCards />} />
//               <Route path="retrieve-lots/:lotNumber" element={<RetrieveData />} />
//               <Route path="add-data" element={<AddData />} />
//               <Route path="inventory" element={<InventoryPage />} />
//               <Route path="report" element={<ReportPage />} />
//               <Route path="profile-page" element={<ProfilePage />} />
//               <Route path="admin-dashboard" element={<AdminDashboard />} />
//               <Route path="user-dashboard" element={<UserDashboard />} />
//             </Route>
//           </Routes>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default App;

//-------------------------------------------------------------------------------------------------------














// // frontend/src/App.js
// import React, { useState, useEffect, createContext, useContext } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import Sidebar from './components/Pages/NavBar';
// import LotCards from './components/Pages/ViewLots';
// import RetrieveData from './components/Pages/RetrieveData';
// import AddData from './components/Pages/AddData';
// import InventoryPage from './components/Pages/Inventory';
// import ReportPage from './components/Pages/ReportPage';
// import HomePage from './components/Pages/HomePage';
// import SignUp from './components/Pages/forms/SignUp';
// import Login from './components/Pages/forms/Login';
// import AdminDashboard from './components/Pages/AdminDashBoard';
// import UserDashboard from './components/Pages/UserDashBoard';
// import ForgotPassword from './components/Pages/forms/ForgotPassword';
// import SetPassword from './components/Pages/forms/SetPassword';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './App.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

// // Authentication Context
// export const AuthContext = createContext(null);

// const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check for the token in localStorage on component mount
//     const token = localStorage.getItem('token');
//     if (token) {
//       setUser({ token });
//     }
//   }, []);

//   const login = (userData) => {
//     setUser(userData);
//     localStorage.setItem('token', userData.token);
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem('token');
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Protected Route Component
// // Protected Route Component
// const ProtectedRoute = ({ element: Component, redirectTo = '/' }) => {
//   const { user } = useContext(AuthContext);

//   // Check if the user is authenticated by checking for the token in localStorage
//   const isAuthenticated = !!localStorage.getItem('token');

//   return isAuthenticated ? <Component /> : <Navigate to={redirectTo} />;
// };

// function App() {
//   const [currentPage, setCurrentPage] = useState(() => {
//     return localStorage.getItem('currentPage') || 'home';
//   });
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [darkMode, setDarkMode] = useState(false);
//   const [selectedLotNumber, setSelectedLotNumber] = useState(null);

//   useEffect(() => {
//     const storedSidebarState = localStorage.getItem('isSidebarOpen');
//     setIsSidebarOpen(storedSidebarState === 'true');
//   }, []);

//   useEffect(() => {
//     const pageTitles = {
//       home: 'Track Business - home',
//       'View Lots': 'Lots',
//       'Retrieve Lots': 'Lot Details',
//       'add-data': 'Add Data',
//       inventory: 'Inventory Overview',
//       report: 'Report Analytics',
//     };
//     document.title = pageTitles[currentPage] || 'Track Business';
//     localStorage.setItem('currentPage', currentPage);
//   }, [currentPage]);

//   const handleNavigate = (page, lotNumber = null) => {
//     setCurrentPage(page);
//     if (lotNumber) {
//       setSelectedLotNumber(lotNumber);
//     }
//   };

//   const handleToggleSidebar = () => {
//     setIsSidebarOpen((prevState) => {
//       const newState = !prevState;
//       localStorage.setItem('isSidebarOpen', newState);
//       return newState;
//     });
//   };

//   const toggleDarkMode = () => {
//     setDarkMode((prevMode) => !prevMode);
//     document.body.classList.toggle('dark-mode', !darkMode);
//   };

//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App">
//           <ToastContainer
//             position="top-right"
//             autoClose={3000}
//             hideProgressBar={false}
//             newestOnTop={true}
//             closeOnClick
//             draggable
//           />

//           <header className="header-outer">
//             <div className="responsive-wrapper header-inner">
//               <h1 className="app-title" onClick={() => handleNavigate('home')}>
//                 Track Business
//               </h1>
//             </div>
//           </header>

//           <Sidebar
//             onNavigate={handleNavigate}
//             toggleSidebar={handleToggleSidebar}
//             isSidebarOpen={isSidebarOpen}
//             activePage={currentPage}
//           />

//           <div className={`content-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>
//             <main className={`content ${isSidebarOpen ? 'shifted' : ''}`}>
//               <Routes>
//                 <Route path="/" element={<Navigate to="/login" />} />
//                 <Route path="/signup" element={<SignUp />} />
//                 <Route path="/login" element={<Login />} />
//                 <Route path="/forgot-password" element={<ForgotPassword />} />
//                 <Route path="/set-password/:token" element={<SetPassword />} />
//                 <Route
//                   path="/admin-dashboard"
//                   element={
//                     <ProtectedRoute
//                       element={AdminDashboard}
//                       redirectTo="/login"
//                     />
//                   }
//                 />
//                 <Route
//                   path="/user-dashboard"
//                   element={
//                     <ProtectedRoute
//                       element={UserDashboard}
//                       redirectTo="/login"
//                     />
//                   }
//                 />
//                 <Route
//                   path="/home"
//                   element={
//                     <ProtectedRoute
//                       element={HomePage}
//                       redirectTo="/login"
//                     />
//                   }
//                 />
//                 <Route
//                   path="/view-lots"
//                   element={
//                     <ProtectedRoute
//                       element={LotCards}
//                       redirectTo="/login"
//                     />
//                   }
//                 />
//                 <Route
//                   path="/retrieve-lots"
//                   element={
//                     <ProtectedRoute
//                       element={RetrieveData}
//                       redirectTo="/login"
//                     />
//                   }
//                 />
//                 <Route
//                   path="/add-data"
//                   element={
//                     <ProtectedRoute
//                       element={AddData}
//                       redirectTo="/login"
//                     />
//                   }
//                 />
//                 <Route
//                   path="/inventory"
//                   element={
//                     <ProtectedRoute
//                       element={InventoryPage}
//                       redirectTo="/login"
//                     />
//                   }
//                 />
//                 <Route
//                   path="/report"
//                   element={
//                     <ProtectedRoute
//                       element={ReportPage}
//                       redirectTo="/login"
//                     />
//                   }
//                 />
//               </Routes>
//             </main>
//           </div>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;

//-------------------------------------------------------------------------------------------------------
