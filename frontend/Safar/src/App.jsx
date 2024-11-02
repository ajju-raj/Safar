import { BrowserRouter as Router, Route, Routes, Navigate, Outlet } from "react-router-dom";
import React from "react";

import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";

const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<PublicRoute />}>
            <Route index element={<Login />} />
          </Route>
          <Route path="/signUp" element={<PublicRoute />}>
            <Route index element={<SignUp />} />
          </Route>

          {/* Private routes */}
          <Route path="/dashboard" element={<PrivateRoute />}>
            <Route index element={<Home />} />
          </Route>

          {/* Root route */}
          <Route path="/" element={<Root />} />
        </Routes>
      </Router>
    </div>
  );
};

// Private route wrapper
const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

// Public route wrapper
const PublicRoute = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" />;
};

// Root component for initial redirection
const Root = () => {
  const isAuthenticated = !!localStorage.getItem("token");
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
};

export default App;
