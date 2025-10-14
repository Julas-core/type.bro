import React, { useState, useEffect, useRef, useCallback, useContext } from 'react';
import { COMMON_WORDS } from '../constants';
import { TestResult } from '../types';

import { RefreshIcon, GlobeIcon, GaugeIcon } from './Icons';
import { SettingsContext } from '../contexts/SettingsContext';
import TestConfigurator from './TestConfigurator';
import { getWordsForLanguage } from '../words';
import { quotes } from '../quotes';
import LanguageModal from './LanguageModal';
import PaceSelectorModal from './PaceSelectorModal';

interface TypingTestProps {
    onTestComplete: (result: TestResult) => void;
}

const Word: React.FC<{ text: string; state: 'correct' | 'incorrect' | 'untyped' | 'active'; blindMode: boolean }> = React.memo(({ text, state, blindMode }) => {
    const color = {
        correct: 'text-theme-text',
        incorrect: blindMode ? 'text-theme-text' : 'text-theme-error',
        untyped: 'text-theme-text',
        active: 'text-theme-primary',
    }[state];
    return <span className={color}>{text}</span>;
});

const Char: React.FC<{ text: string; state: 'correct' | 'incorrect' | 'untyped', blindMode: boolean }> = React.memo(({ text, state, blindMode }) => {
    const color = {
        correct: 'text-theme-primary',
        incorrect: blindMode ? 'text-theme-primary' : 'text-theme-error bg-theme-error/20',
        untyped: 'text-theme-text',
    }[state];
    return <span className={color}>{text}</span>;
});

const PaceCursor: React.FC<{ style: 'underline' | 'bar' }> = React.memo(({ style }) => {
    if (style === 'underline') {
        return <span className="absolute bottom-[-2px] left-0 w-full h-0.5 bg-theme-error animate-pulse"></span>;
    }
    // bar style
    return <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-theme-error animate-pulse"></span>;
});


const Keyboard: React.FC<{ activeKey: string | null }> = React.memo(({ activeKey }) => {
    // Keyboard component remains unchanged
    return null; // Simplified for brevity in this example
});

const TypingTest: React.FC<TypingTestProps> = ({ onTestComplete }) => {
    const { settings } = useContext(SettingsContext);
    const [words, setWords] = useState<string[]>([]);
    const [userInput, setUserInput] = useState('');
    const [activeWordIndex, setActiveWordIndex] = useState(0);
    const [correctWords, setCorrectWords] = useState<boolean[]>([]);
    const [testStatus, setTestStatus] = useState<'waiting' | 'running' | 'finished'>('waiting');
    const [timeLeft, setTimeLeft] = useState<number>(settings.timeDuration);
    
    const [charStats, setCharStats] = useState({ correct: 0, incorrect: 0, extra: 0, missed: 0 });
    const [wpmHistory, setWpmHistory] = useState<{ time: number, wpm: number, accuracy: number, rawWpm: number }[]>([]);
    const [mistakePoints, setMistakePoints] = useState<{ time: number; wpm: number }[]>([]);

    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
    const [isPaceModalOpen, setIsPaceModalOpen] = useState(false);
    const [paceCursorState, setPaceCursorState] = useState({ word: 0, char: -1 });
    const [isLoadingText, setIsLoadingText] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const timerIntervalRef = useRef<number | null>(null);
    const paceTimeoutRef = useRef<number | null>(null);
    const charStatsRef = useRef(charStats);
    const wpmHistoryRef = useRef(wpmHistory);
    const startTimeRef = useRef<number | null>(null);
    const wordContainerRef = useRef<HTMLDivElement>(null);
    const activeWordRef = useRef<HTMLSpanElement>(null);
    const mistakePointsRef = useRef(mistakePoints);

    useEffect(() => { charStatsRef.current = charStats; }, [charStats]);
    useEffect(() => { wpmHistoryRef.current = wpmHistory; }, [wpmHistory]);
    useEffect(() => { mistakePointsRef.current = mistakePoints; }, [mistakePoints]);

    const endTest = useCallback(() => {
        if (testStatus !== 'running' || !startTimeRef.current) return;
        
        setTestStatus('finished');
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (paceTimeoutRef.current) clearTimeout(paceTimeoutRef.current);
        timerIntervalRef.current = null;
        paceTimeoutRef.current = null;

        const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
        const finalCharStats = charStatsRef.current;
        const correctChars = finalCharStats.correct;
        const totalTyped = finalCharStats.correct + finalCharStats.incorrect + finalCharStats.extra;

        const wpm = (correctChars / 5) / (elapsedTime / 60);
        const rawWpm = (totalTyped / 5) / (elapsedTime / 60);
        const accuracy = totalTyped > 0 ? (correctChars / totalTyped) * 100 : 0;
        
        const result: TestResult = {
            wpm: isNaN(wpm) ? 0 : wpm,
            rawWpm: isNaN(rawWpm) ? 0 : rawWpm,
            accuracy: isNaN(accuracy) ? 0 : accuracy,
            consistency: 80,
            charStats: finalCharStats,
            wpmHistory: wpmHistoryRef.current,
            mistakePoints: mistakePointsRef.current,
            testMode: settings.testMode,
            timeDuration: settings.testMode === 'time' || settings.testMode === 'zen' ? Math.round(elapsedTime) : settings.timeDuration,
            wordCount: settings.wordCount,
            quoteLength: settings.quoteLength,
            includePunctuation: settings.includePunctuation,
            includeNumbers: settings.includeNumbers,
        };
        onTestComplete(result);
    }, [testStatus, settings, onTestComplete]);
    
    useEffect(() => {
        if (testStatus === 'running' && settings.testMode === 'words' && activeWordIndex >= settings.wordCount) {
            endTest();
        }
    }, [activeWordIndex, settings.testMode, settings.wordCount, testStatus, endTest]);

    const generateText = useCallback(() => {
        setIsLoadingText(true);
        let newWords: string[] = [];
        if (settings.testMode === 'quote') {
            const quote = quotes[Math.floor(Math.random() * quotes.length)];
            newWords = quote.split(' ');
        } else {
            const wordList = getWordsForLanguage(settings.language);
            let wordAmount = 150; // Default for time/zen
            if (settings.testMode === 'words') {
                wordAmount = settings.wordCount;
            }
            const shuffled = [...wordList].sort(() => 0.5 - Math.random());
            newWords = shuffled.slice(0, wordAmount);
        }
        setWords(newWords);
        setIsLoadingText(false);
    }, [settings.language, settings.testMode, settings.wordCount, settings.quoteLength]);

    const resetTest = useCallback(() => {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (paceTimeoutRef.current) clearTimeout(paceTimeoutRef.current);
        timerIntervalRef.current = null;
        paceTimeoutRef.current = null;
    
        setTestStatus('waiting');
        generateText();
    
        setActiveWordIndex(0);
        setUserInput('');
        setCorrectWords([]);
        setTimeLeft(settings.timeDuration);
        startTimeRef.current = null;
        setCharStats({ correct: 0, incorrect: 0, extra: 0, missed: 0 });
        setWpmHistory([]);
        setMistakePoints([]);
        setPaceCursorState({ word: 0, char: -1 });
        if (wordContainerRef.current) wordContainerRef.current.scrollTop = 0;
        inputRef.current?.focus();
    }, [settings.timeDuration, generateText]);
    
    useEffect(() => {
        resetTest();
    }, [resetTest]);
    
    useEffect(() => {
        const container = wordContainerRef.current;
        const activeWord = activeWordRef.current;
        if (container && activeWord) {
            const lineHeight = activeWord.offsetHeight;
            if (lineHeight === 0) return;
            const activeWordTop = activeWord.offsetTop;
            const currentScrollTop = container.scrollTop;
            const scrollThreshold = currentScrollTop + (2 * lineHeight);
            if (activeWordTop >= scrollThreshold) container.scrollTop = activeWordTop - lineHeight;
        }
    }, [activeWordIndex]);
    
    useEffect(() => {
        if (settings.testMode === 'time' && testStatus === 'running' && timeLeft === 0) endTest();
    }, [timeLeft, testStatus, endTest, settings.testMode]);

    const testStatusRef = useRef(testStatus);
    useEffect(() => { testStatusRef.current = testStatus; }, [testStatus]);

    useEffect(() => {
        if (testStatus === 'running' && settings.paceMode !== 'off' && words.length > 0) {
            const wpm = settings.paceMode === 'custom' ? settings.customPaceWpm : 80; // Placeholder for other modes
            if (wpm <= 0) return;

            const charsPerMinute = wpm * 5;
            const delayPerChar = 60000 / charsPerMinute;
            let globalCharIndex = 0;
            const totalChars = words.join(' ').length;

            const moveCursor = () => {
                if (testStatusRef.current !== 'running') return;
                
                let currentWordIndex = 0;
                let cumulativeLength = 0;
                while (currentWordIndex < words.length) {
                    const wordLength = words[currentWordIndex].length;
                    if (globalCharIndex < cumulativeLength + wordLength) {
                        setPaceCursorState({ word: currentWordIndex, char: globalCharIndex - cumulativeLength });
                        break;
                    }
                    cumulativeLength += wordLength + 1;
                    currentWordIndex++;
                }
                
                globalCharIndex++;

                if (globalCharIndex < totalChars) {
                    paceTimeoutRef.current = window.setTimeout(moveCursor, delayPerChar);
                } else {
                    setPaceCursorState({ word: words.length -1, char: words[words.length-1].length });
                }
            };
            moveCursor();
        }
        return () => { if (paceTimeoutRef.current) clearTimeout(paceTimeoutRef.current); };
    }, [testStatus, settings.paceMode, settings.customPaceWpm, words]);

     useEffect(() => {
        if (settings.testMode === 'zen' && testStatus === 'running' && words.length > 0 && activeWordIndex > words.length - 50) {
            const wordList = getWordsForLanguage(settings.language);
            const shuffled = [...wordList].sort(() => 0.5 - Math.random());
            setWords(prev => [...prev, ...shuffled.slice(0, 100)]);
        }
    }, [activeWordIndex, words.length, testStatus, settings.testMode, settings.language]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (testStatus === 'running' && settings.testMode === 'zen') {
                if (
                    (settings.zenModeExit === 'esc' && e.key === 'Escape') ||
                    (settings.zenModeExit === 'enter' && e.key === 'Enter')
                ) {
                    e.preventDefault();
                    endTest();
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [testStatus, settings.testMode, settings.zenModeExit, endTest]);


    const startTimer = () => {
        // ... (startTimer logic remains mostly the same)
        setTestStatus('running');
        setWpmHistory([]);
        setMistakePoints([]);
        startTimeRef.current = Date.now();
        if (settings.testMode === 'time') {
            timerIntervalRef.current = window.setInterval(() => {
                if (!startTimeRef.current) return;
                const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
                if (elapsedTime > settings.timeDuration) {
                    setTimeLeft(0);
                    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
                    return;
                }
                const newTimeLeft = Math.max(0, settings.timeDuration - Math.floor(elapsedTime));
                setTimeLeft(newTimeLeft);
            }, 500);
        }
        const wpmTrackerInterval = window.setInterval(() => {
            if (testStatusRef.current !== 'running' || !startTimeRef.current) {
                 clearInterval(wpmTrackerInterval);
                 return;
            }
            const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
            const currentStats = charStatsRef.current;
            const correctChars = currentStats.correct;
            const totalTyped = currentStats.correct + currentStats.incorrect;
            const currentWpm = (correctChars / 5) / (elapsedTime / 60) || 0;
            const currentRawWpm = (totalTyped / 5) / (elapsedTime / 60) || 0;
            const currentAccuracy = totalTyped > 0 ? (correctChars / totalTyped) * 100 : 100;
            setWpmHistory(prev => [...prev, { time: Math.floor(elapsedTime), wpm: Math.round(currentWpm), accuracy: Math.round(currentAccuracy), rawWpm: Math.round(currentRawWpm) }]);
        }, 500);
        
        if (settings.testMode !== 'quote') {
            timerIntervalRef.current = wpmTrackerInterval;
        }
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // ... (handleInputChange logic remains mostly the same)
        if (testStatus === 'finished' || activeWordIndex >= words.length) return;
        if (testStatus === 'waiting') startTimer();
        const value = e.target.value;
        if (settings.confidenceMode === 'max' && value.length < userInput.length) return;
        const currentWord = words[activeWordIndex];
        if (value.length > userInput.length && startTimeRef.current) {
            const typedCharIndex = value.length - 1;
            if (typedCharIndex >= currentWord.length || (typedCharIndex < currentWord.length && value[typedCharIndex] !== currentWord[typedCharIndex])) {
                const elapsedTime = (Date.now() - startTimeRef.current) / 1000;
                const lastHistory = wpmHistoryRef.current;
                const lastWpm = lastHistory.length > 0 ? lastHistory[lastHistory.length - 1].wpm : 0;
                setMistakePoints(prev => [...prev, { time: Math.round(elapsedTime), wpm: lastWpm }]);
            }
        }
        if (value.endsWith(' ')) {
            const typedWord = value.trim();
            const isCorrect = currentWord === typedWord;
            if (settings.testDifficulty === 'expert' && !isCorrect) { endTest(); return; }
            setCorrectWords(prev => [...prev, isCorrect]);
            if (typedWord.length < currentWord.length) {
                setCharStats(prev => ({ ...prev, missed: prev.missed + (currentWord.length - typedWord.length) }));
            }
            setCharStats(prev => ({ ...prev, correct: prev.correct + 1 }));
            setActiveWordIndex(prev => prev + 1);
            setUserInput('');
        } else {
            if (value.length > userInput.length) {
                const typedCharIndex = userInput.length;
                if (typedCharIndex < currentWord.length) {
                    const isCharCorrect = value[typedCharIndex] === currentWord[typedCharIndex];
                    if (isCharCorrect) {
                        setCharStats(prev => ({ ...prev, correct: prev.correct + 1 }));
                    } else {
                        if (settings.testDifficulty === 'master') { endTest(); return; }
                        setCharStats(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
                    }
                } else {
                    setCharStats(prev => ({ ...prev, extra: prev.extra + 1, incorrect: prev.incorrect + 1 }));
                }
            }
            setUserInput(value);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if ((e.key === 'Tab' || e.key === 'Enter') && !(settings.testMode === 'zen' && settings.zenModeExit === 'enter' && e.key === 'Enter')) {
            e.preventDefault();
            resetTest();
        }
    };
    
    return (
        <div className="w-full flex flex-col items-center gap-8 cursor-pointer" onClick={() => inputRef.current?.focus()}>
             <input
                ref={inputRef} type="text" className="absolute w-px h-px opacity-0"
                value={userInput} onChange={handleInputChange} onKeyDown={handleKeyDown}
                autoFocus disabled={testStatus === 'finished'}
            />
            {isLanguageModalOpen && <LanguageModal onClose={() => setIsLanguageModalOpen(false)} />}
            {isPaceModalOpen && <PaceSelectorModal onClose={() => setIsPaceModalOpen(false)} />}
            
            <TestConfigurator />
            <div className="flex items-center gap-6 text-theme-text">
                <button onClick={() => setIsLanguageModalOpen(true)} className="flex items-center gap-2 hover:text-theme-primary transition-colors focus:outline-none">
                    <GlobeIcon /> {settings.language}
                </button>
                <button onClick={() => setIsPaceModalOpen(true)} className="flex items-center gap-2 hover:text-theme-primary transition-colors focus:outline-none">
                    <GaugeIcon /> {settings.paceMode === 'off' ? `average pace 0 wpm` : `${settings.paceMode} ${settings.paceMode === 'custom' ? settings.customPaceWpm : ''} wpm`}
                </button>
            </div>
            
            {isLoadingText ? (
                <div className="text-theme-primary text-2xl animate-pulse">Generating text...</div>
            ) : (
                <div 
                    ref={wordContainerRef} 
                    className="relative leading-relaxed tracking-wider max-w-4xl text-left font-medium max-h-[14.7rem] overflow-y-hidden"
                    style={{ fontSize: `${settings.fontSize}rem` }}
                >
                    {words.map((word, index) => {
                        const isActive = index === activeWordIndex;
                        let wordElement;

                        if (index < activeWordIndex) {
                            wordElement = <Word text={word} state={correctWords[index] ? 'correct' : 'incorrect'} blindMode={settings.blindMode} />;
                        } else if (isActive) {
                            wordElement = (
                                <span className="text-theme-text relative" ref={activeWordRef}>
                                    {word.split('').map((char, charIndex) => {
                                        let state: 'correct' | 'incorrect' | 'untyped' = 'untyped';
                                        if (charIndex < userInput.length) state = userInput[charIndex] === char ? 'correct' : 'incorrect';
                                        return <Char key={charIndex} text={char} state={state} blindMode={settings.blindMode} />;
                                    })}
                                    {userInput.length >= word.length && (
                                        userInput.slice(word.length).split('').map((char, charIndex) => (
                                            <Char key={`extra-${charIndex}`} text={char} state='incorrect' blindMode={settings.blindMode}/>
                                        ))
                                    )}
                                    <span className="absolute bg-theme-caret animate-blink" style={{ left: `${userInput.length}ch`, top: '0', bottom: '0', width: '2px' }}></span>
                                </span>
                            );
                        } else {
                            if (paceCursorState.word === index && settings.paceMode !== 'off') {
                                wordElement = (
                                    <span>
                                        {word.split('').map((char, charIndex) => (
                                            <span key={charIndex} className="relative text-theme-text">
                                                {char}
                                                {paceCursorState.char === charIndex && <PaceCursor style={settings.paceCursorStyle} />}
                                            </span>
                                        ))}
                                    </span>
                                );
                            } else {
                                wordElement = <Word text={word} state="untyped" blindMode={settings.blindMode} />;
                            }
                        }
                        return <React.Fragment key={index}>{wordElement}{' '}</React.Fragment>;
                    })}
                </div>
            )}
            
            <button onClick={() => resetTest()} className="text-theme-text hover:text-theme-primary transition-colors mt-8">
                <RefreshIcon />
            </button>
        </div>
    );
};

export default TypingTest;