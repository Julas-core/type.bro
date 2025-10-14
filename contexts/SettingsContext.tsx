import React, { createContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of your settings
export interface Settings {
    liveProgressStyle: 'off' | 'bar' | 'text' | 'mini';
    highlightMode: 'off' | 'letter' | 'word' | 'next word' | 'next two words';
    fontSize: number;
    fontFamily: string;
    theme: string;
    testDifficulty: 'normal' | 'expert' | 'master';
    quickRestart: 'off' | 'tab' | 'esc' | 'enter';
    blindMode: boolean;
    stopOnError: 'off' | 'word' | 'letter';
    confidenceMode: 'off' | 'on' | 'max';
    soundVolume: number;
    soundOnClick: 'off' | 'click' | 'beep' | 'typewriter';
    soundOnError: 'off' | 'damage' | 'square';
    smoothCaret: 'off' | 'slow' | 'medium' | 'fast';
    caretStyle: 'off' | '|' | 'block' | '_';
    paceCursorStyle: 'underline' | 'bar';
    testMode: 'time' | 'words' | 'quote' | 'zen';
    timeDuration: 15 | 30 | 60 | 120;
    wordCount: 10 | 25 | 50 | 100;
    quoteLength: 'short' | 'medium' | 'long' | 'all';
    zenModeExit: 'esc' | 'enter';
    includePunctuation: boolean;
    includeNumbers: boolean;
    language: string;
    paceMode: 'off' | 'average' | 'highest' | 'last' | 'custom';
    customPaceWpm: number;
    miniSettingsKey: string;
}

// Define the shape of the context value
interface SettingsContextType {
    settings: Settings;
    setSettings: React.Dispatch<React.SetStateAction<Settings>>;
}

// Default settings
export const defaultSettings: Settings = {
    liveProgressStyle: 'text',
    highlightMode: 'word',
    fontSize: 2.25,
    fontFamily: "'Roboto Mono', monospace",
    theme: 'matrix',
    testDifficulty: 'normal',
    quickRestart: 'off',
    blindMode: false,
    stopOnError: 'off',
    confidenceMode: 'off',
    soundVolume: 0.5,
    soundOnClick: 'off',
    soundOnError: 'off',
    smoothCaret: 'off',
    caretStyle: 'block',
    paceCursorStyle: 'underline',
    testMode: 'time',
    timeDuration: 30,
    wordCount: 50,
    quoteLength: 'all',
    zenModeExit: 'esc',
    includePunctuation: false,
    includeNumbers: false,
    language: 'english',
    paceMode: 'off',
    customPaceWpm: 100,
    miniSettingsKey: 'Escape',
};

// Create the context
export const SettingsContext = createContext<SettingsContextType>({
    settings: defaultSettings,
    setSettings: () => {},
});

// Create the provider component
export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<Settings>(() => {
        try {
            const savedSettings = localStorage.getItem('typetest-settings');
            return savedSettings ? { ...defaultSettings, ...JSON.parse(savedSettings) } : defaultSettings;
        } catch (error) {
            console.error("Could not load settings from localStorage", error);
            return defaultSettings;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('typetest-settings', JSON.stringify(settings));
        } catch (error) {
            console.error("Could not save settings to localStorage", error);
        }
    }, [settings]);

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            {children}
        </SettingsContext.Provider>
    );
};