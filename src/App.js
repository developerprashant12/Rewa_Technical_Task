import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./Components/LoginPage/Login";
import TaskList from "./Components/TaskPages/TaskList";
import SignUp from "./Components/LoginPage/SignUp";

function App() {
  const [isAuthenticate, setIsAuthenticate] = useState(false);

  useEffect(() => {
    // Check if user is logged in when component mounts
    const userData = localStorage.getItem("userData");
    if (userData) {
      setIsAuthenticate(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticate(true);
  };

  const handleLogout = () => {
    setIsAuthenticate(false);
    localStorage.removeItem("userData");
  };

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<SignUp/>} />
          <Route
            path="/"
            element={
              isAuthenticate ? (
                <Navigate to="/tasklist" />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/tasklist"
            element={
              isAuthenticate ? (
                <TaskList onLogout={handleLogout} />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
