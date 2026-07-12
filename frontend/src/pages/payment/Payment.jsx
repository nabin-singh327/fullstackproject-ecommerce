import React from "react";
import { useLocation } from "react-router";
import CryptoJS from "crypto-js";

const Payment = () => {
  const location = useLocation();
  const { totalAmount, orderId } = location?.state || {};

  // Generate the cryptographic signature required by eSewa
  const hash = CryptoJS.HmacSHA256(
    `total_amount=${totalAmount},transaction_uuid=${orderId},product_code=EPAYTEST`,
    import.meta.env.VITE_ESEWA_SECRET_KEY,
  );
  const signature = CryptoJS.enc.Base64.stringify(hash);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Main Payment Container Card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-xl p-6 md:p-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            Checkout Payment
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Complete your purchase securely via eSewa
          </p>
        </div>

        {/* Informative Display Area (What the user actually sees) */}
        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-4 mb-8">
          <div className="flex justify-between items-center pb-3 border-b border-gray-200">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
              Transaction ID
            </span>
            <span className="text-sm font-mono font-medium text-gray-700 truncate max-w-45">
              {orderId || "N/A"}
            </span>
          </div>
          <div className="flex justify-between items-center pt-1">
            <span className="text-sm font-medium text-gray-600">
              Amount Payable
            </span>
            <span className="text-2xl font-extrabold text-gray-900">
              Rs. {totalAmount ? Number(totalAmount).toLocaleString() : "0"}
            </span>
          </div>
        </div>

        {/* eSewa Form Integration */}
        <form
          action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
          method="POST"
          className="space-y-4"
        >
          {/* Critical: Changed type from "text" to "hidden" so parameters aren't exposed or editable */}
          <input type="hidden" id="amount" name="amount" value={totalAmount} />
          <input type="hidden" id="tax_amount" name="tax_amount" value={0} />
          <input
            type="hidden"
            id="total_amount"
            name="total_amount"
            value={totalAmount}
          />
          <input
            type="hidden"
            id="transaction_uuid"
            name="transaction_uuid"
            value={orderId}
          />
          <input
            type="hidden"
            id="product_code"
            name="product_code"
            value="EPAYTEST"
          />
          <input
            type="hidden"
            id="product_service_charge"
            name="product_service_charge"
            value={0}
          />
          <input
            type="hidden"
            id="product_delivery_charge"
            name="product_delivery_charge"
            value={0}
          />
          <input
            type="hidden"
            id="success_url"
            name="success_url"
            value="https://localhost:9000/api/orders/success"
          />
          <input
            type="hidden"
            id="failure_url"
            name="failure_url"
            value="https://developer.esewa.com.np/failure"
          />
          <input
            type="hidden"
            id="signed_field_names"
            name="signed_field_names"
            value="total_amount,transaction_uuid,product_code"
          />
          <input
            type="hidden"
            id="signature"
            name="signature"
            value={signature}
          />

          {/* Styled Pay Button using brand-representative eSewa colors */}
          <button
            type="submit"
            className="w-full bg-[#60bb46] text-white py-4 px-6 rounded-xl font-bold text-lg shadow-sm hover:bg-[#52a23b] active:scale-[0.99] transition-all flex items-center justify-center gap-2 tracking-wide cursor-pointer"
          >
            <span>Pay with eSewa</span>
          </button>
        </form>

        {/* Cancel / Go Back CTA */}
        <button
          onClick={() => window.history.back()}
          className="w-full text-center text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors mt-4 py-2 bg-transparent border-0 cursor-pointer"
        >
          Cancel and go back
        </button>
      </div>
    </div>
  );
};

export default Payment;
