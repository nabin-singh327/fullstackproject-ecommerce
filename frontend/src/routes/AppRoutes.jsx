import React from "react";
import { Route, Routes } from "react-router";
import Home from "../pages/public/Home";
import Login from "../pages/auth/Login";
import SignUp from "../pages/auth/SignUp";
import NotFound from "../pages/public/NotFound";
import Navbar from "../components/Navbar";
import Menu from "../pages/public/Menu";
import MenuDetails from "../pages/public/MenuDetails";
import Payment from "../pages/payment/Payment";
import Cart from "../pages/cart/Cart";
import Success from "../pages/payment/Success";
import Dashboard from "../admin/Dashboard";
import OrderManagement from "../admin/OrderManagement";
import UserManagement from "../admin/UserManagement";
import FoodManagement from "../admin/FoodManagement";
import AddFood from "../admin/food/AddFood";
import EditFood from "../admin/food/EditFood";
import { useSelector } from "react-redux";

const AppRoutes = () => {

  const {user} = useSelector((state) => state.auth);
  
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/success" element={<Success />} />

        {user && user?.role === "admin" && (
        <Route path="/admin" element={<Dashboard />} >
          <Route index element={<UserManagement />} />
          <Route path="order-management" element={<OrderManagement />} />
          <Route path="user-management" element={<UserManagement />} />
          <Route path="food-management" element={<FoodManagement />} />
          <Route path="add-food" element={<AddFood />} />
          <Route path="edit-food/:id" element={<EditFood />} />
        </Route>)}
        
        <Route path="/menu/:id" element={<MenuDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRoutes;
