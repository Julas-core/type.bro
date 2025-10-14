
import React from 'react';
import { GithubIcon } from './Icons';

const Footer: React.FC = () => {
    const Key: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <span className="bg-theme-secondary text-theme-primary px-2 py-1 rounded">{children}</span>
    );

    return (
        <footer className="w-full max-w-6xl flex flex-col items-center gap-4 text-theme-text mt-8">
            <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
                <div className="flex items-center gap-2">
                    <Key>tab</Key> + <Key>enter</Key> <span className="ml-1">- restart test</span>
                </div>
                <div className="flex items-center gap-2">
                    <Key>esc</Key> or <Key>ctrl</Key>+<Key>shift</Key>+<Key>p</Key> <span className="ml-1">- command line</span>
                </div>
            </div>
             <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm mt-4">
                <a href="#" className="hover:text-theme-primary transition-colors">contact</a>
                <a href="#" className="hover:text-theme-primary transition-colors">support</a>
                <a href="#" className="hover:text-theme-primary transition-colors flex items-center gap-1"><GithubIcon className="w-4 h-4" /> github</a>
                <a href="#" className="hover:text-theme-primary transition-colors">discord</a>
                <a href="#" className="hover:text-theme-primary transition-colors">twitter</a>
                <a href="#" className="hover:text-theme-primary transition-colors">terms</a>
                <a href="#" className="hover:text-theme-primary transition-colors">privacy</a>
            </div>
        </footer>
    );
};

export default Footer;
