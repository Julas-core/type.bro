
import React, { useContext, useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Scatter } from 'recharts';
import { TestResult, LeaderboardEntry } from '../types';
import { SettingsContext } from '../contexts/SettingsContext';
import { useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { getOrCreateUser, saveTestResult } from '../services/database';

interface TestResultsProps {
    result: TestResult;
}

const StatCard: React.FC<{ label: string; value: string | number; large?: boolean }> = ({ label, value, large = false }) => (
    <div className="flex flex-col items-center">
        <span className="text-theme-text text-lg">{label}</span>
        <span className={`${large ? 'text-6xl' : 'text-4xl'} font-bold text-theme-primary`}>{value}</span>
    </div>
);

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-theme-bg border border-theme-secondary p-3">
                <p className="label text-theme-primary">{`${label}s`}</p>
                {payload.map((pld: any, index: number) => (
                    pld.dataKey !== 'mistakes' && (
                        <p key={index} style={{ color: pld.color }}>
                            {`${pld.name}: ${pld.value}`}
                        </p>
                    )
                ))}
            </div>
        );
    }
    return null;
};

const TestResults: React.FC<TestResultsProps> = ({ result }) => {
    const { settings } = useContext(SettingsContext);
    const { user, isSignedIn } = useUser();
    const [themeColors, setThemeColors] = useState({
        primary: '#65ff68', text: '#888888', secondary: '#444444', error: '#ff5555', primaryDark: '#3c9a3e'
    });

    useEffect(() => {
        const LEADERBOARD_KEY = 'monkeytype-leaderboard';
        const MIN_WPM_FOR_PROMPT = 30;

        if (isSignedIn && user) {
            const saveResult = async () => {
                try {
                    const dbUser = await getOrCreateUser(user.id);
                    if (dbUser) {
                        await saveTestResult(dbUser.id, result);
                    }
                } catch (error) {
                    console.error("Error saving test result:", error);
                }
            };
            saveResult();
        } else if (result.wpm > MIN_WPM_FOR_PROMPT) {
            setTimeout(() => { // Use timeout to avoid blocking render and let user see results first
                const name = window.prompt(`You got ${Math.round(result.wpm)} WPM! Enter your name for the leaderboard:`);
                if (name && name.trim().length > 0) {
                    const allEntries: LeaderboardEntry[] = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || '[]');
                    
                    const newEntry: LeaderboardEntry = {
                        ...result,
                        name: name.trim(),
                        date: new Date().toISOString(),
                    };

                    allEntries.push(newEntry);

                    localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(allEntries));
                }
            }, 500);
        }
    }, [result, isSignedIn, user]);

    useEffect(() => {
        // Delay reading CSS vars to ensure they've been applied by React's render cycle
        const timer = setTimeout(() => {
            const rootStyle = getComputedStyle(document.documentElement);
            const primaryColor = rootStyle.getPropertyValue('--primary-color').trim();
            if (primaryColor) { // Ensure the color is loaded before setting state
                setThemeColors({
                    primary: primaryColor,
                    text: rootStyle.getPropertyValue('--text-color').trim(),
                    secondary: rootStyle.getPropertyValue('--secondary-color').trim(),
                    error: rootStyle.getPropertyValue('--error-color').trim(),
                    primaryDark: rootStyle.getPropertyValue('--primary-dark-color').trim(),
                });
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [settings.theme]);

    return (
        <div className="w-full max-w-4xl flex flex-col items-center gap-8 text-theme-primary">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <StatCard label="wpm" value={Math.round(result.wpm)} large />
                <StatCard label="acc" value={`${Math.round(result.accuracy)}%`} large />
                <StatCard label="raw" value={Math.round(result.rawWpm)} />
                <StatCard label="time" value={`${result.timeDuration}s`} />
            </div>

            <div className="w-full h-64 mt-8">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={result.wpmHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.secondary} />
                        <XAxis dataKey="time" stroke={themeColors.text} unit="s" />
                        <YAxis yAxisId="left" stroke={themeColors.primary} label={{ value: 'wpm', angle: -90, position: 'insideLeft', fill: themeColors.primary }} />
                        <YAxis 
                            yAxisId="right" 
                            orientation="right" 
                            stroke={themeColors.text} 
                            label={{ value: 'accuracy', angle: -90, position: 'insideRight', fill: themeColors.text }}
                            domain={[0, 100]}
                            unit="%"
                        />
                        <Tooltip content={<CustomTooltip />} />

                        {/* Accuracy line is rendered first to appear "under" the others */}
                        <Line yAxisId="right" type="monotone" dataKey="accuracy" name="accuracy" stroke={themeColors.text} strokeWidth={2} dot={false} />
                        <Line yAxisId="left" type="monotone" dataKey="rawWpm" name="raw" stroke={themeColors.primaryDark} strokeWidth={2} dot={false} />
                        <Line yAxisId="left" type="monotone" dataKey="wpm" name="wpm" stroke={themeColors.primary} strokeWidth={2} dot={false} />

                        <Scatter yAxisId="left" data={result.mistakePoints} name="mistakes" fill={themeColors.error} shape="cross" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
             <div className="text-center mt-4">
                <p className="text-lg">test type</p>
                <p className="text-2xl font-bold">
                    {result.testMode}
                    {result.testMode === 'time' ? ` ${result.timeDuration}` : ''}
                    {result.testMode === 'words' ? ` ${result.wordCount}` : ''}
                    {result.testMode === 'quote' ? ` ${result.quoteLength}` : ''}
                    {` / english`}
                </p>
            </div>
            {!isSignedIn && (
                <div className="mt-4">
                    <Link to="/sign-in" className="text-theme-primary hover:underline">
                        Sign in to save your results
                    </Link>
                </div>
            )}
        </div>
    );
};

export default TestResults;
