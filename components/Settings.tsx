import React, { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';

type StringOptions = 'normal' | 'expert' | 'master' | 'off' | 'tab' | 'esc' | 'enter' | 'word' | 'letter' | 'on' | 'max' | 'click' | 'beep' | 'typewriter' | 'damage' | 'square' | 'slow' | 'medium' | 'fast' | '|' | 'block' | '_' | 'bar' | 'text' | 'mini' | 'next word' | 'next two words';

// A generic component to represent a group of buttons for a setting
const SettingButtonGroup = <T extends string>({ options, activeOption, onOptionClick }: { options: T[]; activeOption: T; onOptionClick: (option: T) => void; }) => (
    <>
        {options.map((option) => (
            <SettingButton key={option} active={activeOption === option} onClick={() => onOptionClick(option)}>
                {option}
            </SettingButton>
        ))}
    </>
);

const SettingToggle: React.FC<{ value: boolean; onToggle: (value: boolean) => void; }> = ({ value, onToggle }) => (
     <>
        <SettingButton active={!value} onClick={() => onToggle(false)}>off</SettingButton>
        <SettingButton active={value} onClick={() => onToggle(true)}>on</SettingButton>
    </>
);

const SettingsSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="flex flex-col gap-2 mt-8">
        <h3 className="text-xl text-theme-primary-dark font-bold tracking-widest flex items-center gap-2 mb-2">
            <span className="text-theme-primary">v</span> {title}
        </h3>
        <div className="border-l-2 border-theme-secondary pl-6 flex flex-col gap-2">
            {children}
        </div>
    </div>
);

const SettingRow: React.FC<{ title: string; desc: string; children: React.ReactNode, fullWidth?: boolean }> = ({ title, desc, children, fullWidth = false }) => (
    <div className="flex flex-col md:flex-row justify-between md:items-center py-4 border-b border-theme-secondary/50 gap-4">
        <div className={fullWidth ? 'w-full' : 'md:w-1/2'}>
            <h4 className="text-lg text-theme-primary">{title}</h4>
            <p className="text-sm text-theme-text">{desc}</p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
            {children}
        </div>
    </div>
);

const SettingButton: React.FC<{ children: React.ReactNode; active?: boolean; onClick?: () => void; className?: string }> = ({ children, active, onClick, className }) => (
    <button onClick={onClick} className={`px-4 py-2 rounded transition-colors text-sm ${active ? 'bg-theme-primary text-theme-bg' : 'bg-theme-secondary hover:bg-theme-primary-dark text-theme-text'} ${className}`}>
        {children}
    </button>
);

const fonts = [
    "'Roboto Mono', monospace",
    "'Atkinson Hyperlegible', sans-serif",
    "'Comfortaa', sans-serif",
    "'Coming Soon', cursive",
    "'Courier Prime', monospace",
    "'Fira Code', monospace",
    "'IBM Plex Mono', monospace",
    "'IBM Plex Sans', sans-serif",
    "'Inconsolata', monospace",
    "'JetBrains Mono', monospace",
    "'Kanit', sans-serif",
    "'Lato', sans-serif",
    "'Lexend Deca', sans-serif",
    "'Overpass Mono', monospace",
    "'Montserrat', sans-serif",
    "'Noto Naskh Arabic', serif",
    "'Nunito', sans-serif",
    "'Oxygen', sans-serif",
    "'Roboto', sans-serif",
    "'Sarabun', sans-serif",
    "'Source Code Pro', monospace",
    "'Titillium Web', sans-serif",
    "'Ubuntu', sans-serif",
    "Custom"
];
const themes = ["dino", "magic girl", "milkshake", "modern ink", "soaring skies", "rainbow trail", "nord light", "solarized light", "paper", "desert oasis", "iceberg light", "cheesecake", "9009", "lil dragon", "blueberry light", "witch girl", "terra", "godspeed", "dollar", "dmg", "modern dolch light", "repose light", "olive", "taro", "shoko", "beach", "breeze", "peaches", "mizu", "pink lemonade", "vaporwave", "frozen llama", "mizu", "rosé pine", "creamsicle", "lavender", "bingus", "café", "fleuriste", "mecha", "iv clover", "botanical", "lime", "alpine", "dualshot", "leather", "our theme", "ez_mode", "evil eye", "menthol", "comfy", "trackday", "muted", "red samurai", "sweden", "grand prix", "suisse", "hedge", "retrocast", "sewing tin", "bento", "8008", "matcha mocha", "fledgling", "onedark", "copper", "repose dark", "rose pine moon", "blueberry dark", "oblivion", "watermelon", "carbon", "future funk", "mint", "sonokai", "laser", "viridescent", "dracula", "bushido", "modern dolch", "superuser", "rudy", "nebula", "peach blossom", "80s after dark", "github", "luna", "blue dolphin", "gruvbox dark", "purpleish", "bliss", "catppuccin", "wavez", "earthsong", "monokai", "nautilus", "dev", "horizon", "night runner", "sunset", "moonlight", "lightas", "phantom", "dark note", "drowning", "alduin", "olivia", "iceberg dark", "metropolis", "dark magic girl", "cyberspace", "terminal", "solarized dark", "chaos theory", "joker", "dots", "everblush", "miami nights", "aether", "pulse", "anti hero", "ryujinscales", "floret", "terror below", "tron orange", "aurora", "red dragon", "dark", "mountain", "vesper", "voc", "midnight", "arch", "incognito", "solarized osaka", "iv spade", "hammerhead", "fire", "stealth", "husqy", "matrix", "horse", "shadow" ];

const Settings: React.FC = () => {
    const { settings, setSettings } = useContext(SettingsContext);
    
    return (
        <div className="w-full max-w-5xl flex flex-col gap-4 text-theme-text pb-16">
            <h2 className="text-3xl text-theme-primary font-bold text-center tracking-widest">Settings</h2>
            
            <SettingsSection title="appearance">
                <SettingRow title="live progress style" desc="Change the style of the timer/word count during a test.">
                     <SettingButtonGroup options={['off', 'bar', 'text', 'mini']} activeOption={settings.liveProgressStyle} onOptionClick={option => setSettings(s => ({ ...s, liveProgressStyle: option }))} />
                </SettingRow>
                <SettingRow title="highlight mode" desc="Change what is highlighted during the test.">
                    <SettingButtonGroup options={['off', 'letter', 'word', 'next word', 'next two words']} activeOption={settings.highlightMode} onOptionClick={option => setSettings(s => ({ ...s, highlightMode: option }))} />
                </SettingRow>
                <SettingRow title="font size" desc="Change the font size of the test words.">
                    <input type="range" min="1.5" max="3.5" step="0.1" value={settings.fontSize} onChange={e => setSettings(s => ({...s, fontSize: parseFloat(e.target.value)}))} className="w-48 accent-theme-primary" />
                    <span className='ml-2 w-12 text-center'>{settings.fontSize.toFixed(1)}rem</span>
                </SettingRow>
                 <SettingRow title="font family" desc="Change the font family used by the website." fullWidth>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full">
                       {fonts.map(f => <SettingButton key={f} active={settings.fontFamily === f} onClick={() => setSettings(s => ({...s, fontFamily: f}))}>{f.split(',')[0].replace(/'/g, '')}</SettingButton>)}
                    </div>
                </SettingRow>
            </SettingsSection>

            <SettingsSection title="theme">
                 <SettingRow title="theme" desc="Change the look of the website." fullWidth>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2 w-full">
                       {themes.map(t => <SettingButton key={t} active={settings.theme === t} onClick={() => setSettings(s => ({...s, theme: t}))} className="capitalize">{t}</SettingButton>)}
                    </div>
                </SettingRow>
            </SettingsSection>

            <SettingsSection title="behavior">
                 <SettingRow title="test difficulty" desc="Normal is the classic typing test experience. Expert fails the test if you submit a word with an error. Master fails if you press an incorrect key.">
                    <SettingButtonGroup options={['normal', 'expert', 'master']} activeOption={settings.testDifficulty} onOptionClick={option => setSettings(s => ({ ...s, testDifficulty: option }))} />
                </SettingRow>
                <SettingRow title="quick restart" desc="Press a key to quickly restart the test.">
                    <SettingButtonGroup options={['off', 'tab', 'esc', 'enter']} activeOption={settings.quickRestart} onOptionClick={option => setSettings(s => ({ ...s, quickRestart: option }))} />
                </SettingRow>
                <SettingRow title="mini settings key" desc="Set the key to open the mini settings popup.">
                    <input
                        type="text"
                        value={settings.miniSettingsKey}
                        onKeyDown={(e) => {
                            e.preventDefault();
                            setSettings(s => ({ ...s, miniSettingsKey: e.key }));
                        }}
                        className="w-24 p-2 bg-theme-secondary text-theme-text rounded-md text-center"
                        readOnly
                    />
                </SettingRow>
                 <SettingRow title="zen mode exit" desc="Press a key to end the test in zen mode.">
                    <SettingButtonGroup options={['esc', 'enter']} activeOption={settings.zenModeExit} onOptionClick={option => setSettings(s => ({ ...s, zenModeExit: option }))} />
                </SettingRow>
                <SettingRow title="blind mode" desc="No errors or incorrect words are highlighted. Helps you to focus on raw speed.">
                    <SettingToggle value={settings.blindMode} onToggle={val => setSettings(s => ({...s, blindMode: val}))} />
                </SettingRow>
            </SettingsSection>
            
            <SettingsSection title="input">
                <SettingRow title="stop on error" desc="Letter mode will stop input when pressing any incorrect letters. Word mode will not allow you to continue to the next word until you correct all mistakes.">
                    <SettingButtonGroup options={['off', 'word', 'letter']} activeOption={settings.stopOnError} onOptionClick={option => setSettings(s => ({ ...s, stopOnError: option }))} />
                </SettingRow>
                <SettingRow title="confidence mode" desc="When enabled, you will not be able to go back to previous words to fix mistakes. When turned up to the max, you won't be able to backspace at all.">
                    <SettingButtonGroup options={['off', 'on', 'max']} activeOption={settings.confidenceMode} onOptionClick={option => setSettings(s => ({ ...s, confidenceMode: option }))} />
                </SettingRow>
            </SettingsSection>

            <SettingsSection title="sound">
                 <SettingRow title="sound volume" desc="Change the volume of the sound effects.">
                    <input type="range" min="0" max="1" step="0.1" value={settings.soundVolume} onChange={e => setSettings(s => ({ ...s, soundVolume: parseFloat(e.target.value) }))} className="w-48 accent-theme-primary" />
                 </SettingRow>
                <SettingRow title="play sound on click" desc="Plays a short sound when you press a key.">
                     <SettingButtonGroup options={['off', 'click', 'beep', 'typewriter']} activeOption={settings.soundOnClick} onOptionClick={option => setSettings(s => ({ ...s, soundOnClick: option }))} />
                </SettingRow>
                <SettingRow title="play sound on error" desc="Plays a short sound if you press an incorrect key.">
                    <SettingButtonGroup options={['off', 'damage', 'square']} activeOption={settings.soundOnError} onOptionClick={option => setSettings(s => ({ ...s, soundOnError: option }))} />
                {/* FIX: Corrected closing tag from </Row> to </SettingRow> */}
                </SettingRow>
            </SettingsSection>

            <SettingsSection title="caret">
                 <SettingRow title="smooth caret" desc="The caret will move smoothly between letters and words.">
                    <SettingButtonGroup options={['off', 'slow', 'medium', 'fast']} activeOption={settings.smoothCaret} onOptionClick={option => setSettings(s => ({...s, smoothCaret: option}))} />
                </SettingRow>
                <SettingRow title="caret style" desc="Change the style of the caret during the test.">
                    <SettingButton active={settings.caretStyle === 'off'} onClick={() => setSettings(s => ({...s, caretStyle: 'off'}))}>off</SettingButton>
                    <SettingButton active={settings.caretStyle === '|'} onClick={() => setSettings(s => ({...s, caretStyle: '|'}))} className="font-mono text-xl">|</SettingButton>
                    <SettingButton active={settings.caretStyle === 'block'} onClick={() => setSettings(s => ({...s, caretStyle: 'block'}))} className="w-6 h-6 bg-theme-primary">{null}</SettingButton>
                    <SettingButton active={settings.caretStyle === '_'} onClick={() => setSettings(s => ({...s, caretStyle: '_'}))} className="font-mono text-xl">_</SettingButton>
                </SettingRow>
                <SettingRow title="pace caret style" desc="Change the style of the pace caret.">
                    <SettingButtonGroup options={['underline', 'bar']} activeOption={settings.paceCursorStyle} onOptionClick={option => setSettings(s => ({ ...s, paceCursorStyle: option }))} />
                </SettingRow>
            </SettingsSection>

            <SettingsSection title="danger zone">
                <SettingRow title="import/export settings" desc="Import or export the settings as JSON.">
                    <SettingButton>import</SettingButton>
                    <SettingButton>export</SettingButton>
                </SettingRow>
                <SettingRow title="reset settings" desc="Resets settings to the default (but doesn't touch your tags and presets). You can't undo this action!">
                    <button className="px-4 py-2 rounded bg-theme-error/80 text-white hover:bg-theme-error transition-colors">reset settings</button>
                </SettingRow>
            </SettingsSection>
        </div>
    );
};

export default Settings;