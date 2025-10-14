import { Settings } from './contexts/SettingsContext';

export type SettingType = 'button_group' | 'toggle' | 'range' | 'text' | 'theme';

export interface SettingConfig {
    title: string;
    desc: string;
    type: SettingType;
    settingKey: keyof Settings;
    options?: string[];
}

export const settingsConfig: SettingConfig[] = [
    {
        title: 'live progress style',
        desc: 'Change the style of the timer/word count during a test.',
        type: 'button_group',
        settingKey: 'liveProgressStyle',
        options: ['off', 'bar', 'text', 'mini'],
    },
    {
        title: 'highlight mode',
        desc: 'Change what is highlighted during the test.',
        type: 'button_group',
        settingKey: 'highlightMode',
        options: ['off', 'letter', 'word', 'next word', 'next two words'],
    },
    {
        title: 'test difficulty',
        desc: 'Normal is the classic typing test experience. Expert fails the test if you submit a word with an error. Master fails if you press an incorrect key.',
        type: 'button_group',
        settingKey: 'testDifficulty',
        options: ['normal', 'expert', 'master'],
    },
    {
        title: 'theme',
        desc: 'Change the look of the website.',
        type: 'theme',
        settingKey: 'theme',
    },
    {
        title: 'quick restart',
        desc: 'Press a key to quickly restart the test.',
        type: 'button_group',
        settingKey: 'quickRestart',
        options: ['off', 'tab', 'esc', 'enter'],
    },
    {
        title: 'zen mode exit',
        desc: 'Press a key to end the test in zen mode.',
        type: 'button_group',
        settingKey: 'zenModeExit',
        options: ['esc', 'enter'],
    },
    {
        title: 'blind mode',
        desc: 'No errors or incorrect words are highlighted. Helps you to focus on raw speed.',
        type: 'toggle',
        settingKey: 'blindMode',
    },
    {
        title: 'stop on error',
        desc: 'Letter mode will stop input when pressing any incorrect letters. Word mode will not allow you to continue to the next word until you correct all mistakes.',
        type: 'button_group',
        settingKey: 'stopOnError',
        options: ['off', 'word', 'letter'],
    },
    {
        title: 'confidence mode',
        desc: 'When enabled, you will not be able to go back to previous words to fix mistakes. When turned up to the max, you won\'t be able to backspace at all.',
        type: 'button_group',
        settingKey: 'confidenceMode',
        options: ['off', 'on', 'max'],
    },
    {
        title: 'play sound on click',
        desc: 'Plays a short sound when you press a key.',
        type: 'button_group',
        settingKey: 'soundOnClick',
        options: ['off', 'click', 'beep', 'typewriter'],
    },
    {
        title: 'play sound on error',
        desc: 'Plays a short sound if you press an incorrect key.',
        type: 'button_group',
        settingKey: 'soundOnError',
        options: ['off', 'damage', 'square'],
    },
    {
        title: 'smooth caret',
        desc: 'The caret will move smoothly between letters and words.',
        type: 'button_group',
        settingKey: 'smoothCaret',
        options: ['off', 'slow', 'medium', 'fast'],
    },
    {
        title: 'caret style',
        desc: 'Change the style of the caret during the test.',
        type: 'button_group',
        settingKey: 'caretStyle',
        options: ['off', '|', 'block', '_'],
    },
    {
        title: 'pace caret style',
        desc: 'Change the style of the pace caret.',
        type: 'button_group',
        settingKey: 'paceCursorStyle',
        options: ['underline', 'bar'],
    },
];
