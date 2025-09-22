
import React, { useRef, useEffect } from 'react';
import type { LogEntry } from '../types';
import { LogType } from '../types';

interface StatusLogProps {
    log: LogEntry[];
}

const getLogColor = (type: LogType): string => {
    switch (type) {
        case LogType.SUCCESS:
            return 'text-green-500 dark:text-green-400';
        case LogType.ERROR:
            return 'text-red-500 dark:text-red-400';
        case LogType.WARNING:
            return 'text-yellow-500 dark:text-yellow-400';
        case LogType.INFO:
        default:
            return 'text-gray-600 dark:text-gray-300';
    }
};

export const StatusLog: React.FC<StatusLogProps> = ({ log }) => {
    const logEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [log]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg flex-grow flex flex-col h-96">
            <h3 className="text-xl font-semibold mb-4 border-b pb-2 border-gray-200 dark:border-gray-700 flex-shrink-0">Live Status Log</h3>
            <div className="flex-grow bg-gray-50 dark:bg-gray-900 p-3 rounded-md overflow-y-auto font-mono text-xs">
                {log.map((entry) => (
                    <p key={entry.id} className={`${getLogColor(entry.type)} whitespace-pre-wrap`}>
                        {entry.message}
                    </p>
                ))}
                <div ref={logEndRef} />
            </div>
        </div>
    );
};
