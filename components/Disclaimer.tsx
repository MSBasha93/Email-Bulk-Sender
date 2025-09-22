
import React from 'react';

const InfoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


export const Disclaimer: React.FC = () => (
    <div className="bg-blue-100 dark:bg-blue-900/30 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 p-4 rounded-md mb-6 flex items-center shadow-md">
        <InfoIcon />
        <div>
            <p className="font-bold">Developer Note: Frontend Simulation</p>
            <p>This web application is a frontend-only recreation. Email sending is **simulated** to demonstrate functionality without a backend server. Your credentials are not stored or used for actual SMTP connections.</p>
        </div>
    </div>
);
