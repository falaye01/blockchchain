import React, { useContext } from "react";
import { CrowdFundingContext } from "../Context/CrowdFunding";

const NotificationToast = () => {
  const { notification, setNotification } = useContext(CrowdFundingContext);

  if (!notification || !notification.message) return null;

  const { type, message } = notification;

  const bgStyles = {
    success: "bg-emerald-950/90 border-emerald-500/50 text-emerald-200 shadow-emerald-900/30",
    error: "bg-rose-950/90 border-rose-500/50 text-rose-200 shadow-rose-900/30",
    info: "bg-indigo-950/90 border-indigo-500/50 text-indigo-200 shadow-indigo-900/30",
  }[type] || "bg-gray-900 border-gray-700 text-gray-200";

  const icons = {
    success: (
      <svg className="w-5 h-5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 text-indigo-400 shrink-0 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all duration-300 ${bgStyles}`}
      >
        {icons[type] || icons.info}
        <p className="text-sm font-medium pr-2 leading-snug">{message}</p>
        <button
          onClick={() => setNotification(null)}
          className="ml-auto text-gray-400 hover:text-white transition-colors p-1 rounded-lg"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NotificationToast;
