import React, { useState, useContext, useEffect, useMemo } from 'react';
import { SettingsContext, Settings } from '../contexts/SettingsContext';
import { themes, Theme } from '../themes';
import { settingsConfig, SettingConfig } from '../settingsConfig';

interface MiniSettingsProps {
    isOpen: boolean;
    onClose: () => void;
}

const MiniSettings: React.FC<MiniSettingsProps> = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const { settings, setSettings } = useContext(SettingsContext);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    const filteredSettings = useMemo(() => {
        if (!searchTerm) {
            return settingsConfig;
        }
        return settingsConfig.filter(setting =>
            setting.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    const handleOptionClick = (settingKey: keyof Settings, value: any) => {
        setSettings(prev => ({ ...prev, [settingKey]: value }));
    };

    const renderSetting = (setting: SettingConfig) => {
        switch (setting.type) {
            case 'button_group':
                return (
                    <div key={setting.settingKey} className="p-2">
                        <h4 className="text-lg text-theme-primary">{setting.title}</h4>
                        <p className="text-sm text-theme-text mb-2">{setting.desc}</p>
                        <div className="flex flex-wrap gap-2">
                            {setting.options?.map(option => (
                                <button
                                    key={option}
                                    onClick={() => handleOptionClick(setting.settingKey, option)}
                                    className={`px-4 py-2 rounded transition-colors text-sm ${
                                        settings[setting.settingKey] === option
                                            ? 'bg-theme-primary text-theme-bg'
                                            : 'bg-theme-secondary hover:bg-theme-primary-dark text-theme-text'
                                    }`}>
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'toggle':
                return (
                    <div key={setting.settingKey} className="p-2">
                        <h4 className="text-lg text-theme-primary">{setting.title}</h4>
                        <p className="text-sm text-theme-text mb-2">{setting.desc}</p>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => handleOptionClick(setting.settingKey, false)}
                                className={`px-4 py-2 rounded transition-colors text-sm ${
                                    !settings[setting.settingKey] ? 'bg-theme-primary text-theme-bg' : 'bg-theme-secondary hover:bg-theme-primary-dark text-theme-text'
                                }`}>
                                off
                            </button>
                            <button
                                onClick={() => handleOptionClick(setting.settingKey, true)}
                                className={`px-4 py-2 rounded transition-colors text-sm ${
                                    settings[setting.settingKey] ? 'bg-theme-primary text-theme-bg' : 'bg-theme-secondary hover:bg-theme-primary-dark text-theme-text'
                                }`}>
                                on
                            </button>
                        </div>
                    </div>
                )
            case 'theme':
                return (
                    <div key={setting.settingKey} className="p-2">
                        <h4 className="text-lg text-theme-primary">{setting.title}</h4>
                        <p className="text-sm text-theme-text mb-2">{setting.desc}</p>
                        <ul>
                            {Object.values(themes).map(theme => (
                                <li key={theme.name} onClick={() => handleOptionClick(setting.settingKey, theme.name)} className="cursor-pointer p-2 hover:bg-theme-secondary rounded-md flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: theme.primary }}></div>
                                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: theme.text }}></div>
                                        <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: theme.bg }}></div>
                                    </div>
                                    <span>{theme.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )
            default:
                return null;
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-theme-bg p-4 rounded-lg shadow-lg w-full max-w-md">
                <input
                    type="text"
                    placeholder="Search settings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2 mb-4 bg-theme-secondary text-theme-text rounded-md focus:outline-none focus:ring-2 focus:ring-theme-primary"
                />
                <div className="max-h-60 overflow-y-auto">
                    {filteredSettings.map(setting => renderSetting(setting))}
                </div>
            </div>
        </div>
    );
};

export default MiniSettings;
