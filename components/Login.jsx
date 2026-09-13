import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, Link } from 'react-router-dom';
import { Hexagon, Lock, Mail, AlertCircle, Loader2, Server } from 'lucide-react';
import { API_BASE_URL } from '../services/api';
const Login = () => {
    const { login } = useApp();
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showApiDetails, setShowApiDetails] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const result = await login(email, password);
        setIsLoading(false);
        if (result.success) {
            navigate('/');
        }
        else {
            setError(result.error || 'Error de autenticación. Verifique sus credenciales.');
        }
    };
    const setDemoCredentials = (u, p) => {
        setEmail(u);
        setPassword(p);
        setError('');
    };
    return (<div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-8 bg-amber-900 text-center">
            <div className="w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-lg">
                <Hexagon size={32}/>
            </div>
            <h1 className="text-2xl font-bold text-white">{t('login.title')}</h1>
            <p className="text-amber-200 text-sm">{t('login.subtitle')}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Badge del estado de la API */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-medium">API Auth:</span>
              <code className="text-amber-800 font-mono text-[11px] bg-amber-50 px-1 py-0.5 rounded">POST /auth/login</code>
            </div>
            <button type="button" onClick={() => setShowApiDetails(!showApiDetails)} className="text-amber-700 hover:text-amber-900 font-semibold underline text-[11px]">
              {showApiDetails ? 'Ocultar' : 'Config'}
            </button>
          </div>

          {showApiDetails && (<div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-amber-950">
                <Server size={14}/> Configuración de Endpoint
              </div>
              <p className="text-slate-600">
                Base URL: <code className="font-mono bg-white px-1 py-0.5 rounded border border-amber-200">{API_BASE_URL}</code>
              </p>
              <p className="text-slate-500 text-[11px]">
                Configurable en variable de entorno <code className="font-mono">VITE_API_URL</code>. Si el backend no responde, se usa fallback local para pruebas.
              </p>
            </div>)}

          {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-2 text-sm">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0"/> 
                <span>{error}</span>
            </div>)}

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">{t('login.email')}</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input type="text" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm" placeholder="admin@honeyfarm.com"/>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-semibold text-slate-700">{t('login.password')}</label>
            <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2.5 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all text-sm" placeholder="••••••••"/>
            </div>
          </div>

          <div className="flex justify-end">
             <Link to="/forgot-password" className="text-sm font-medium text-amber-600 hover:text-amber-800">
                {t('login.forgot')}
             </Link>
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer">
            {isLoading ? (<>
                <Loader2 className="animate-spin" size={20}/>
                <span>Consultando API...</span>
              </>) : (t('login.submit'))}
          </button>
        </form>

        <div className="bg-slate-50 p-4 border-t border-slate-100">
            <p className="text-xs font-medium text-slate-500 mb-2 text-center">
                Cuentas de prueba rápida:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => setDemoCredentials('admin@honeyfarm.com', 'admin')} className="text-xs bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 py-1.5 px-2 rounded text-slate-700 text-left transition-colors">
                <div className="font-semibold text-amber-800">Admin</div>
                <div className="text-[11px] text-slate-500 truncate">admin@honeyfarm.com</div>
              </button>
              <button type="button" onClick={() => setDemoCredentials('bob@honeyfarm.com', 'user')} className="text-xs bg-white border border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 py-1.5 px-2 rounded text-slate-700 text-left transition-colors">
                <div className="font-semibold text-amber-800">Apicultor</div>
                <div className="text-[11px] text-slate-500 truncate">bob@honeyfarm.com</div>
              </button>
            </div>
        </div>
      </div>
    </div>);
};
export default Login;
