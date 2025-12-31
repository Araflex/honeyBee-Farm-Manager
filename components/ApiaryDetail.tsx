
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Box, ArrowLeft, Bot, Edit3, ClipboardList, ArrowRight, AlertTriangle, Move, Crown, Calendar, Trash2, X } from 'lucide-react';
import { Hive, LidType, NucleusStatus, HiveStatus, Nucleus, TaskType, TaskStatus, QueenStatus } from '../types';
import { analyzeApiaryData } from '../services/gemini';

const ApiaryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useLanguage();
  const { apiaries, pallets, hives, nuclei, logs, addPallet, addHive, addNucleus, updateHive, removeHive, moveHive, updateNucleus, promoteNucleus, addLog, currentUser } = useApp();
  
  const apiary = apiaries.find(a => a.id === id);
  const apiaryPallets = pallets.filter(p => p.apiaryId === id);
  const apiaryNuclei = nuclei.filter(n => n.apiaryId === id);
  const apiaryLogs = logs.filter(l => l.apiaryId === id);

  // Modals state
  const [isPalletModalOpen, setIsPalletModalOpen] = useState(false);
  const [isHiveModalOpen, setIsHiveModalOpen] = useState(false);
  const [isEditHiveModalOpen, setIsEditHiveModalOpen] = useState(false);
  const [isEditNucleusModalOpen, setIsEditNucleusModalOpen] = useState(false);
  const [isPalletTaskModalOpen, setIsPalletTaskModalOpen] = useState(false);
  const [isCapacityErrorModalOpen, setIsCapacityErrorModalOpen] = useState(false);
  const [isMoveHiveModalOpen, setIsMoveHiveModalOpen] = useState(false);
  
  // Data State
  const [selectedPalletId, setSelectedPalletId] = useState<string>('');
  const [selectedHive, setSelectedHive] = useState<Hive | null>(null);
  const [selectedNucleus, setSelectedNucleus] = useState<Nucleus | null>(null);
  
  // Form State
  const [newHiveData, setNewHiveData] = useState({ 
      chamberCount: 1, 
      lidType: LidType.STANDARD, 
      status: HiveStatus.GOOD,
      queenStatus: QueenStatus.ALIVE,
      queenOrigin: '',
      queenInstallDate: new Date().toISOString().split('T')[0]
  });
  const [newNucleusStatus, setNewNucleusStatus] = useState<NucleusStatus>(NucleusStatus.GOOD);
  
  // Promotion/Move State
  const [promoteData, setPromoteData] = useState({ targetApiaryId: id || '', targetPalletId: '', chamberCount: 1 });
  
  // Pallet Task State
  const [newTaskData, setNewTaskData] = useState({ 
      type: TaskType.GENERAL, 
      date: new Date().toISOString().split('T')[0], 
      description: '', 
      selectedHiveIds: [] as string[],
      harvestedChambers: 0,
      harvestedFrames: 0
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [draggedHiveId, setDraggedHiveId] = useState<string | null>(null);

  if (!apiary) return <div className="p-6">Apiary not found</div>;

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, hiveId: string) => {
      setDraggedHiveId(hiveId);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', hiveId);
  };

  const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPalletId: string, targetPosition?: number) => {
      e.preventDefault();
      e.stopPropagation();
      if (!draggedHiveId) return;
      
      const targetPallet = pallets.find(p => p.id === targetPalletId);
      const hivesOnTarget = hives.filter(h => h.palletId === targetPalletId && h.status !== HiveStatus.DEAD).length;
      const isSamePallet = hives.find(h => h.id === draggedHiveId)?.palletId === targetPalletId;

      if (!isSamePallet && targetPallet && hivesOnTarget >= targetPallet.capacity && targetPosition === undefined) {
          setIsCapacityErrorModalOpen(true);
          setDraggedHiveId(null);
          return;
      }

      moveHive(draggedHiveId, targetPalletId, undefined, targetPosition);
      setDraggedHiveId(null);
  };

  const handleSavePallet = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `P-${(apiaryPallets.length + 1).toString().padStart(3, '0')}`;
    // Using a fixed capacity for simplified example, but ideally this would come from an input
    addPallet({ 
        id: `p${Date.now()}`, 
        apiaryId: apiary.id, 
        code, 
        capacity: 4 
    });
    setIsPalletModalOpen(false);
  };

  const handleAddHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPalletId) return;
    addHive({
        id: `h${Date.now()}`,
        palletId: selectedPalletId,
        chamberCount: newHiveData.chamberCount,
        lidType: newHiveData.lidType,
        status: newHiveData.status,
        lastUpdated: new Date().toISOString().split('T')[0],
        updatedBy: currentUser.name,
        queenStatus: newHiveData.queenStatus,
        queenOrigin: newHiveData.queenOrigin,
        queenInstallDate: newHiveData.queenInstallDate
    });
    setIsHiveModalOpen(false);
  };

  const handleUpdateHive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHive) return;
    updateHive(selectedHive.id, {
        chamberCount: newHiveData.chamberCount,
        lidType: newHiveData.lidType,
        status: newHiveData.status,
        queenStatus: newHiveData.queenStatus,
        queenOrigin: newHiveData.queenOrigin,
        queenInstallDate: newHiveData.queenInstallDate
    });
    setIsEditHiveModalOpen(false);
    setSelectedHive(null);
  };

  const handleRemoveHive = () => {
      if(!selectedHive) return;
      if(window.confirm('Are you sure you want to remove this hive? This will free up the slot.')) {
          removeHive(selectedHive.id);
          setIsEditHiveModalOpen(false);
          setSelectedHive(null);
      }
  }

  const handleMoveHiveToApiary = (e: React.FormEvent) => {
      e.preventDefault();
      if(!selectedHive || !promoteData.targetPalletId) return;
      
      const targetPallet = pallets.find(p => p.id === promoteData.targetPalletId);
      const hivesOnTarget = hives.filter(h => h.palletId === promoteData.targetPalletId && h.status !== HiveStatus.DEAD).length;

      if(targetPallet && hivesOnTarget >= targetPallet.capacity) {
          setIsCapacityErrorModalOpen(true);
          return;
      }

      moveHive(selectedHive.id, promoteData.targetPalletId, promoteData.targetApiaryId);
      setIsMoveHiveModalOpen(false);
      setIsEditHiveModalOpen(false); 
  }

  const handleUpdateNucleus = (e: React.FormEvent) => {
      e.preventDefault();
      if (!selectedNucleus) return;
      
      if (newNucleusStatus === NucleusStatus.READY && promoteData.targetPalletId) {
          const targetPallet = pallets.find(p => p.id === promoteData.targetPalletId);
          const currentHives = hives.filter(h => h.palletId === promoteData.targetPalletId && h.status !== HiveStatus.DEAD).length;

          if (targetPallet && currentHives >= targetPallet.capacity) {
              setIsCapacityErrorModalOpen(true);
              return;
          }
          promoteNucleus(selectedNucleus.id, promoteData.targetPalletId, promoteData.chamberCount);
      } else {
          updateNucleus(selectedNucleus.id, {
              status: newNucleusStatus
          });
      }
      setIsEditNucleusModalOpen(false);
      setSelectedNucleus(null);
      setPromoteData({ targetApiaryId: apiary.id, targetPalletId: '', chamberCount: 1 });
  }

  const handleSavePalletTask = (e: React.FormEvent) => {
      e.preventDefault();
      addLog({
          id: `l${Date.now()}`,
          apiaryId: apiary.id,
          palletId: selectedPalletId,
          hiveIds: newTaskData.selectedHiveIds,
          date: newTaskData.date,
          type: newTaskData.type,
          description: newTaskData.description,
          status: TaskStatus.PENDING,
          assignedTo: currentUser.name,
          harvestedChambers: newTaskData.type === TaskType.HARVEST_SWAP ? Number(newTaskData.harvestedChambers) : undefined,
          harvestedFrames: newTaskData.type === TaskType.HARVEST_SWAP ? Number(newTaskData.harvestedFrames) : undefined
      });
      setIsPalletTaskModalOpen(false);
  };

  const openAddHiveModal = (palletId: string) => {
    setSelectedPalletId(palletId);
    setNewHiveData({ 
        chamberCount: 1, 
        lidType: LidType.STANDARD, 
        status: HiveStatus.GOOD,
        queenStatus: QueenStatus.ALIVE,
        queenOrigin: '',
        queenInstallDate: new Date().toISOString().split('T')[0]
    });
    setIsHiveModalOpen(true);
  };

  const openEditHiveModal = (hive: Hive) => {
    setSelectedHive(hive);
    setNewHiveData({ 
        chamberCount: hive.chamberCount, 
        lidType: hive.lidType, 
        status: hive.status,
        queenStatus: hive.queenStatus || QueenStatus.ALIVE,
        queenOrigin: hive.queenOrigin || '',
        queenInstallDate: hive.queenInstallDate || new Date().toISOString().split('T')[0]
    });
    setPromoteData({ targetApiaryId: apiary.id, targetPalletId: '', chamberCount: 1 });
    setIsEditHiveModalOpen(true);
  };

  const openEditNucleusModal = (nucleus: Nucleus) => {
      setSelectedNucleus(nucleus);
      setNewNucleusStatus(nucleus.status);
      setPromoteData({ targetApiaryId: apiary.id, targetPalletId: '', chamberCount: 1 });
      setIsEditNucleusModalOpen(true);
  }

  const openPalletTaskModal = (palletId: string) => {
      setSelectedPalletId(palletId);
      setNewTaskData({ 
        type: TaskType.GENERAL, 
        date: new Date().toISOString().split('T')[0], 
        description: '', 
        selectedHiveIds: [],
        harvestedChambers: 0,
        harvestedFrames: 0
      });
      setIsPalletTaskModalOpen(true);
  }

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const relatedHives = hives.filter(h => apiaryPallets.map(p => p.id).includes(h.palletId) && h.status !== HiveStatus.DEAD);
    const result = await analyzeApiaryData(apiary.name, apiaryLogs, relatedHives);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const toggleHiveSelection = (hiveId: string) => {
      setNewTaskData(prev => {
          if (prev.selectedHiveIds.includes(hiveId)) {
              return { ...prev, selectedHiveIds: prev.selectedHiveIds.filter(id => id !== hiveId) };
          } else {
              return { ...prev, selectedHiveIds: [...prev.selectedHiveIds, hiveId] };
          }
      });
  };

  const getStatusColor = (status: HiveStatus | NucleusStatus) => {
      switch(status) {
          case HiveStatus.GOOD: 
          case NucleusStatus.GOOD: return 'bg-green-50 border-green-300 text-green-900 ring-green-400';
          case HiveStatus.REGULAR: return 'bg-yellow-50 border-yellow-300 text-yellow-900 ring-yellow-400';
          case HiveStatus.BAD:
          case NucleusStatus.BAD: return 'bg-red-50 border-red-300 text-red-900 ring-red-400';
          case HiveStatus.DEAD: return 'bg-slate-200 border-slate-400 text-slate-600 grayscale';
          case NucleusStatus.READY: return 'bg-blue-50 border-blue-300 text-blue-900 ring-blue-400';
          default: return 'bg-slate-50 border-slate-200';
      }
  };

  const translateStatus = (status: string) => t(`status.${status.toLowerCase()}`);

  const promotionPallets = pallets.filter(p => {
      if (p.apiaryId !== promoteData.targetApiaryId) return false;
      const hiveCount = hives.filter(h => h.palletId === p.id && h.status !== HiveStatus.DEAD).length;
      return hiveCount < p.capacity;
  });

  return (
    <div className="p-4 md:p-6 space-y-6">
      <Link to="/apiaries" className="flex items-center gap-2 text-slate-500 hover:text-amber-600 mb-4 transition-colors">
        <ArrowLeft size={16} /> {t('detail.back')}
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{apiary.name}</h1>
            <p className="text-slate-500 text-sm md:text-base">{apiary.area} • {apiary.location}</p>
        </div>
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1 md:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors disabled:opacity-50"
            >
                <Bot size={20} /> <span className="text-sm font-semibold">{isAnalyzing ? t('detail.analyzing') : t('detail.ai_check')}</span>
            </button>
            <button 
                onClick={() => setIsPalletModalOpen(true)}
                className="flex-1 md:flex-none bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
                <Box size={20} /> <span className="text-sm font-semibold">{t('detail.add_pallet')}</span>
            </button>
        </div>
      </div>

      {aiAnalysis && (
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl text-indigo-900 animate-fade-in shadow-sm">
            <div className="flex items-center gap-2 font-bold mb-2">
                <Bot size={18} /> AI Analysis Report
            </div>
            <p className="text-sm whitespace-pre-wrap leading-relaxed">{aiAnalysis}</p>
        </div>
      )}

      {/* Apiary Layout Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Pallets & Hives */}
        <div className="space-y-4">
            <h2 className="text-xl font-semibold text-amber-900 flex items-center gap-2">
                <Box className="text-amber-600" /> {t('detail.hives_pallet')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {apiaryPallets.map(pallet => {
                    const hivesOnPallet = hives.filter(h => h.palletId === pallet.id && h.status !== HiveStatus.DEAD);
                    const slots = Array.from({ length: pallet.capacity });

                    return (
                        <div 
                            key={pallet.id} 
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, pallet.id)}
                            className="bg-white border border-slate-200 rounded-xl p-4 relative group shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div>
                                    <span className="font-mono text-sm font-bold text-slate-700 block">{pallet.code}</span>
                                    <span className="text-xs text-slate-400">{t('detail.cap')}: {hivesOnPallet.length} / {pallet.capacity}</span>
                                </div>
                                <div className="flex gap-1">
                                    <button 
                                        onClick={() => openPalletTaskModal(pallet.id)}
                                        className="text-slate-400 hover:text-amber-600 hover:bg-amber-50 p-2 rounded-full transition-colors" 
                                        title={t('modal.pallet_task')}
                                    >
                                        <ClipboardList size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {slots.map((_, index) => {
                                    const hive = hivesOnPallet.find(h => h.position === index);
                                    
                                    return (
                                        <div 
                                            key={`${pallet.id}-slot-${index}`}
                                            onDragOver={handleDragOver}
                                            onDrop={(e) => handleDrop(e, pallet.id, index)}
                                            className="min-h-[90px]"
                                        >
                                            {hive ? (
                                                <div 
                                                    draggable
                                                    onDragStart={(e) => handleDragStart(e, hive.id)}
                                                    onClick={() => openEditHiveModal(hive)}
                                                    className={`${getStatusColor(hive.status)} h-full border p-2 rounded-lg text-center cursor-move hover:ring-2 relative group/hive transition-all active:cursor-grabbing flex flex-col justify-center items-center shadow-sm`}
                                                >
                                                    <div className="font-bold text-sm">{hive.chamberCount} Deep</div>
                                                    <div className="text-[10px] opacity-80 uppercase tracking-wide font-bold mt-1">{translateStatus(hive.status)}</div>
                                                    
                                                    <div className="absolute top-1 right-1 opacity-0 group-hover/hive:opacity-100 transition-opacity">
                                                        <Edit3 size={12} className="text-slate-500" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={() => openAddHiveModal(pallet.id)}
                                                    className="w-full h-full border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center hover:bg-slate-50 hover:border-amber-300 group/add transition-colors"
                                                    title={t('modal.add_hive')}
                                                >
                                                    <Plus className="text-slate-300 group-hover/add:text-amber-500" size={24} />
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Nuclei */}
        <div className="space-y-4">
             <div className="flex justify-between items-center px-1">
                <h2 className="text-xl font-semibold text-blue-900">{t('detail.nuclei')}</h2>
                <button 
                    onClick={() => addNucleus({ 
                        id: `n${Date.now()}`, 
                        apiaryId: apiary.id, 
                        status: NucleusStatus.GOOD, 
                        installDate: new Date().toISOString().split('T')[0],
                        lastUpdated: new Date().toISOString().split('T')[0], 
                        updatedBy: currentUser.name 
                    })} 
                    className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                >
                    + {t('detail.add_nuc')}
                </button>
            </div>
            
            {/* Responsividad de Tabla mejorada con desplazamiento horizontal */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto scrollbar-hide">
                    <table className="w-full text-sm text-left border-collapse min-w-[450px]">
                        <thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                            <tr>
                                <th className="p-4 border-b border-slate-100">{t('detail.id')}</th>
                                <th className="p-4 border-b border-slate-100">{t('detail.status')}</th>
                                <th className="p-4 border-b border-slate-100">{t('detail.install_date')}</th>
                                <th className="p-4 border-b border-slate-100 text-right">{t('detail.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {apiaryNuclei.length > 0 ? apiaryNuclei.map(nuc => (
                                <tr key={nuc.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-xs text-slate-600 font-bold">{nuc.id.slice(-6)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border shadow-sm
                                            ${nuc.status === NucleusStatus.GOOD ? 'bg-green-100 border-green-200 text-green-700' : 
                                              nuc.status === NucleusStatus.BAD ? 'bg-red-100 border-red-200 text-red-700' : 'bg-blue-100 border-blue-200 text-blue-700'}`}>
                                            {translateStatus(nuc.status)}
                                        </span>
                                    </td>
                                    <td className="p-4 text-slate-500 text-xs">{nuc.installDate}</td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => openEditNucleusModal(nuc)}
                                            className="p-2.5 bg-slate-100 text-slate-500 hover:bg-amber-100 hover:text-amber-700 rounded-lg transition-all active:scale-95 shadow-sm"
                                            aria-label="Editar núcleo"
                                        >
                                            <Edit3 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="p-8 text-center text-slate-400 italic">
                                        {t('detail.no_nucs')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>

      {/* Modals are unchanged but wrapped in responsive paddings */}
      
      {/* Add/Edit Hive Modal */}
      {(isHiveModalOpen || isEditHiveModalOpen) && !isMoveHiveModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4 backdrop-blur-sm">
            <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full my-8 max-h-[90vh] overflow-y-auto relative border border-slate-100">
                <button onClick={() => { setIsHiveModalOpen(false); setIsEditHiveModalOpen(false); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20}/>
                </button>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">{isEditHiveModalOpen ? t('modal.update_hive') : t('modal.add_hive')}</h3>
                    {isEditHiveModalOpen && (
                        <div className="flex gap-2">
                            <button 
                                type="button" 
                                onClick={() => setIsMoveHiveModalOpen(true)}
                                className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100 flex items-center gap-1 font-bold"
                            >
                                <Move size={12} /> {t('modal.move_hive')}
                            </button>
                        </div>
                    )}
                </div>
                
                <form onSubmit={isEditHiveModalOpen ? handleUpdateHive : handleAddHive} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-slate-700">{t('detail.status')}</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {Object.values(HiveStatus).map(status => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setNewHiveData({...newHiveData, status})}
                                    className={`text-xs py-3 rounded-lg border-2 transition-all font-bold ${
                                        newHiveData.status === status 
                                        ? status === 'Good' ? 'bg-green-50 border-green-500 text-green-800 shadow-sm' 
                                        : status === 'Regular' ? 'bg-yellow-50 border-yellow-500 text-yellow-800 shadow-sm'
                                        : status === 'Dead' ? 'bg-slate-200 border-slate-500 text-slate-800 shadow-sm'
                                        : 'bg-red-50 border-red-500 text-red-800 shadow-sm'
                                        : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300'
                                    }`}
                                >
                                    {translateStatus(status)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('modal.chambers')}</label>
                            <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                                value={newHiveData.chamberCount} 
                                onChange={e => setNewHiveData({...newHiveData, chamberCount: parseInt(e.target.value)})}
                            >
                                {[1,2,3,4].map(n => <option key={n} value={n}>{n} Deep Chambers</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">{t('modal.lid')}</label>
                            <select 
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all" 
                                value={newHiveData.lidType} 
                                onChange={e => setNewHiveData({...newHiveData, lidType: e.target.value as LidType})}
                            >
                                <option value={LidType.STANDARD}>Standard Lid</option>
                                <option value={LidType.MIGRATORY}>Migratory Lid</option>
                                <option value={LidType.TELESCOPING}>Telescoping Lid</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 shadow-sm">
                        <h4 className="text-sm font-bold text-purple-900 mb-4 flex items-center gap-2">
                            <Crown size={16} /> {t('modal.queen_info')}
                        </h4>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-bold text-purple-800 mb-1.5 uppercase tracking-wide">{t('modal.queen_status')}</label>
                                <select 
                                    className="w-full text-sm border-purple-200 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                    value={newHiveData.queenStatus}
                                    onChange={e => setNewHiveData({...newHiveData, queenStatus: e.target.value as QueenStatus})}
                                >
                                    {Object.values(QueenStatus).map(s => (
                                        <option key={s} value={s}>{t(`queen.${s.toLowerCase()}`)}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-purple-800 mb-1.5 uppercase tracking-wide">{t('modal.queen_origin')}</label>
                                    <input 
                                        type="text" 
                                        className="w-full text-sm border-purple-200 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                        placeholder="Ej. Local / Criadero"
                                        value={newHiveData.queenOrigin}
                                        onChange={e => setNewHiveData({...newHiveData, queenOrigin: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-purple-800 mb-1.5 uppercase tracking-wide">{t('modal.queen_date')}</label>
                                    <input 
                                        type="date" 
                                        className="w-full text-sm border-purple-200 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-purple-400 outline-none transition-all"
                                        value={newHiveData.queenInstallDate}
                                        onChange={e => setNewHiveData({...newHiveData, queenInstallDate: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-slate-100">
                        {isEditHiveModalOpen && (
                             <button 
                                type="button"
                                onClick={handleRemoveHive}
                                className="w-full sm:w-auto text-red-500 hover:text-red-700 text-sm font-bold flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                             >
                                 <Trash2 size={16} /> {t('modal.remove_hive')}
                             </button>
                        )}
                        <div className="flex gap-3 w-full sm:w-auto ml-auto">
                            <button 
                                type="button" 
                                onClick={() => { setIsHiveModalOpen(false); setIsEditHiveModalOpen(false); }} 
                                className="flex-1 sm:flex-none px-6 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-all"
                            >
                                {t('modal.cancel')}
                            </button>
                            <button 
                                type="submit" 
                                className={`flex-1 sm:flex-none px-8 py-2.5 text-white rounded-xl font-bold shadow-lg transition-all transform active:scale-95 ${isEditHiveModalOpen ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' : 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'}`}
                            >
                                {isEditHiveModalOpen ? t('modal.save') : t('modal.create')}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
      )}
    
      {/* Move Hive Modal */}
      {isMoveHiveModalOpen && (
           <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] animate-fade-in p-4 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full border border-slate-100 relative">
                  <button onClick={() => setIsMoveHiveModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={20}/>
                  </button>
                  <h3 className="text-xl font-bold text-slate-800 mb-6">{t('modal.move_hive')}</h3>
                   <form onSubmit={handleMoveHiveToApiary} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-blue-800 mb-2 uppercase tracking-wide">{t('modal.target_apiary')}</label>
                            <select 
                                className="w-full text-sm border-blue-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                value={promoteData.targetApiaryId}
                                onChange={e => setPromoteData({...promoteData, targetApiaryId: e.target.value, targetPalletId: ''})}
                            >
                                {apiaries.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-blue-800 mb-2 uppercase tracking-wide">{t('modal.target_pallet')}</label>
                            <select 
                                className="w-full text-sm border-blue-200 rounded-xl p-3 bg-slate-50 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                value={promoteData.targetPalletId}
                                required
                                onChange={e => setPromoteData({...promoteData, targetPalletId: e.target.value})}
                            >
                                <option value="">{promotionPallets.length === 0 ? 'Sin espacio disponible' : 'Seleccionar Pallet...'}</option>
                                {promotionPallets.map(p => (
                                    <option key={p.id} value={p.id}>{p.code} (Capacidad: {p.capacity})</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex justify-end gap-3 pt-6 border-t border-slate-50">
                             <button 
                                type="button" 
                                onClick={() => setIsMoveHiveModalOpen(false)} 
                                className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-bold"
                            >
                                {t('modal.cancel')}
                            </button>
                            <button 
                                type="submit" 
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
                            >
                                {t('modal.save')}
                            </button>
                        </div>
                   </form>
              </div>
           </div>
      )}

      {/* MODAL: EDITAR ESTADO NÚCLEO */}
       {isEditNucleusModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4 backdrop-blur-sm">
             <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full relative border border-slate-100">
                <button onClick={() => setIsEditNucleusModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={20}/>
                </button>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-slate-800">{t('modal.update_nuc')}</h3>
                </div>
                <form onSubmit={handleUpdateNucleus} className="space-y-6">
                     <div>
                        <label className="block text-sm font-bold mb-3 text-slate-700">{t('detail.status')}</label>
                        <div className="space-y-3">
                            {Object.values(NucleusStatus).map(status => (
                                <button
                                    key={status}
                                    type="button"
                                    onClick={() => setNewNucleusStatus(status)}
                                    className={`w-full text-left px-4 py-4 rounded-xl border-2 flex justify-between items-center transition-all ${
                                        newNucleusStatus === status 
                                        ? status === NucleusStatus.GOOD ? 'bg-green-50 border-green-500 shadow-sm' 
                                        : status === NucleusStatus.BAD ? 'bg-red-50 border-red-500 shadow-sm'
                                        : 'bg-blue-50 border-blue-500 shadow-sm'
                                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                                    }`}
                                >
                                    <span className={`font-bold ${
                                         newNucleusStatus === status 
                                         ? status === NucleusStatus.GOOD ? 'text-green-800' 
                                         : status === NucleusStatus.BAD ? 'text-red-800'
                                         : 'text-blue-800'
                                         : 'text-slate-400'
                                    }`}>{translateStatus(status)}</span>
                                    {newNucleusStatus === status && <div className="w-2.5 h-2.5 rounded-full bg-current"></div>}
                                </button>
                            ))}
                        </div>
                    </div>
                    {newNucleusStatus === NucleusStatus.READY && (
                        <div className="mt-4 p-4 bg-indigo-50 rounded-xl border-2 border-indigo-100 animate-slide-up shadow-sm">
                            <h4 className="text-sm font-bold text-indigo-900 mb-4 flex items-center gap-2"><ArrowRight size={16} /> {t('modal.promote_nuc')}</h4>
                             <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase tracking-wide">{t('modal.target_apiary')}</label>
                                    <select className="w-full text-sm border-indigo-200 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all" value={promoteData.targetApiaryId} onChange={e => setPromoteData({...promoteData, targetApiaryId: e.target.value, targetPalletId: ''})}>
                                        {apiaries.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-indigo-800 mb-1.5 uppercase tracking-wide">{t('modal.target_pallet')}</label>
                                    <select className="w-full text-sm border-indigo-200 rounded-lg p-2.5 bg-white shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none transition-all" value={promoteData.targetPalletId} required onChange={e => setPromoteData({...promoteData, targetPalletId: e.target.value})}>
                                        <option value="">{promotionPallets.length === 0 ? 'No hay espacio en este apiario' : 'Seleccionar Pallet...'}</option>
                                        {promotionPallets.map(p => <option key={p.id} value={p.id}>{p.code} (Capacidad: {p.capacity})</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-50">
                        <button type="button" onClick={() => setIsEditNucleusModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-bold">{t('modal.cancel')}</button>
                        <button type="submit" className={`px-8 py-2.5 text-white rounded-xl font-bold shadow-lg transition-all transform active:scale-95 ${newNucleusStatus === NucleusStatus.READY ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-100'}`}>
                            {newNucleusStatus === NucleusStatus.READY ? t('modal.promote_confirm') : t('modal.save')}
                        </button>
                    </div>
                </form>
             </div>
        </div>
      )}

      {/* Pallet Task Modal */}
      {isPalletTaskModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in p-4 backdrop-blur-sm">
              <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full relative border border-slate-100">
                  <button onClick={() => setIsPalletTaskModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <X size={20}/>
                  </button>
                  <h3 className="text-xl font-bold text-slate-800 mb-6">{t('modal.pallet_task')}</h3>
                  <form onSubmit={handleSavePalletTask} className="space-y-6">
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-3">{t('modal.select_hives')}</label>
                          <div className="bg-slate-50 border border-slate-100 rounded-xl max-h-48 overflow-y-auto p-2 grid grid-cols-2 gap-2 shadow-inner">
                              {hives.filter(h => h.palletId === selectedPalletId && h.status !== HiveStatus.DEAD).map(h => (
                                  <label key={h.id} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-200 cursor-pointer hover:border-amber-400 transition-colors shadow-sm">
                                      <input type="checkbox" checked={newTaskData.selectedHiveIds.includes(h.id)} onChange={() => toggleHiveSelection(h.id)} className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4" />
                                      <span className="text-xs font-bold text-slate-700">Colmena {h.id.slice(-4)}</span>
                                  </label>
                              ))}
                          </div>
                      </div>
                      <div className="grid grid-cols-1 gap-4">
                        <select className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={newTaskData.type} onChange={e => setNewTaskData({...newTaskData, type: e.target.value as TaskType})}>
                            {Object.values(TaskType).map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                        <input type="date" className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={newTaskData.date} onChange={e => setNewTaskData({...newTaskData, date: e.target.value})} />
                      </div>
                      <textarea className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm h-24 resize-none outline-none focus:ring-2 focus:ring-amber-500 transition-all" value={newTaskData.description} onChange={e => setNewTaskData({...newTaskData, description: e.target.value})} placeholder={t('modal.description_ph')} />
                      
                       <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-50">
                          <button type="button" onClick={() => setIsPalletTaskModalOpen(false)} className="px-5 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-bold">{t('modal.cancel')}</button>
                          <button type="submit" className="px-8 py-2.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-100 transition-all active:scale-95">{t('modal.save')}</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
      
      {/* Capacity Error Modal */}
      {isCapacityErrorModalOpen && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] animate-fade-in p-4 backdrop-blur-sm">
              <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-sm w-full border-l-8 border-red-500">
                  <div className="flex flex-col items-center text-center gap-4 mb-8">
                      <div className="bg-red-100 p-4 rounded-full text-red-600 shadow-sm"><AlertTriangle size={32} /></div>
                      <div>
                          <h3 className="text-xl font-bold text-slate-800">{t('modal.pallet_full')}</h3>
                          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{t('modal.pallet_full_desc')}</p>
                      </div>
                  </div>
                  <div className="flex flex-col gap-3">
                      <button onClick={() => { setIsCapacityErrorModalOpen(false); setIsPalletModalOpen(true); }} className="w-full py-3 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-100 transition-all">
                          {t('modal.create_pallet')}
                      </button>
                      <button onClick={() => setIsCapacityErrorModalOpen(false)} className="w-full py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-bold transition-all">
                          {t('modal.cancel')}
                      </button>
                  </div>
              </div>
          </div>
      )}

    </div>
  );
};

export default ApiaryDetail;
