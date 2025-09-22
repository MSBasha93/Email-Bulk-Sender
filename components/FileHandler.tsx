
import React from 'react';

interface FileHandlerProps {
    onLoadExcel: () => void;
    onDownloadSheet: () => void;
    contactsLoaded: boolean;
    fileName: string;
}

const UploadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h2a4 4 0 014 4v1m-1 8l-3-3m0 0l-3 3m3-3v7" /></svg>;
const DownloadIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;

export const FileHandler: React.FC<FileHandlerProps> = ({ onLoadExcel, onDownloadSheet, contactsLoaded, fileName }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Contact List</h3>
             {fileName && <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Loaded: <span className="font-medium text-gray-700 dark:text-gray-300">{fileName}</span></p>}
            <div className="space-y-4">
                <button
                    onClick={onLoadExcel}
                    className="w-full py-3 px-4 bg-indigo-600 text-white font-bold rounded-lg shadow-md hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center"
                >
                   <UploadIcon />
                    {contactsLoaded ? 'Load New Sheet' : 'Load Excel Sheet'}
                </button>
                <button
                    onClick={onDownloadSheet}
                    disabled={!contactsLoaded}
                    className="w-full py-3 px-4 bg-gray-600 text-white font-bold rounded-lg shadow-md hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                >
                   <DownloadIcon />
                    Download Updated Sheet
                </button>
            </div>
        </div>
    );
};
