import React, { useContext } from 'react';
import { SettingsContext, Settings } from '../contexts/SettingsContext';
import { TimeIcon, ShuffleIcon } from './Icons';

type TestMode = Settings['testMode'];
type TimeDuration = Settings['timeDuration'];
type WordCount = Settings['wordCount'];
type QuoteLength = Settings['quoteLength'];

const ConfigButton: React.FC<{
    children: React.ReactNode;
    active?: boolean;
    onClick: () => void;
    className?: string;
}> = ({ children, active, onClick, className='' }) => {
    const activeClass = 'text-theme-primary';
    const inactiveClass = 'text-theme-text hover:text-theme-primary-dark';
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-1.5 px-2 py-1 transition-colors ${active ? activeClass : inactiveClass} ${className}`}
        >
            {children}
        </button>
    );
};

const TestConfigurator: React.FC = () => {
    const { settings, setSettings } = useContext(SettingsContext);

    const setMode = (mode: TestMode) => setSettings(s => ({ ...s, testMode: mode }));
    const setTime = (time: TimeDuration) => setSettings(s => ({ ...s, timeDuration: time }));
    const setWords = (words: WordCount) => setSettings(s => ({ ...s, wordCount: words }));
    const setQuoteLength = (length: QuoteLength) => setSettings(s => ({ ...s, quoteLength: length }));
    const togglePunctuation = () => setSettings(s => ({ ...s, includePunctuation: !s.includePunctuation }));
    const toggleNumbers = () => setSettings(s => ({ ...s, includeNumbers: !s.includeNumbers }));

    const timeOptions: TimeDuration[] = [15, 30, 60, 120];
    const wordOptions: WordCount[] = [10, 25, 50, 100];
    const quoteLengthOptions: QuoteLength[] = ['short', 'medium', 'long', 'all'];

    const renderModeOptions = () => {
        if (settings.testMode === 'time') {
            return timeOptions.map(t => (
                <button key={t} onClick={() => setTime(t)} className={`px-2 py-1 transition-colors ${settings.timeDuration === t ? 'text-theme-primary' : 'text-theme-text hover:text-theme-primary-dark'}`}>{t}</button>
            ));
        }
        if (settings.testMode === 'words') {
             return wordOptions.map(w => (
                <button key={w} onClick={() => setWords(w)} className={`px-2 py-1 transition-colors ${settings.wordCount === w ? 'text-theme-primary' : 'text-theme-text hover:text-theme-primary-dark'}`}>{w}</button>
            ));
        }
        if (settings.testMode === 'quote') {
            return quoteLengthOptions.map(q => (
                <button key={q} onClick={() => setQuoteLength(q)} className={`px-2 py-1 transition-colors capitalize ${settings.quoteLength === q ? 'text-theme-primary' : 'text-theme-text hover:text-theme-primary-dark'}`}>{q}</button>
            ));
        }
        return null; // for quote, zen, custom
    };

    return (
        <div className="w-full max-w-4xl bg-theme-secondary/50 rounded-lg p-2 flex justify-center items-center flex-wrap gap-x-3 gap-y-2 text-md">
            <div className="flex items-center gap-x-3">
                <ConfigButton active={settings.includePunctuation} onClick={togglePunctuation}>
                    <span className="text-theme-primary">@</span> punctuation
                </ConfigButton>
                <ConfigButton active={settings.includeNumbers} onClick={toggleNumbers}>
                    <span className="text-theme-primary">#</span> numbers
                </ConfigButton>
            </div>
            <div className="h-6 w-px bg-theme-text/50"></div>
            <div className="flex items-center gap-x-3">
                <ConfigButton active={settings.testMode === 'time'} onClick={() => setMode('time')}>
                    <TimeIcon /> time
                </ConfigButton>
                <ConfigButton active={settings.testMode === 'words'} onClick={() => setMode('words')}>
                    <span className="font-bold">A</span> words
                </ConfigButton>
                <ConfigButton active={settings.testMode === 'quote'} onClick={() => setMode('quote')}>
                    <span className="font-bold">“</span> quote
                </ConfigButton>
                 <ConfigButton active={settings.testMode === 'zen'} onClick={() => setMode('zen')}>
                    <span className="font-bold">▲</span> zen
                </ConfigButton>
            </div>
            <div className="h-6 w-px bg-theme-text/50"></div>
            <div className="flex items-center gap-x-2">
                {renderModeOptions()}
            </div>
             <div className="h-6 w-px bg-theme-text/50"></div>
             <button className="text-theme-text hover:text-theme-primary transition-colors"><ShuffleIcon /></button>
        </div>
    );
};

export default TestConfigurator;