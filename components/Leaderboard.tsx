import React, { useState, useEffect } from 'react';
import { LeaderboardEntry } from '../types';

const LEADERBOARD_KEY = 'monkeytype-leaderboard';

const Leaderboard: React.FC = () => {
    const [filter, setFilter] = useState({ mode: 'time', value: 15 });
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);

    useEffect(() => {
        try {
            const allEntries: LeaderboardEntry[] = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
            
            const filtered = allEntries.filter(entry => {
                if (filter.mode === 'time') {
                    return entry.testMode === 'time' && entry.timeDuration === filter.value;
                }
                if (filter.mode === 'words') {
                    return entry.testMode === 'words' && entry.wordCount === filter.value;
                }
                return false;
            });

            const sorted = filtered.sort((a, b) => b.wpm - a.wpm);
            
            setEntries(sorted.slice(0, 50)); // Limit to top 50
        } catch (error) {
            console.error("Failed to load or parse leaderboard data:", error);
            setEntries([]);
        }
    }, [filter]);

    const FilterButton: React.FC<{ label: string; mode: 'time' | 'words'; value: number }> = ({ label, mode, value }) => {
        const isActive = filter.mode === mode && filter.value === value;
        return (
            <button
                onClick={() => setFilter({ mode, value })}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                    isActive ? 'bg-theme-primary text-theme-bg' : 'text-theme-text hover:text-theme-primary'
                }`}
            >
                {label}
            </button>
        );
    };
    
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full max-w-5xl flex flex-col gap-4 text-theme-text">
            <h2 className="text-2xl text-theme-primary font-bold text-center">All-time English {filter.mode} {filter.value} Leaderboard</h2>
            <div className="flex justify-center flex-wrap gap-2">
                <FilterButton label="time 15" mode="time" value={15} />
                <FilterButton label="time 30" mode="time" value={30} />
                <FilterButton label="time 60" mode="time" value={60} />
                <FilterButton label="time 120" mode="time" value={120} />
                <FilterButton label="words 10" mode="words" value={10} />
                <FilterButton label="words 25" mode="words" value={25} />
                <FilterButton label="words 50" mode="words" value={50} />
                <FilterButton label="words 100" mode="words" value={100} />
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead>
                        <tr className="border-b border-theme-secondary">
                            <th className="p-2">#</th>
                            <th className="p-2">name</th>
                            <th className="p-2 text-right">wpm</th>
                            <th className="p-2 text-right">acc</th>
                            <th className="p-2 text-right">raw</th>
                            <th className="p-2 text-right">date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.length > 0 ? (
                            entries.map((entry, index) => (
                                <tr key={`${entry.date}-${entry.name}-${index}`} className="border-b border-theme-secondary/50 hover:bg-theme-secondary/20">
                                    <td className="p-2">{index + 1}</td>
                                    <td className="p-2 text-theme-primary">{entry.name}</td>
                                    <td className="p-2 text-right text-theme-primary font-bold">{Math.round(entry.wpm)}</td>
                                    <td className="p-2 text-right">{Math.round(entry.accuracy)}%</td>
                                    <td className="p-2 text-right">{Math.round(entry.rawWpm)}</td>
                                    <td className="p-2 text-right text-sm">{formatDate(entry.date)}</td>
                                </tr>
                            ))
                        ) : (
                             <tr>
                                <td colSpan={6} className="text-center p-8 text-theme-text">
                                    No results found for this category. Be the first to set a record!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Leaderboard;
