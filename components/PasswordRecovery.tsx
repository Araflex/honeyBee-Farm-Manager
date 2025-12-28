
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, Key, CheckCircle, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';

enum Step {
  EMAIL = 0,
  CODE = 1,
  NEW_PASSWORD = 2,
  SUCCESS = 3
}

const PasswordRecovery = () => {
  const { recoverPassword } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(Step.EMAIL);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
        setIsLoading(false);
        setStep(Step.CODE);
    }, 1000);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate code verification
    setTimeout(() => {
        setIsLoading(false);
        if (code === '123456') {
            setStep(Step.NEW_PASSWORD);
        } else {
            alert("Invalid code. For demo, use 123456");
        }
    }, 800);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      await recoverPassword(email, newPassword);
      setIsLoading(false);
      setStep(Step.SUCCESS);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 animate-fade-in">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-amber-600 mb-6 transition-colors">
            <ArrowLeft size={16} /> {t('recovery.back')}
        </Link>

        {step === Step.EMAIL && (
            <form onSubmit={handleSendCode}>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{t('recovery.reset_title')}</h1>
                <p className="text-slate-500 mb-6 text-sm">{t('recovery.enter_email')}</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('profile.email')}</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-amber-600 text-white font-bold py-2.5 rounded-lg hover:bg-amber-700 transition-colors flex justify-center items-center gap-2">
                        {isLoading ? t('recovery.sending') : <><Send size={18} /> {t('recovery.send_code')}</>}
                    </button>
                </div>
            </form>
        )}

        {step === Step.CODE && (
            <form onSubmit={handleVerifyCode}>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{t('recovery.check_email')}</h1>
                <p className="text-slate-500 mb-6 text-sm">{t('recovery.code_sent')} <span className="font-semibold text-slate-800">{email}</span>. (Demo: 123456)</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">Verification Code</label>
                        <input
                            type="text"
                            required
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2.5 text-center text-2xl tracking-widest text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                            placeholder="000000"
                        />
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-amber-600 text-white font-bold py-2.5 rounded-lg hover:bg-amber-700 transition-colors">
                        {isLoading ? t('recovery.verifying') : t('recovery.verify_code')}
                    </button>
                </div>
            </form>
        )}

        {step === Step.NEW_PASSWORD && (
            <form onSubmit={handleResetPassword}>
                <h1 className="text-2xl font-bold text-slate-800 mb-2">{t('recovery.set_new_pass')}</h1>
                <p className="text-slate-500 mb-6 text-sm">{t('recovery.choose_pass')}</p>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-1">{t('recovery.new_pass')}</label>
                        <div className="relative">
                            <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                required
                                minLength={6}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>
                    <button type="submit" disabled={isLoading} className="w-full bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 transition-colors">
                         {isLoading ? t('recovery.saving') : t('recovery.reset_title')}
                    </button>
                </div>
            </form>
        )}

        {step === Step.SUCCESS && (
            <div className="text-center py-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{t('recovery.success_title')}</h2>
                <p className="text-slate-500 mb-6">{t('recovery.success_msg')}</p>
                <button 
                    onClick={() => navigate('/login')}
                    className="w-full bg-amber-600 text-white font-bold py-2.5 rounded-lg hover:bg-amber-700 transition-colors"
                >
                    {t('recovery.back_login')}
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default PasswordRecovery;
