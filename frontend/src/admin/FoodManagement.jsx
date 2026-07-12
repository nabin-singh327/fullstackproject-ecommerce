import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { getFoods, deleteFood } from "../services/food.services.js";

const FoodManagement = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["foods"],
    queryFn: getFoods,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteFood,
    onSuccess: () => {
      queryClient.invalidateQueries(["foods"]);
      setActionMessage({ type: 'success', text: 'Food item deleted successfully.' });
    },
    onError: (error) => {
      setActionMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete food item.' });
    },
  });

  // Styled Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-sm font-medium text-gray-500 mt-3">Fetching inventory...</p>
      </div>
    );
  }

  // Styled Error State
  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        <strong className="font-semibold">Error:</strong> {error?.message || "Failed to load food inventory."}
      </div>
    );
  }

  const foodsList = Array.isArray(data?.foods) ? data.foods : [];

  const formatPrice = (price) => {
    const value = Number(price);
    return Number.isFinite(value) ? value.toFixed(2) : '0.00';
  };

  const handleDelete = (foodId) => {
    const confirmed = window.confirm('Delete this item from the menu?');
    if (confirmed) {
      deleteMutation.mutate(foodId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Food Inventory</h2>
          <p className="text-sm text-gray-500">Manage items, images, descriptions, pricing, and availability.</p>
        </div>
        <button
          onClick={() => navigate('/admin/add-food')}
          className="inline-flex items-center justify-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-xl shadow-xs transition-colors duration-150"
        >
          + Add New Item
        </button>
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

      {foodsList.length > 0 ? (
        /* Responsive Table Container */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Item Name</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Category</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Price</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {foodsList.map((food) => (
                  <tr key={food._id || food.id} className="hover:bg-gray-50/70 transition-colors duration-100">
                    
                    {/* Combined Image + Name Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-4">
                        {food.image ? (
                          <img 
                            src={food.image} 
                            alt={food.name} 
                            className="h-12 w-12 rounded-xl object-cover bg-gray-100 border border-gray-100 shadow-inner shrink-0"
                            onError={(e) => {
                              // Fallback if image URL breaks
                              e.target.onerror = null; 
                              e.target.src = "https://placehold.co/100x100?text=No+Image";
                            }}
                          />
                        ) : (
                          // Placeholder Icon if no image exists
                          <div className="h-12 w-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 shrink-0">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                            </svg>
                          </div>
                        )}
                        <span className="font-semibold text-gray-900">{food.name}</span>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                      {food.description}
                    </td>

                    {/* Category Badge */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {food.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">
                      Rs. {formatPrice(food.price)}
                    </td>

                    {/* Action Buttons */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          onClick={() => navigate(`/admin/edit-food/${food._id}`)}
                          className="text-amber-600 hover:text-amber-900 transition-colors duration-150"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(food._id)}
                          disabled={deleteMutation.isLoading}
                          className="text-red-600 hover:text-red-900 transition-colors duration-150 disabled:text-red-300 disabled:cursor-not-allowed"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-300">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25 3v6.75m0 0l-3-3m3 3l3-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No menu items found</h3>
          <p className="text-sm text-gray-500 mt-1">Get started by creating a new food dish.</p>
        </div>
      )}
    </div>
  );
};

export default FoodManagement;