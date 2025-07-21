import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate(); // ✅ Now inside a Router context

    return (
        <header className="header-outer">
            <div className="responsive-wrapper header-inner">
                <h1 className="app-title" onClick={() => navigate("/")}>Track Business</h1>
            </div>
        </header>
    );
};

export default Header;
