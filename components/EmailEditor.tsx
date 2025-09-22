import React from 'react';

interface EmailEditorProps {
    subject: string;
    onSubjectChange: (value: string) => void;
    body: string;
    onBodyChange: (value: string) => void;
}

export const EmailEditor: React.FC<EmailEditorProps> = ({ subject, onSubjectChange, body, onBodyChange }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg col-span-1 md:col-span-2">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Email Content</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject:</label>
                    <input
                        type="text"
                        id="subject"
                        value={subject}
                        onChange={(e) => onSubjectChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                </div>
                <div>
                    <label htmlFor="body" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Body (HTML):</label>
                    <textarea
                        id="body"
                        value={body}
                        onChange={(e) => onBodyChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        rows={15}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Live Preview:</label>
                    <div 
                        className="w-full p-4 border border-dashed border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 min-h-[200px]"
                        dangerouslySetInnerHTML={{ __html: body }} 
                    />
                </div>
            </div>
        </div>
    );
};
