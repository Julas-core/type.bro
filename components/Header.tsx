
import React from 'react';
import { View } from '../types';
import { CrownIcon, SettingsIcon, UserIcon, KeyboardIcon, LogoIcon, LoginIcon } from './Icons';

interface HeaderProps {
    setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ setView }) => {
    const NavButton: React.FC<{ view: View, children: React.ReactNode }> = ({ view, children }) => (
        <button onClick={() => setView(view)} className="text-theme-text group flex items-center gap-2 transition-colors hover:text-theme-primary focus:text-theme-primary focus:outline-none">
            {children}
        </button>
    );
    
    return (
        <header className="w-full max-w-6xl flex justify-between items-center text-theme-text">
            <div className="flex items-center gap-4">
                 <button onClick={() => setView(View.TypingTest)} className="group focus:outline-none flex items-center">
                    <div style={{
                    backgroundColor: 'var(--primary-color)',
                    mask: 'url(/Type.bro.svg) no-repeat center / contain',
                    WebkitMask: 'url(/Type.bro.svg) no-repeat center / contain',
                    width: '150px',
                    height: '150px'
                }} />
                </button>
                <nav className="hidden md:flex items-center gap-4">
                     <NavButton view={View.TypingTest}><KeyboardIcon /></NavButton>
                     <NavButton view={View.Leaderboard}><CrownIcon /></NavButton>
                     <NavButton view={View.Profile}><UserIcon /></NavButton>
                </nav>
            </div>
            <div className="flex items-center gap-4">
                <NavButton view={View.Settings}><SettingsIcon /></NavButton>
                <NavButton view={View.Auth}><LoginIcon /></NavButton>
            </div>
        </header>
    );
};

export default Header;
