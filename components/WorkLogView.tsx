import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, CheckCircle, Plus, Filter, X, ChevronDown, LayoutGrid, Box, Archive, Bug } from 'lucide-react';
import { TaskType, TaskStatus, WorkLog } from '../types';

const WorkLogView = () => {
  const { logs, apiaries, pallets, hives, addLog, updateLog, currentUser } = useApp();
  const { t } = useLanguage();
  
  // Filter States
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed'>('All');
  const [selectedArea, setSelectedArea] = useState<string>('');
  const [selectedApiaryId, setSelectedApiaryId] = useState<string>('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Log State
  const [newLog, setNewLog] = useState<Partial<WorkLog>>({
    apiaryId: '',
    palletId: '',
    hiveIds: [],
    type: TaskType.GENERAL,
    status: TaskStatus.PENDING,
    date: new Date().toISOString().split('T')[0],
    description: '',
    harvestedChambers: 0,
    harvestedFrames: 0,
    varroaPercentage: 0
  });

  // Custom Searchable Dropdown State
  const [apiarySearchTerm, setApiarySearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter apiaries for the dropdown
  const filteredApiaryOptions = apiaries.filter(a => 
    a.name.toLowerCase().includes(apiarySearchTerm.toLowerCase()) || 
    a.area.toLowerCase().includes(apiarySearchTerm.toLowerCase())
  );

  const selectApiaryForLog = (apiary: { id: string, name: string }) => {
      setNewLog({ ...newLog, apiaryId: apiary.id, palletId: '', hiveIds: [] });
      setApiarySearchTerm(apiary.name);
      setIsDropdownOpen(false);
  };

  const handleOpenModal = () => {
      setNewLog({
        apiaryId: '',
        palletId: '',
        hiveIds: [],
        type: TaskType.GENERAL,
        status: TaskStatus.PENDING,
        date: new Date().toISOString().split('T')[0],
        description: '',
        harvestedChambers: 0,
        harvestedFrames: 0,
        varroaPercentage: 0
      });
      setApiarySearchTerm('');
      setIsModalOpen(true);
  }

  // Unique Areas for Filter
  const areas = Array.from(new Set(apiaries.map(a => a.area)));

  const filteredLogs = logs.filter(log => {
    if (statusFilter !== 'All' && log.status !== statusFilter) return false;
    const logApiary = apiaries.find(a => a.id === log.apiaryId);
    if (!logApiary) return true; 
    if (selectedArea && logApiary.area !== selectedArea) return false;
    if (selectedApiaryId && log.apiaryId !== selectedApiaryId) return false;
    return true;
  }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLog.apiaryId) {
        alert("Please select an apiary");
        return;
    }
    addLog({
        id: `l${Date.now()}`,
        apiaryId: newLog.apiaryId!,
        palletId: newLog.palletId,
        hiveIds: newLog.hiveIds,
        date: newLog.date!,
        type: newLog.type!,
        description: newLog.description!,
        status: newLog.status!,
        assignedTo: currentUser?.name || 'User',
        harvestedChambers: newLog.type === TaskType.HARVEST_SWAP ? Number(newLog.harvestedChambers) : undefined,
        harvestedFrames: newLog.type === TaskType.HARVEST_SWAP ? Number(newLog.harvestedFrames) : undefined,
        varroaPercentage: (newLog.type === TaskType.VARROA_CONTROL || newLog.type === TaskType.INSPECTION) ? Number(newLog.varroaPercentage) : undefined
    });
    setIsModalOpen(false);
  };

  const toggleStatus = (log: WorkLog) => {
    const newStatus = log.status === TaskStatus.PENDING ? TaskStatus.COMPLETED : TaskStatus.PENDING;
    updateLog(log.id, { 
        status: newStatus,
        completedBy: newStatus === TaskStatus.COMPLETED ? currentUser?.name : undefined,
        completedDate: newStatus === TaskStatus.COMPLETED ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  const availablePallets = pallets.filter(p => p.apiaryId === newLog.apiaryId);
  const availableHives = hives.filter(h => newLog.palletId ? h.palletId === newLog.palletId : false);

  const toggleHiveSelection = (id: string) => {
      setNewLog(prev => {
          const current = prev.hiveIds || [];
          if (current.includes(id)) {
              return { ...prev, hiveIds: current.filter(h => h !== id) };
          } else {
              return { ...prev, hiveIds: [...current, id] };
          }
      });
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">{t('logs.title')}</h1>
          <p className="text-slate-600">{t('logs.subtitle')}</p>
        </div>
        <button onClick={handleOpenModal} className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 shadow-sm transition-colors">
            <Plus size={18} /> {t('logs.record')}
        </button>
      </div>

      {/* Advanced Filters Bar (Same as before) */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 font-medium"><Filter size={18} /> {t('logs.filters')}:</div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
            {(['All', 'Pending', 'Completed'] as const).map(f => (
                <button key={f} onClick={() => setStatusFilter(f)} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${statusFilter === f ? 'bg-white text-amber-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    {f === 'All' ? t('dash.view_all') : t(`status.${f.toLowerCase()}`)}
                </button>
            ))}
        </div>
        <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg p-2" value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
            <option value="">{t('logs.all_areas')}</option>
            {areas.map(area => <option key={area} value={area}>{area}</option>)}
        </select>
        <select className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg p-2" value={selectedApiaryId} onChange={(e) => setSelectedApiaryId(e.target.value)}>
            <option value="">{t('logs.all_apiaries')}</option>
            {apiaries.filter(a => !selectedArea || a.area === selectedArea).map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {(selectedArea || selectedApiaryId || statusFilter !== 'All') && (
            <button onClick={() => { setSelectedArea(''); setSelectedApiaryId(''); setStatusFilter('All'); }} className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"><X size={14} /> {t('logs.clear')}</button>
        )}
      </div>

      {/* Log List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {filteredLogs.length === 0 ? <div className="p-8 text-center text-slate-500">{t('logs.no_logs')}</div> : (
            <div className="divide-y divide-slate-100">
                {filteredLogs.map(log => {
                    const apiaryName = apiaries.find(a => a.id === log.apiaryId)?.name || 'Unknown Apiary';
                    const palletCode = log.palletId ? pallets.find(p => p.id === log.palletId)?.code : null;
                    const isOverdue = new Date(log.date) < new Date() && log.status === 'Pending';
                    const isHarvest = log.type === TaskType.HARVEST_SWAP;
                    const isVarroa = log.varroaPercentage !== undefined;
                    
                    return (
                        <div key={log.id} className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition-colors group border-l-4 border-transparent hover:border-l-amber-500">
                            <button onClick={() => toggleStatus(log)} className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${log.status === 'Completed' ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent hover:border-green-500'}`}>
                                <CheckCircle size={16} fill="currentColor" />
                            </button>
                            <div className="flex-grow">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${log.type === 'Feeding' ? 'bg-orange-400' : log.type === 'Medication' ? 'bg-red-400' : log.type === 'Harvest' ? 'bg-yellow-500' : log.type === 'Harvest Swap' ? 'bg-amber-600' : 'bg-blue-400'}`}>
                                        {log.type === TaskType.HARVEST_SWAP ? t('task.harvest_swap') : log.type}
                                    </span>
                                    <span className="text-sm text-slate-500 flex items-center gap-1"><Calendar size={12} /> {log.date}</span>
                                    {isOverdue && <span className="text-xs text-red-600 font-bold bg-red-50 px-2 rounded">{t('logs.overdue')}</span>}
                                </div>
                                <h3 className="font-semibold text-slate-800">{log.description}</h3>
                                {isHarvest && (
                                    <div className="mt-1 flex gap-3">
                                        {log.harvestedChambers && log.harvestedChambers > 0 && <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded flex items-center gap-1"><Archive size={12} /> ⬇️ {log.harvestedChambers} Chambers</span>}
                                        {log.harvestedFrames && log.harvestedFrames > 0 && <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-1 rounded flex items-center gap-1"><Box size={12} /> ⬇️ {log.harvestedFrames} Frames</span>}
                                    </div>
                                )}
                                {isVarroa && (
                                     <div className="mt-1">
                                         <span className="text-xs font-bold text-red-800 bg-red-50 px-2 py-1 rounded flex items-center gap-1 w-fit"><Bug size={12} /> {log.varroaPercentage}% Varroa</span>
                                     </div>
                                )}
                                <div className="text-sm text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-slate-700">{apiaryName}</span>
                                    {palletCode && <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-xs"><Box size={10} /> {palletCode}</span>}
                                    {log.hiveIds && log.hiveIds.length > 0 && <span className="flex items-center gap-1 text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-xs"><LayoutGrid size={10} /> {log.hiveIds.length} Hives</span>}
                                    {log.assignedTo && <span> • {t('logs.assigned')}: {log.assignedTo}</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-bold text-slate-800 mb-4">{t('modal.record_log')}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div ref={dropdownRef} className="relative col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-1">Apiary (Required)</label>
                            <div className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-700 flex items-center justify-between cursor-pointer" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <input type="text" className="w-full focus:outline-none cursor-pointer" placeholder={t('logs.apiary_search')} value={apiarySearchTerm} onChange={(e) => { setApiarySearchTerm(e.target.value); setNewLog({...newLog, apiaryId: '', palletId: '', hiveIds: []}); setIsDropdownOpen(true); }} />
                                <ChevronDown size={16} className="text-slate-400" />
                            </div>
                            {isDropdownOpen && (
                                <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                                    {filteredApiaryOptions.map(a => <li key={a.id} onClick={() => selectApiaryForLog(a)} className="px-4 py-2 hover:bg-amber-50 cursor-pointer text-sm text-slate-700 flex flex-col"><span className="font-medium">{a.name}</span><span className="text-xs text-slate-400">{a.area}</span></li>)}
                                </ul>
                            )}
                        </div>
                        {/* Pallet/Hive Select ... (Same as before) */}
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('modal.select_pallet')}</label>
                            <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-700 text-sm disabled:bg-slate-50 disabled:text-slate-400" value={newLog.palletId} disabled={!newLog.apiaryId} onChange={e => setNewLog({...newLog, palletId: e.target.value, hiveIds: []})}>
                                <option value="">Entire Apiary</option>
                                {availablePallets.map(p => <option key={p.id} value={p.id}>{p.code}</option>)}
                            </select>
                        </div>
                        <div className="col-span-1">
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('modal.date')}</label>
                            <input type="date" className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-700 text-sm" value={newLog.date} onChange={e => setNewLog({...newLog, date: e.target.value})} />
                        </div>
                    </div>
                    {newLog.palletId && (
                         <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                             <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">{t('modal.select_hives_opt')}</label>
                             <div className="grid grid-cols-4 gap-2">
                                 {availableHives.length > 0 ? availableHives.map(h => (
                                     <button key={h.id} type="button" onClick={() => toggleHiveSelection(h.id)} className={`text-xs p-1.5 rounded border text-center transition-all ${(newLog.hiveIds || []).includes(h.id) ? 'bg-amber-100 border-amber-400 text-amber-800 font-bold' : 'bg-white border-slate-200 text-slate-600 hover:border-amber-300'}`}>Hive {h.id.slice(-4)}</button>
                                 )) : <span className="text-xs text-slate-400 col-span-4">No hives on this pallet.</span>}
                             </div>
                         </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">{t('modal.type')}</label>
                            <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-700 text-sm" value={newLog.type} onChange={e => setNewLog({...newLog, type: e.target.value as TaskType})}>
                                {Object.values(TaskType).map(taskType => <option key={taskType} value={taskType}>{taskType === TaskType.HARVEST_SWAP ? t('task.harvest_swap') : taskType}</option>)}
                            </select>
                        </div>
                        <div>
                             <label className="block text-sm font-medium text-slate-700 mb-1">{t('detail.status')}</label>
                            <select className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-700 text-sm" value={newLog.status} onChange={e => setNewLog({...newLog, status: e.target.value as TaskStatus})}>
                                <option value={TaskStatus.PENDING}>{t('status.pending')}</option>
                                <option value={TaskStatus.COMPLETED}>{t('status.good')} (Done)</option>
                            </select>
                        </div>
                    </div>

                    {/* Varroa Field */}
                    {(newLog.type === TaskType.VARROA_CONTROL || newLog.type === TaskType.INSPECTION) && (
                         <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                             <div className="flex items-center gap-2 mb-3">
                                 <Bug size={16} className="text-red-700" />
                                 <h4 className="font-bold text-red-800 text-sm">Varroa Monitoring</h4>
                             </div>
                             <div>
                                 <label className="block text-xs font-semibold text-red-900 mb-1">{t('log.varroa_pct')}</label>
                                 <input type="number" min="0" max="100" step="0.1" className="w-full bg-white border border-red-300 rounded-lg p-2 focus:ring-red-500" value={newLog.varroaPercentage} onChange={e => setNewLog({...newLog, varroaPercentage: parseFloat(e.target.value)})} />
                             </div>
                         </div>
                    )}

                    {/* Harvest Fields (Same as before) */}
                    {newLog.type === TaskType.HARVEST_SWAP && (
                        <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                             <div className="flex items-center gap-2 mb-3"><Archive size={16} className="text-amber-700" /><h4 className="font-bold text-amber-800 text-sm">{t('task.harvest_swap')} Details</h4></div>
                             <div className="grid grid-cols-2 gap-4">
                                 <div><label className="block text-xs font-semibold text-amber-900 mb-1">{t('log.harvested_chambers')}</label><input type="number" min="0" className="w-full bg-white border border-amber-300 rounded-lg p-2 focus:ring-amber-500" value={newLog.harvestedChambers} onChange={e => setNewLog({...newLog, harvestedChambers: parseInt(e.target.value)})} /></div>
                                 <div><label className="block text-xs font-semibold text-amber-900 mb-1">{t('log.harvested_frames')}</label><input type="number" min="0" className="w-full bg-white border border-amber-300 rounded-lg p-2 focus:ring-amber-500" value={newLog.harvestedFrames} onChange={e => setNewLog({...newLog, harvestedFrames: parseInt(e.target.value)})} /></div>
                             </div>
                        </div>
                    )}

                    <textarea required className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-700 h-20 resize-none text-sm" placeholder={t('modal.description_ph')} value={newLog.description} onChange={e => setNewLog({...newLog, description: e.target.value})} />
                    
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">{t('modal.cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-sm">{t('modal.save')}</button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default WorkLogView;