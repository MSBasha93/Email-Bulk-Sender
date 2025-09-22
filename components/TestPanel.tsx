
import React from 'react';

interface TestPanelProps {
    testRecipient: string;
    onTestRecipientChange: (value: string) => void;
    onSendTest: () => void;
    isSending: boolean;
}

export const TestPanel: React.FC<TestPanelProps> = ({ testRecipient, onTestRecipientChange, onSendTest, isSending }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Test Send</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Test Recipient:</label>
                    <input type="email" value={testRecipient} onChange={(e) => onTestRecipientChange(e.target.value)} className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="test-recipient@example.com"/>
                </div>
                <button
                    onClick={onSendTest}
                    disabled={isSending}
                    className="w-full mt-2 py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                >
                    {isSending ? (
                         <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Sending Test...
                        </>
                    ) : 'SEND TEST'}
                </button>
            </div>
        </div>
    );
};
