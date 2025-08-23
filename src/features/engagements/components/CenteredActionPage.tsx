'use client';

import React from 'react';

// Define the shape of the props for reusability
interface CenteredActionPageProps {
  type?: 'success' | 'info' | 'error';
  title: string;
  message: string;
  buttonText: string;
  icon?: React.ReactNode;
}

// A default success icon (checkmark in a circle)
const DefaultSuccessIcon = () => (
  <svg
    className="w-16 h-16"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    ></path>
  </svg>
);

export default function CenteredActionPage({
  type = 'info',
  title,
  message,
  buttonText,
  icon,
}: CenteredActionPageProps) {
  
  // Style configurations for each message type
  const styles = {
    info: {
      iconColor: 'text-gray-400',
      button: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    },
    success: {
      iconColor: 'text-green-500',
      button: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    },
    error: {
      iconColor: 'text-red-500',
      button: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    },
  };

  const selectedStyle = styles[type];

  // Use a default icon for success messages if no custom icon is provided
  const displayIcon = type === 'success' && !icon ? <DefaultSuccessIcon /> : icon;

  // This function will attempt to close the current browser tab.
  // Note: This only works if the tab was opened by a script (e.g., from your app).
  const handleCloseTab = () => {
    window.close();
  };

  return (
    // Main container to center everything vertically and horizontally
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      
      {/* The card component */}
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 text-center">
        
        {/* Icon */}
        {displayIcon && (
          <div className={`mx-auto mb-6 flex items-center justify-center ${selectedStyle.iconColor}`}>
            {displayIcon}
          </div>
        )}
        
        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        
        {/* Message */}
        <p className="mt-2 text-base text-gray-600">{message}</p>
        
        {/* Close Button */}
        <div className="mt-8">
          <button
            onClick={handleCloseTab}
            className={`w-full px-6 py-3 rounded-lg font-semibold text-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${selectedStyle.button}`}
          >
            {buttonText}
          </button>
        </div>

      </div>
    </div>
  );
}