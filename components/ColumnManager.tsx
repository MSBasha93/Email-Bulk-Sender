import React from 'react';

interface ColumnManagerProps {
    availableColumns: string[];
    emailColumn: string;
    onEmailColumnChange: (value: string) => void;
    companyColumn: string;
    onCompanyColumnChange: (value: string) => void;
    contactsLoaded: boolean;
}

export const ColumnManager: React.FC<ColumnManagerProps> = ({
    availableColumns,
    emailColumn,
    onEmailColumnChange,
    companyColumn,
    onCompanyColumnChange,
    contactsLoaded
}) => {
    return (
        <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg ${!contactsLoaded && 'opacity-50 cursor-not-allowed'}`}>
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Column Mapping</h3>
            <fieldset disabled={!contactsLoaded} className="space-y-4">
                <div>
                    <label htmlFor="email-column" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email Column:
                    </label>
                    <select
                        id="email-column"
                        value={emailColumn}
                        onChange={(e) => onEmailColumnChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">-- Select Email Column --</option>
                        {availableColumns.map(col => <option key={col} value={col}>{col}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="company-column" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Company Name Column (for <code className="text-xs bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">[company_name]</code> placeholder):
                    </label>
                    <select
                        id="company-column"
                        value={companyColumn}
                        onChange={(e) => onCompanyColumnChange(e.target.value)}
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option value="">-- Select Company Column --</option>
                        {availableColumns.map(col => <option key={col} value={col}>{col}</option>)}
                    </select>
                </div>
                 {!contactsLoaded && <p className="text-xs text-yellow-600 dark:text-yellow-400">Load an Excel sheet to enable column mapping.</p>}
            </fieldset>
        </div>
    );
};
