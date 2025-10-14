import React, { useContext, useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { SettingsContext } from '../contexts/SettingsContext';
import { useUser } from '@clerk/clerk-react';
import { getUserStats, getRecentTests, getOrCreateUser } from '../services/database';
import { TestResult } from '../types';

const Profile: React.FC = () => {
    const { settings } = useContext(SettingsContext);
    const { user, isSignedIn } = useUser();
    const [stats, setStats] = useState<any>(null);
    const [recentTests, setRecentTests] = useState<TestResult[]>([]);
    const [themeColors, setThemeColors] = useState({
        primary: '#000', text: '#000', secondary: '#000', bg: '#fff'
    });

    useEffect(() => {
        const timer = setTimeout(() => {
            const rootStyle = getComputedStyle(document.documentElement);
            const primaryColor = rootStyle.getPropertyValue('--primary-color').trim();
            if (primaryColor) {
                setThemeColors({
                    primary: primaryColor,
                    text: rootStyle.getPropertyValue('--text-color').trim(),
                    secondary: rootStyle.getPropertyValue('--secondary-color').trim(),
                    bg: rootStyle.getPropertyValue('--bg-color').trim(),
                });
            }
        }, 0);
        return () => clearTimeout(timer);
    }, [settings.theme]);

    useEffect(() => {
        const fetchData = async () => {
            if (isSignedIn && user) {
                console.log("User object from useUser:", user);
                try {
                    const dbUser = await getOrCreateUser(user.id);
                    console.log("Database user object:", dbUser);
                    if (dbUser) {
                        const userStats = await getUserStats(dbUser.id);
                        console.log("User stats:", userStats);
                        const recentTestsData = await getRecentTests(dbUser.id);
                        console.log("Recent tests:", recentTestsData);
                        setStats(userStats);
                        setRecentTests(recentTestsData);
                    }
                } catch (error) {
                    console.error("Error fetching profile data:", error);
                }
            }
        };
        fetchData();
    }, [isSignedIn, user]);

    if (!isSignedIn || !stats) {
        return <div>Loading...</div>; // Or a more sophisticated loading state
    }

    return (
        <div className="w-full max-w-5xl flex flex-col gap-8 text-theme-text">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-theme-secondary rounded-full">
                        <img src={user?.imageUrl} alt="Profile" className="rounded-full" />
                    </div>
                    <div>
                        <h2 className="text-2xl text-theme-primary">{user?.username}</h2>
                        <p>Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                </div>
                <div className="flex gap-4 text-center">
                    <div><p className="text-2xl font-bold text-theme-primary">{stats.testsCompleted}</p><p>tests completed</p></div>
                    <div><p className="text-2xl font-bold text-theme-primary">{stats.timeTyping}</p><p>time typing</p></div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 text-center">
                <div className="bg-theme-secondary/20 p-4 rounded">
                    <p className="text-3xl font-bold text-theme-primary">{Math.round(stats.allTimeHigh)}</p>
                    <p>all time high</p>
                </div>
                <div className="bg-theme-secondary/20 p-4 rounded">
                    <p className="text-3xl font-bold text-theme-primary">{Math.round(stats.averageWpm)}</p>
                    <p>avg speed</p>
                </div>
                <div className="bg-theme-secondary/20 p-4 rounded">
                    <p className="text-3xl font-bold text-theme-primary">{Math.round(stats.averageRawWpm)}</p>
                    <p>avg raw</p>
                </div>
                <div className="bg-theme-secondary/20 p-4 rounded">
                    <p className="text-3xl font-bold text-theme-primary">{Math.round(stats.averageAcc)}%</p>
                    <p>avg acc</p>
                </div>
            </div>

            <div className="w-full h-64 mt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={recentTests}>
                        <CartesianGrid strokeDasharray="3 3" stroke={themeColors.secondary} />
                        <XAxis dataKey="created_at" stroke={themeColors.text} tickFormatter={(timeStr) => new Date(timeStr).toLocaleDateString()} />
                        <YAxis stroke={themeColors.text} />
                        <Tooltip contentStyle={{ backgroundColor: themeColors.bg, border: `1px solid ${themeColors.secondary}` }} itemStyle={{ color: themeColors.primary }}/>
                        <Line type="monotone" dataKey="wpm" stroke={themeColors.primary} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-theme-secondary">
                            <th className="p-2">wpm</th>
                            <th className="p-2">acc</th>
                            <th className="p-2">raw</th>
                            <th className="p-2">date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentTests.map((test, i) => (
                             <tr key={i} className="border-b border-theme-secondary/50">
                                <td className="p-2 text-theme-primary font-bold">{test.wpm}</td>
                                <td className="p-2">{test.accuracy}%</td>
                                <td className="p-2">{test.raw_wpm}</td>
                                <td className="p-2">{new Date(test.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Profile;