import React, { useState, useContext, useEffect } from 'react';
import { SettingsContext, Settings } from '../contexts/SettingsContext';

interface PaceSelectorModalProps {
    onClose: () => void;
}

type PaceMode = Settings['paceMode'];

const PaceSelectorModal: React.FC<PaceSelectorModalProps> = ({ onClose }) => {
    const { settings, setSettings } = useContext(SettingsContext);
    const [localPaceMode, setLocalPaceMode] = useState<PaceMode>(settings.paceMode);
    const [localCustomWpm, setLocalCustomWpm] = useState(settings.customPaceWpm);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const handleSave = () => {
        setSettings(s => ({
            ...s,
            paceMode: localPaceMode,
            customPaceWpm: localPaceMode === 'custom' ? Number(localCustomWpm) : s.customPaceWpm,
        }));
        onClose();
    };

    const OptionButton: React.FC<{ mode: PaceMode, children: React.ReactNode }> = ({ mode, children }) => (
        <button 
            onClick={() => setLocalPaceMode(mode)}
            className={`px-4 py-2 rounded transition-colors text-lg flex-1 ${localPaceMode === mode ? 'bg-theme-primary text-theme-bg' : 'bg-theme-secondary hover:bg-theme-primary-dark text-theme-text'}`}
        >
            {children}
        </button>
    );

    return (
        <div className="fixed inset-0 bg-theme-bg/80 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-theme-secondary/80 rounded-lg shadow-xl w-full max-w-sm flex flex-col p-6 gap-6" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-2xl text-theme-primary text-center font-bold">Pace Cursor</h3>
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <OptionButton mode="off">off</OptionButton>
                        <OptionButton mode="average">average</OptionButton>
                    </div>
                    <div className="flex gap-3">
                        <OptionButton mode="highest">highest</OptionButton>
                        <OptionButton mode="last">last</OptionButton>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <OptionButton mode="custom">custom</OptionButton>
                    {localPaceMode === 'custom' && (
                        <input
                            type="number"
                            value={localCustomWpm}
                            onChange={e => setLocalCustomWpm(Number(e.target.value))}
                            className="mt-2 w-full bg-theme-bg p-3 text-theme-primary placeholder-theme-text/50 focus:outline-none focus:ring-2 focus:ring-theme-primary transition-all rounded text-center text-xl"
                            autoFocus
                        />
                    )}
                </div>
                <button onClick={handleSave} className="bg-theme-primary text-theme-bg p-3 rounded hover:bg-theme-primary-dark transition-colors text-xl">
                    Save
                </button>
            </div>
        </div>
    );
};

export default PaceSelectorModal;
