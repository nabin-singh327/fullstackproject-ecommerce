import React, { useEffect } from "react";
import { NavLink } from "react-router"; // or "react-router-dom" depending on your version
import useAuth from "../hooks/useAuth";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { logout, fetchUser } = useAuth();

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const linkStyles = ({ isActive }) =>
    `px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
      isActive
        ? "bg-indigo-600 text-white"
        : "text-gray-700 hover:bg-gray-100 hover:text-indigo-600"
    }`;

  const handleLogout = async () => {
    await logout();
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser();
    }
  }, [fetchUser]);

  return (
    <nav className="flex sticky top-0 items-center justify-between px-6 py-4 bg-gray-300 shadow-md">
      {/* Logo / Brand */}
      <div className="text-xl font-bold text-indigo-600">
        <NavLink to="/">MyApp</NavLink>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-4">
        <NavLink to="/" className={linkStyles}>
          Home
        </NavLink>

        <NavLink to="/menu" className={linkStyles}>
          Menu
        </NavLink>

        <NavLink to="/cart" className={linkStyles}>
          Cart
        </NavLink>

        {user && user?.role === "admin" && (
          <NavLink to="/admin" className={linkStyles}>
            Admin Dashboard
          </NavLink>
        )}

        {user && isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="ml-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-md transition-colors duration-200 shadow-sm"
          >
            Logout
          </button>
        ) : (
          <>
            <NavLink to="/login" className={linkStyles}>
              Login
            </NavLink>
            <NavLink to="/sign-up" className={linkStyles}>
              SignUp
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
