
import React, { useState, useCallback, useContext, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { View, TestResult } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import TypingTest from './components/TypingTest';
import TestResults from './components/TestResults';
import Leaderboard from './components/Leaderboard';
import Profile from './components/Profile';
import Settings from './components/Settings';
import Auth from './components/Auth';

import MiniSettings from './components/MiniSettings';
import { SettingsProvider, SettingsContext } from './contexts/SettingsContext';
import { themes } from './themes';
import { Theme as ThemeType } from './themes';


// Function to dynamically load a font from Google Fonts
const loadFont = (fontFamily: string) => {
    if (!fontFamily || fontFamily === 'Custom') return;

    const fontId = `font-${fontFamily.replace(/[\s,']/g, '-')}`;
    if (document.getElementById(fontId)) {
        return; // Font already loaded or loading
    }

    const link = document.createElement('link');
    const fontName = fontFamily.split(',')[0].replace(/'/g, ''); // Get font name like 'Roboto Mono'
    const fontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s/g, '+')}:wght@400;500;700&display=swap`;
    
    link.id = fontId;
    link.rel = 'stylesheet';
    link.href = fontUrl;
    
    document.head.appendChild(link);
};


const AppContent: React.FC = () => {
    const [view, setView] = useState<View>(View.TypingTest);
    const [lastTestResult, setLastTestResult] = useState<TestResult | null>(null);
    const [isMiniSettingsOpen, setIsMiniSettingsOpen] = useState(false);
    const { settings } = useContext(SettingsContext);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === settings.miniSettingsKey) {
                e.preventDefault();
                setIsMiniSettingsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [settings.miniSettingsKey]);

    useEffect(() => {
        loadFont(settings.fontFamily);
    }, [settings.fontFamily]);

    useEffect(() => {
        const applyTheme = (themeName: string) => {
            const theme: ThemeType = themes[themeName] || themes['matrix'];
            const root = document.documentElement;
            root.style.setProperty('--bg-color', theme.bg);
            root.style.setProperty('--text-color', theme.text);
            root.style.setProperty('--primary-color', theme.primary);
            root.style.setProperty('--primary-dark-color', theme.primaryDark || theme.secondary);
            root.style.setProperty('--secondary-color', theme.secondary);
            root.style.setProperty('--error-color', theme.error);
            root.style.setProperty('--caret-color', theme.caret);
        };
        applyTheme(settings.theme);
    }, [settings.theme]);

    const handleTestComplete = useCallback((result: TestResult) => {
        setLastTestResult(result);
        setView(View.Results);

        try {
            const savedStats = localStorage.getItem('typetest-stats');
            const stats = savedStats ? JSON.parse(savedStats) : {
                testsCompleted: 0,
                highestWpm: 0,
                averageWpm: 0,
                averageAcc: 0,
                totalKeystrokes: 0,
            };

            const newTestsCompleted = stats.testsCompleted + 1;
            const newTotalWpm = (stats.averageWpm * stats.testsCompleted) + result.wpm;
            const newTotalAcc = (stats.averageAcc * stats.testsCompleted) + result.accuracy;

            const newStats = {
                ...stats,
                testsCompleted: newTestsCompleted,
                highestWpm: Math.max(stats.highestWpm, result.wpm),
                averageWpm: newTotalWpm / newTestsCompleted,
                averageAcc: newTotalAcc / newTestsCompleted,
                totalKeystrokes: stats.totalKeystrokes + result.charStats.correct + result.charStats.incorrect + result.charStats.extra,
            };

            localStorage.setItem('typetest-stats', JSON.stringify(newStats));
        } catch (error) {
            console.error("Could not save stats to localStorage", error);
        }
    }, []);

    const { isSignedIn } = useUser();

    const renderView = () => {
        const isProtectedView = [View.Profile, View.Settings].includes(view);

        if (isProtectedView && !isSignedIn) {
            return <Auth />;
        }

        switch (view) {
            case View.TypingTest:
                return <TypingTest onTestComplete={handleTestComplete} />;
            case View.Results:
                return lastTestResult ? <TestResults result={lastTestResult} /> : <TypingTest onTestComplete={handleTestComplete} />;
            case View.Leaderboard:
                return <Leaderboard />;
            case View.Profile:
                return <Profile />;
            case View.Settings:
                return <Settings />;
            case View.Auth:
                return <Auth />;

            default:
                return <TypingTest onTestComplete={handleTestComplete} />;
        }
    };

    const mainStyle = {
        fontFamily: settings.fontFamily,
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-4 md:p-8 bg-theme-bg text-theme-text selection:bg-theme-primary selection:text-theme-bg" style={mainStyle}>
            <MiniSettings isOpen={isMiniSettingsOpen} onClose={() => setIsMiniSettingsOpen(false)} />
            <Header setView={setView} />
            <main className="w-full max-w-6xl flex-grow flex items-center justify-center py-8">
                {renderView()}
            </main>
            <Footer />
        </div>
    );
};


import { BrowserRouter, Routes, Route } from 'react-router-dom';

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <SettingsProvider>
                <Routes>
                    <Route path="/sign-in" element={<Auth />} />
                    <Route path="/sign-up" element={<Auth />} />
                    <Route path="/*" element={<AppContent />} />
                </Routes>
            </SettingsProvider>
        </BrowserRouter>
    );
};

export default App;
