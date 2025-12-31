
import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Bug, Save, Calculator, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { TaskType, TaskStatus } from '../types';

const VarroaControlView = () => {
  const { apiaries, hives, pallets, addLog, currentUser } = useApp();
  const { t } = useLanguage();

  const [selectedApiaryId, setSelectedApiaryId] = useState('');
  const [selectedHiveId, setSelectedHiveId] = useState('');
  const [beesCount, setBeesCount] = useState<number>(300);
  const [mitesCount, setMitesCount] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const availableHives = useMemo(() => {
    if (!selectedApiaryId) return [];
    const apiaryPallets = pallets.filter(p => p.apiaryId === selectedApiaryId).map(p => p.id);
    return hives.filter(h => apiaryPallets.includes(h.palletId));
  }, [selectedApiaryId, hives, pallets]);

  const infestationRate = useMemo(() => {
    if (beesCount <= 0) return 0;
    return (mitesCount / beesCount) * 100;
  }, [beesCount, mitesCount]);

  const getRiskLevel = (rate: number) => {
    if (rate < 1) return { color: 'text-green-600', label: 'Low Risk', bg: 'bg-green-50' };
    if (rate < 3) return { color: 'text-yellow-600', label: 'Moderate Risk', bg: 'bg-yellow-50' };
    return { color: 'text-red-600', label: 'High Risk - Treat Now!', bg: 'bg-red-50' };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApiaryId || !selectedHiveId) return;

    addLog({
      id: `l${Date.now()}`,
      apiaryId: selectedApiaryId,
      hiveIds: [selectedHiveId],
      date: new Date().toISOString().split('T')[0],
      type: TaskType.VARROA_CONTROL,
      description: `Varroa check: ${mitesCount} mites in ${beesCount} bees sample. Notes: ${notes}`,
      status: TaskStatus.COMPLETED,
      completedBy: currentUser?.name || 'User',
      completedDate: new Date().toISOString().split('T')[0],
      varroaPercentage: infestationRate
    });

    // Reset form
    setMitesCount(0);
    setNotes('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const risk = getRiskLevel(infestationRate);

  return (
    <div className="p-6 space-y-6 animate-fade-in max-w-4xl mx-auto">
      <header>
        <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-2">
          <Bug className="text-red-500" /> {t('varroa.title')}
        </h1>
        <p className="text-slate-600">{t('varroa.subtitle')}</p>
      </header>

      {showSuccess && (
        <div className="bg-green-100 border border-green-200 text-green-800 p-4 rounded-xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 size={20} /> {t('varroa.success')}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Input Card */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('nav.apiaries')}</label>
                <select 
                  required
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 transition-all outline-none"
                  value={selectedApiaryId}
                  onChange={e => { setSelectedApiaryId(e.target.value); setSelectedHiveId(''); }}
                >
                  <option value="">{t('logs.apiary_search')}</option>
                  {apiaries.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('varroa.select_hive')}</label>
                <select 
                  required
                  disabled={!selectedApiaryId}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 transition-all outline-none disabled:opacity-50"
                  value={selectedHiveId}
                  onChange={e => setSelectedHiveId(e.target.value)}
                >
                  <option value="">{t('varroa.select_hive')}...</option>
                  {availableHives.map(h => <option key={h.id} value={h.id}>Hive {h.id.slice(-4)}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('varroa.bees_count')}</label>
                <div className="relative">
                   <Info className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                   <input 
                    type="number" 
                    min="1" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 focus:ring-2 focus:ring-amber-500 outline-none" 
                    value={beesCount} 
                    onChange={e => setBeesCount(Number(e.target.value))} 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t('varroa.mites_count')}</label>
                <input 
                  type="number" 
                  min="0" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none" 
                  value={mitesCount} 
                  onChange={e => setMitesCount(Number(e.target.value))} 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">{t('varroa.notes')}</label>
              <textarea 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 h-24 resize-none focus:ring-2 focus:ring-amber-500 outline-none"
                placeholder="..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
              />
            </div>

            <button 
              type="submit" 
              disabled={!selectedApiaryId || !selectedHiveId}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-amber-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              <Save size={20} /> {t('varroa.save')}
            </button>
          </form>
        </div>

        {/* Results Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center gap-2 font-bold text-slate-700">
              <Calculator size={18} /> {t('varroa.infestation_rate')}
            </div>
            <div className={`p-8 text-center space-y-2 ${risk.bg}`}>
              <div className={`text-5xl font-black ${risk.color}`}>
                {infestationRate.toFixed(1)}%
              </div>
              <div className={`text-sm font-bold uppercase tracking-widest ${risk.color}`}>
                {risk.label}
              </div>
            </div>
            <div className="p-4 text-xs text-slate-500 leading-relaxed bg-white">
              <div className="flex gap-2 items-start mb-2">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <span>The economic threshold for treatment is typically between <b>2% and 3%</b> depending on the season and colony strength.</span>
              </div>
              <p>Formula: (Mites / Bees) × 100</p>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-amber-900 text-sm italic">
            "Regular mite monitoring is key to colony survival. Use the alcohol wash or powdered sugar shake methods for best results."
          </div>
        </div>
      </div>
    </div>
  );
};

export default VarroaControlView;
