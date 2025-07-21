import React, { useState, useEffect } from 'react';
import './DarkMode.css'; // Create a matching CSS file for styling

const DarkModeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <div className="dark-mode-toggle">
      <span>{darkMode ? '🌙' : '☀️'}</span>
      <label className="switch">
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
        <span className="slider round"></span>
      </label>
    </div>
  );
};

export default DarkModeToggle;
