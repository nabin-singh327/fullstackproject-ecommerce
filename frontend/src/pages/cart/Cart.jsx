import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from '../../redux/features/cartSlice';
import { createOrder } from '../../services/order.service.js';
import { useNavigate } from 'react-router';

const Cart = () => {
  const cart = useSelector((state) => state.cart.items) ||
    JSON.parse(localStorage.getItem("cart")) || [];

    const dispatch = useDispatch();

    const navigate = useNavigate();
  // Fix: Safe side-effect execution via useEffect
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Dynamic Summary Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 0 ? 150 : 0; // Flat shipping example
  const total = subtotal + shipping;

  const handlePayment = async () => {
    try {
      const payload = {
        foods: cart.map((item) => ({
          foodID: item._id,
          quantity: item.quantity,
        })),
        paymentStatus: "PENDING",
      };

      const response = await createOrder(payload);
      console.log("Order created", response);
      alert(response?.message || "Order created successfully");
      if (response?.success) {
        navigate("/payment", {state: {totalAmount: total, orderId: response?.order?._id}});
      }
    } catch (error) {
      console.error("Order creation failed", error);
      alert(error?.response?.data?.message || "Failed to create order");
    }
  };
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Shopping Cart</h2>

      {cart.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Cart Items list */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-all duration-200"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-lg bg-gray-50 shrink-0 border border-gray-100"
                  />
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-base font-medium text-emerald-600">Rs. {item.price}</p>
                  </div>
                </div>

                {/* Controls & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-3 sm:pt-0">
                  {/* Quantity Toggles */}
                  <div className="flex items-center border border-gray-200 rounded-lg p-1 bg-gray-50">
                    <button onClick={() => {
                    if (item.quantity <= 1) {
                    dispatch(removeItem(item._id));
                     } else {
                     dispatch(updateQuantity({ _id: item._id, quantity: item.quantity - 1 }));
                         }
                    }} className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm font-bold">
                      −
                    </button>
                    <span className="w-10 text-center text-sm font-semibold text-gray-800">
                      {item.quantity}
                    </span>
                    <button onClick={() => dispatch(updateQuantity({ _id: item._id, quantity: item.quantity + 1 }))} className="w-8 h-8 flex items-center justify-center rounded-md bg-white text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors shadow-sm font-bold">
                      +
                    </button>
                  </div>

                  {/* Remove CTA */}
                  <button onClick={() => dispatch(removeItem(item._id))} className="text-sm font-semibold text-red-500 hover:text-red-700 transition-colors px-3 py-2 rounded-lg hover:bg-red-50">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Order Summary (Sticky on Desktop) */}
          <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 lg:sticky lg:top-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
            
            <div className="space-y-4 text-sm font-medium text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-gray-900 font-semibold">Rs. {subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-gray-900 font-semibold">
                  {shipping === 0 ? 'Free' : `Rs. ${shipping}`}
                </span>
              </div>
              
              <hr className="border-gray-200 my-4" />
              
              <div className="flex justify-between text-base font-bold text-gray-900">
                <span>Total</span>
                <span className="text-xl text-gray-900">Rs. {total}</span>
              </div>
            </div>

            <button onClick={handlePayment} className="w-full mt-6 bg-gray-900 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-800 active:scale-[0.99] transition-all shadow-sm">
              Proceed to Checkout
            </button>
          </div>

        </div>
      ) : (
        /* Enhanced Empty State Layout */
        <div className="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200 max-w-xl mx-auto px-4">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-2xl mb-4">
            🛒
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">Your cart is empty</h3>
          <p className="text-gray-500 text-sm text-center mb-6 max-w-sm">
            Looks like you haven't added anything to your cart yet. Explore our top categories to find something you love!
          </p>
          <button onClick={() => (window.location.href = '/menu')} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors shadow-sm">
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;