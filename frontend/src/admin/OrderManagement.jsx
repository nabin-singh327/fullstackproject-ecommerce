import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getOrders, updateOrder, deleteOrder } from "../services/order.service.js";

const OrderManagement = () => {
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  const updateMutation = useMutation({
    mutationFn: ({ orderId, paymentStatus }) => updateOrder(orderId, { paymentStatus }),
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      setActionMessage({ type: 'success', text: 'Order payment status updated successfully.' });
    },
    onError: (error) => {
      setActionMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update order.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries(["orders"]);
      setActionMessage({ type: 'success', text: 'Order deleted successfully.' });
    },
    onError: (error) => {
      setActionMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete order.' });
    },
  });

  // Styled Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-sm font-medium text-gray-500 mt-3">Fetching orders...</p>
      </div>
    );
  }

  // Styled Error State
  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        <strong className="font-semibold">Error:</strong> {error?.message || "Failed to load orders."}
      </div>
    );
  }

  // FIXED: Accessing data.data based on your API log
  const ordersList = data?.data || [];

  const getNextStatus = (current) => {
    if (current === "PENDING") return "COMPLETED";
    if (current === "COMPLETED") return "CANCELLED";
    return "COMPLETED";
  };

  const getActionLabel = (current) => {
    if (current === "PENDING") return "Mark Completed";
    if (current === "COMPLETED") return "Cancel Order";
    return "Set Completed";
  };

  const handleUpdateOrder = (order) => {
    const nextStatus = getNextStatus(order.paymentStatus);
    const confirmed = window.confirm(`Set payment status to ${nextStatus} for this order?`);
    if (confirmed) {
      updateMutation.mutate({ orderId: order._id, paymentStatus: nextStatus });
    }
  };

  const handleDeleteOrder = (orderId) => {
    const confirmed = window.confirm('Delete this order permanently?');
    if (confirmed) {
      deleteMutation.mutate(orderId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-500">Track incoming client checkouts, quantities, and payment streams.</p>
        </div>
      </div>

      {actionMessage.text && (
        <div className={`p-3 rounded-md border text-sm ${
          actionMessage.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {actionMessage.text}
        </div>
      )}

      {ordersList.length > 0 ? (
        /* Responsive Table Container */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Order ID</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Customer ID</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Total Items</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Date Placed</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Payment Status</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {ordersList.map((order) => {
                  // FIXED: Simplified parsing to use the plain string keys from your console log
                  const orderId = order._id || "N/A";
                  const userId = order.userID || "N/A";
                  
                  const totalItems = order.foods?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
                  
                  const formattedDate = order.createdAt 
                    ? new Date(order.createdAt).toLocaleString()
                    : "N/A";

                  return (
                    <tr key={orderId} className="hover:bg-gray-50/70 transition-colors duration-100">
                      
                      {/* Order ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                        #{orderId.substring(orderId.length - 8)}
                      </td>

                      {/* Customer ID ref */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                        {userId.substring(userId.length - 8)}
                      </td>

                      {/* Quantity Ordered */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {totalItems} {totalItems === 1 ? "item" : "items"}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formattedDate}
                      </td>

                      {/* Payment Status Badges */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          order.paymentStatus === "PAID" || order.paymentStatus === "COMPLETED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : order.paymentStatus === "PENDING"
                            ? "bg-amber-50 text-amber-700 border-amber-100"
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                          {order.paymentStatus || "UNKNOWN"}
                        </span>
                      </td>

                      {/* View/Update Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleUpdateOrder(order)}
                            disabled={updateMutation.isLoading}
                            className="text-emerald-600 hover:text-emerald-900 transition-colors duration-150 disabled:text-emerald-300 disabled:cursor-not-allowed"
                          >
                            {getActionLabel(order.paymentStatus)}
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(orderId)}
                            disabled={deleteMutation.isLoading}
                            className="text-red-600 hover:text-red-900 transition-colors duration-150 disabled:text-red-300 disabled:cursor-not-allowed"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No active orders</h3>
          <p className="text-sm text-gray-500 mt-1">New incoming store checkouts will automatically appear here.</p>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;