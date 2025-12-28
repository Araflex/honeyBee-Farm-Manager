
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

const Login = () => {
  const { login } = useApp();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = await login(email, password);
    
    setIsLoading(false);
    if (success) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8 bg-amber-900 text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                <Hexagon size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white">{t('login.title')}</h1>
            <p className="text-amber-200 text-sm">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
                <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">{t('login.email')}</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    placeholder="admin@honeyfarm.com"
                />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">{t('login.password')}</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all"
                    placeholder="••••••••"
                />
            </div>
          </div>

          <div className="flex justify-end">
             <Link to="/forgot-password" className="text-sm font-medium text-amber-600 hover:text-amber-800">
                {t('login.forgot')}
             </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : t('login.submit')}
          </button>
        </form>

        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
            <p className="text-xs text-slate-500">
                Demo Accounts:<br/>
                Admin: admin@honeyfarm.com / admin<br/>
                User: bob@honeyfarm.com / user
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
