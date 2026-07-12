import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUsers, updateUser, deleteUser } from "../services/auth.services.js";

const UserManagement = () => {
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUser(userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setActionMessage({ type: 'success', text: 'User role updated successfully.' });
    },
    onError: (error) => {
      setActionMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update user.' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      setActionMessage({ type: 'success', text: 'User deleted successfully.' });
    },
    onError: (error) => {
      setActionMessage({ type: 'error', text: error.response?.data?.message || 'Failed to delete user.' });
    },
  });

  // Styled Loading State
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
        <p className="text-sm font-medium text-gray-500 mt-3">Fetching accounts...</p>
      </div>
    );
  }

  // Styled Error State
  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
        <strong className="font-semibold">Error:</strong> {error?.message || "Failed to load user directories."}
      </div>
    );
  }

  // Handles both wrapped response formats defensively
  const usersList = data?.data || data?.users || [];

  const handleToggleRole = (user) => {
    if (!user?._id) return;
    const nextRole = user.role === "admin" ? "user" : "admin";
    const confirmed = window.confirm(`Change role of ${user.fullname || user.email} to ${nextRole}?`);
    if (confirmed) {
      updateMutation.mutate({ userId: user._id, role: nextRole });
    }
  };

  const handleDeleteUser = (userId) => {
    const confirmed = window.confirm('Delete this user permanently?');
    if (confirmed) {
      deleteMutation.mutate(userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">View and manage registered client accounts, permissions, and roles.</p>
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

      {usersList.length > 0 ? (
        /* Responsive Table Container */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">User ID</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Full Name</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Email Address</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Role</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Joined Date</th>
                  <th scope="col" className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {usersList.map((user) => {
                  const userId = user._id || "N/A";
                  const formattedDate = user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A";

                  return (
                    <tr key={userId} className="hover:bg-gray-50/70 transition-colors duration-100">
                      
                      {/* Shortened User ID */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-400">
                        #{userId.substring(userId.length - 8)}
                      </td>

                      {/* Full Name */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {user.fullname || "N/A"}
                      </td>

                      {/* Email Address */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {user.email || "N/A"}
                      </td>

                      {/* Dynamic Role Badges */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          user.role === "admin"
                            ? "bg-purple-50 text-purple-700 border-purple-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-100"
                        }`}>
                          {user.role || "user"}
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formattedDate}
                      </td>

                      {/* Context Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => handleToggleRole(user)}
                            disabled={updateMutation.isLoading}
                            className="text-amber-600 hover:text-amber-900 transition-colors duration-150 disabled:text-amber-300 disabled:cursor-not-allowed"
                          >
                            {user.role === "admin" ? "Demote" : "Make Admin"}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(userId)}
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
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
          </svg>
          <h3 className="text-sm font-semibold text-gray-900">No users found</h3>
          <p className="text-sm text-gray-500 mt-1">Registered clients will show up automatically in this directory.</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;