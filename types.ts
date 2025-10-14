// FIX: Removed erroneous self-import of 'View'.
export enum View {
    TypingTest,
    Results,
    Leaderboard,
    Profile,
    Settings,
    Auth,
    Achievements
}

export interface TestResult {
    wpm: number;
    rawWpm: number;
    accuracy: number;
    consistency: number;
    charStats: {
        correct: number;
        incorrect: number;
        extra: number;
        missed: number;
    };
    wpmHistory: { time: number; wpm: number; accuracy: number; rawWpm: number }[];
    mistakePoints: { time: number; wpm: number }[];
    
    // For leaderboard filtering
    testMode: 'time' | 'words' | 'quote' | 'zen';
    timeDuration: number;
    wordCount: number;
    quoteLength: 'short' | 'medium' | 'long' | 'all';
    includePunctuation: boolean;
    includeNumbers: boolean;
}

export interface LeaderboardEntry extends TestResult {
    name: string;
    date: string; // ISO date string
}