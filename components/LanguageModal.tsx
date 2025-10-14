import React, { useState, useContext, useEffect, useRef } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
import { LANGUAGES } from '../languages';

interface LanguageModalProps {
    onClose: () => void;
}

const LanguageModal: React.FC<LanguageModalProps> = ({ onClose }) => {
    const { settings, setSettings } = useContext(SettingsContext);
    const [searchTerm, setSearchTerm] = useState('');
    const modalRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
        
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSelectLanguage = (lang: string) => {
        setSettings(s => ({ ...s, language: lang }));
        onClose();
    };
    
    const filteredLanguages = LANGUAGES.filter(lang => lang.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div 
            className="fixed inset-0 bg-theme-bg/80 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={onClose}
        >
            <div 
                ref={modalRef}
                className="bg-theme-secondary/80 rounded-lg shadow-xl w-full max-w-md flex flex-col p-4 gap-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Language..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-theme-bg p-3 text-theme-primary placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all rounded"
                    />
                </div>
                <ul className="max-h-96 overflow-y-auto flex flex-col gap-1">
                    {filteredLanguages.map(lang => (
                        <li key={lang}>
                            <button
                                onClick={() => handleSelectLanguage(lang)}
                                className={`w-full text-left p-3 rounded transition-colors text-lg ${
                                    settings.language === lang 
                                    ? 'bg-theme-primary text-theme-bg' 
                                    : 'text-theme-text hover:bg-theme-primary-dark/50'
                                }`}
                            >
                                {lang}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default LanguageModal;
