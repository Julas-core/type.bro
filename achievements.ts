export interface Achievement {
    id: string;
    title: string;
    description: string;
    tiers: number[];
    progress: (stats: UserStats) => number;
}

export interface UserStats {
    testsCompleted: number;
    highestWpm: number;
    averageWpm: number;
    averageAcc: number;
    dailyStreak: number;
    totalKeystrokes: number;
}

export const achievements: Achievement[] = [
    {
        id: 'wpm',
        title: 'Speed Demon',
        description: 'Reach a certain WPM in a test.',
        tiers: [50, 75, 100, 125, 150, 175, 200],
        progress: (stats) => stats.highestWpm,
    },
    {
        id: 'accuracy',
        title: 'Accuracy Master',
        description: 'Achieve a certain accuracy in a test.',
        tiers: [95, 98, 99, 100],
        progress: (stats) => stats.averageAcc,
    },
    {
        id: 'testsCompleted',
        title: 'Keyboard Warrior',
        description: 'Complete a certain number of tests.',
        tiers: [10, 50, 100, 250, 500, 1000, 2500, 5000],
        progress: (stats) => stats.testsCompleted,
    },
    {
        id: 'dailyStreak',
        title: 'Consistent Coder',
        description: 'Maintain a daily streak of completing at least one test.',
        tiers: [3, 7, 14, 30, 60, 100, 365],
        progress: (stats) => stats.dailyStreak,
    },
];
