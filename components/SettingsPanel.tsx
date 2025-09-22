import React from 'react';

interface SettingsPanelProps {
    onStart: () => void;
    onStop: () => void;
    isSending: boolean;
    sendDelay: number;
    onSendDelayChange: (value: number) => void;
    stats: {
        sent: number;
        failed: number;
        total: number;
    };
    contactsLoaded: boolean;
}

const StartIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const StopIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>;

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
    onStart,
    onStop,
    isSending,
    sendDelay,
    onSendDelayChange,
    stats,
    contactsLoaded
}) => {
    const progress = stats.total > 0 ? ((stats.sent + stats.failed) / stats.total) * 100 : 0;

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700">Campaign Control</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="send-delay" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Send Delay (ms): <span className="font-bold">{sendDelay}</span>
                    </label>
                    <input
                        id="send-delay"
                        type="range"
                        min="200"
                        max="5000"
                        step="100"
                        value={sendDelay}
                        onChange={(e) => onSendDelayChange(Number(e.target.value))}
                        disabled={isSending}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                    />
                </div>

                <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
                    <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700 mt-1">
                         <div className="bg-blue-600 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
                    </div>
                    <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                        {stats.sent + stats.failed} / {stats.total}
                    </p>
                     <div className="flex justify-between text-sm mt-2">
                        <span className="text-green-600 dark:text-green-400">Sent: {stats.sent}</span>
                        <span className="text-red-600 dark:text-red-400">Failed: {stats.failed}</span>
                    </div>
                </div>

                <div className="pt-2">
                    {!isSending ? (
                        <button
                            onClick={onStart}
                            disabled={!contactsLoaded || isSending}
                            className="w-full py-3 px-4 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300 flex items-center justify-center"
                        >
                            <StartIcon />
                            START CAMPAIGN
                        </button>
                    ) : (
                        <button
                            onClick={onStop}
                            className="w-full py-3 px-4 bg-red-600 text-white font-bold rounded-lg shadow-md hover:bg-red-700 transition-colors duration-300 flex items-center justify-center"
                        >
                            <StopIcon />
                            STOP CAMPAIGN
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};
