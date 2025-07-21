import React, { useEffect, useState } from 'react';

const Autosave = ({ children, autosaveKey }) => {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem(autosaveKey);
    return savedData ? JSON.parse(savedData) : {};
  });

  useEffect(() => {
    const intervalId = setInterval(() => {
      localStorage.setItem(autosaveKey, JSON.stringify(data));
    }, 5000); // Autosave every 5 seconds

    return () => clearInterval(intervalId);
  }, [data, autosaveKey]);

  return React.cloneElement(children, { data, setData });
};

export default Autosave;