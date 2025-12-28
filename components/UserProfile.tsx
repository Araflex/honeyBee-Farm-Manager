
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { User, Save, Shield, Mail, Phone, Lock, Palette } from 'lucide-react';
import { Theme } from '../types';

const UserProfile = () => {
  const { currentUser, updateUser } = useApp();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    name: currentUser.name,
    email: currentUser.email || '',
    phone: currentUser.phone || '',
    password: currentUser.password || '',
    theme: currentUser.theme || 'standard' as Theme
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
        <div>
            <h1 className="text-3xl font-bold text-[var(--color-primary)]">{t('profile.title')}</h1>
            <p className="text-[var(--color-text-muted)]">{t('profile.subtitle')}</p>
        </div>

        <div className="bg-[var(--color-surface)] rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] text-white flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                    {currentUser.name.charAt(0)}
                </div>
                <div>
                    <h2 className="text-2xl font-bold">{currentUser.name}</h2>
                    <div className="flex items-center gap-2 opacity-90">
                        <Shield size={16} />
                        <span className="uppercase text-sm font-semibold tracking-wider">{currentUser.role}</span>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                
                {/* Theme Selection */}
                <div className="space-y-2 pb-4 border-b border-[var(--color-border)]">
                    <label className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                        <Palette size={16} className="text-[var(--color-text-muted)]" /> Sistema de Tema
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                        {(['standard', 'light', 'dark'] as Theme[]).map((themeOption) => (
                            <button
                                key={themeOption}
                                type="button"
                                onClick={() => setFormData({...formData, theme: themeOption})}
                                className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all
                                    ${formData.theme === themeOption 
                                        ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white' 
                                        : 'border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-text)] hover:border-[var(--color-primary-hover)]'
                                    }`}
                            >
                                {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                            <User size={16} className="text-[var(--color-text-muted)]" /> {t('profile.full_name')}
                        </label>
                        <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                            <Mail size={16} className="text-[var(--color-text-muted)]" /> {t('profile.email')}
                        </label>
                        <input 
                            type="email" 
                            required
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                            <Phone size={16} className="text-[var(--color-text-muted)]" /> {t('profile.phone')}
                        </label>
                        <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={e => setFormData({...formData, phone: e.target.value})}
                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                            placeholder="+1 (555) 000-0000"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-[var(--color-text)] flex items-center gap-2">
                            <Lock size={16} className="text-[var(--color-text-muted)]" /> {t('profile.password')}
                        </label>
                        <input 
                            type="password" 
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full bg-[var(--color-background)] border border-[var(--color-border)] rounded-lg px-4 py-2 text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
                    <p className="text-sm text-[var(--color-text-muted)] italic">
                        {isSaved ? t('profile.changes_saved') : t('profile.local_session')}
                    </p>
                    <button 
                        type="submit" 
                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all transform active:scale-95
                            ${isSaved ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-md hover:shadow-lg'}`}
                    >
                        <Save size={18} /> {isSaved ? t('profile.saved') : t('profile.save_changes')}
                    </button>
                </div>
            </form>
        </div>
    </div>
  );
};

export default UserProfile;
