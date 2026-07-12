import React from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { getOrder } from '../../services/order.service.js';

const Success = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id');
  
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrder(orderId),
    enabled: !!orderId,
  });

  // Styled Loading State
  if (isPending) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  // Styled Error State
  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-6 shadow-sm border border-red-100 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">Failed to load order</h2>
          <p className="text-sm text-gray-600">{error?.message || 'An unexpected error occurred.'}</p>
        </div>
      </div>
    );
  }

  // Styled Success UI
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
        
        {/* Success Icon Header */}
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Order Successful!</h1>
          <p className="text-sm text-gray-500 mt-2">
            Thank you for your purchase. Your order has been confirmed.
          </p>
        </div>

        {/* Order Details Body */}
        <div className="mt-6 border-t border-gray-100 pt-6">
          <div className="flex items-center justify-between text-sm bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
            <span className="font-medium text-gray-600">Order ID</span>
            <span className="font-mono font-semibold text-gray-900">{orderId || 'N/A'}</span>
          </div>
          
          {/* Mock dynamic data display from the useQuery response */}
          {data && (
            <div className="mt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Order Data Summary
              </h3>
              <div className="bg-gray-900 text-gray-100 text-xs font-mono p-4 rounded-xl overflow-x-auto max-h-48 shadow-inner">
                <pre>{JSON.stringify(data, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>

        {/* Actions Footer */}
        <div className="mt-8">
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-xs text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-150"
          >
            Continue Shopping
          </button>
        </div>

      </div>
    </div>
  );
};

export default Success;