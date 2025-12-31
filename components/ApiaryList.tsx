
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Plus, Archive, Search, ChevronLeft, ChevronRight, Edit2, Trash2, AlertCircle, X, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Apiary, HiveStatus } from '../types';

const ApiaryList = () => {
  const { apiaries, addApiary, updateApiary, hives, nuclei, currentUser, pallets } = useApp();
  const { t } = useLanguage();
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  
  const [newApiary, setNewApiary] = useState({ name: '', area: '', location: '' });
  const [editingApiary, setEditingApiary] = useState<Apiary | null>(null);
  const [deactivatingApiary, setDeactivatingApiary] = useState<Apiary | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `a${Date.now()}`;
    addApiary({ 
        ...newApiary, 
        id, 
        honeyHarvestedKg: 0, 
        status: 'Active' 
    });
    setIsAddModalOpen(false);
    setNewApiary({ name: '', area: '', location: '' });
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingApiary) {
        updateApiary(editingApiary.id, { name: editingApiary.name });
        setIsEditModalOpen(false);
        setEditingApiary(null);
    }
  };

  const handleDeactivate = () => {
      if (deactivatingApiary) {
          updateApiary(deactivatingApiary.id, { status: 'Inactive' });
          setIsDeactivateModalOpen(false);
          setDeactivatingApiary(null);
      }
  };

  const getCounts = (apiaryId: string) => {
    const palletIds = pallets.filter(p => p.apiaryId === apiaryId).map(p => p.id);
    const hiveCount = hives.filter(h => palletIds.includes(h.palletId) && h.status !== HiveStatus.DEAD).length;
    const nucCount = nuclei.filter(n => n.apiaryId === apiaryId).length;
    return { hiveCount, nucCount };
  };

  const filteredApiaries = apiaries.filter(apiary => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = apiary.name.toLowerCase().includes(term) || apiary.area.toLowerCase().includes(term);
      const matchesStatus = showInactive ? apiary.status === 'Inactive' : apiary.status === 'Active';
      return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredApiaries.length / itemsPerPage);
  const currentApiaries = filteredApiaries.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
      }
  };

  React.useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm, showInactive]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-amber-900">{showInactive ? 'Apiarios Inactivos' : t('apiaries.title')}</h1>
            <p className="text-slate-600">{showInactive ? 'Lista de locaciones deshabilitadas temporalmente.' : t('apiaries.subtitle')}</p>
        </div>
        <div className="flex gap-2">
            <button 
                onClick={() => setShowInactive(!showInactive)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${showInactive ? 'bg-amber-100 border-amber-300 text-amber-700' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`}
            >
                {showInactive ? 'Ver Activos' : 'Ver Inactivos'}
            </button>
            {currentUser.role === 'admin' && !showInactive && (
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
              >
                <Plus size={20} /> {t('apiaries.add')}
              </button>
            )}
        </div>
      </div>

      <div className="relative max-w-md w-full">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
         <input 
            type="text" 
            placeholder={t('apiaries.search_placeholder')}
            className="w-full bg-white border border-slate-300 rounded-lg pl-10 pr-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-shadow shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
         />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {currentApiaries.map(apiary => {
            const counts = getCounts(apiary.id);
            return (
                <div key={apiary.id} className="relative group bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                    <Link to={`/apiaries/${apiary.id}`} className="block p-5">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                                <MapPin size={24} />
                            </div>
                            <div className="flex gap-2 text-xs font-bold text-slate-400">
                                <span className="bg-slate-100 px-2 py-1 rounded">{counts.hiveCount} {t('apiaries.hives')}</span>
                                <span className="bg-slate-100 px-2 py-1 rounded">{counts.nucCount} {t('apiaries.nuclei')}</span>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{apiary.name}</h3>
                        <p className="text-slate-500 text-sm flex items-center gap-1 mb-4">
                            <Archive size={14} className="text-amber-500" /> {apiary.area}
                        </p>
                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-xs">
                             <span className="text-slate-400 uppercase tracking-wider font-semibold">Producción: {apiary.honeyHarvestedKg}kg</span>
                             <span className={`px-2 py-1 rounded-full ${apiary.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {apiary.status === 'Active' ? 'Activo' : 'Inactivo'}
                             </span>
                        </div>
                    </Link>
                    
                    {currentUser.role === 'admin' && (
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={(e) => { e.preventDefault(); setEditingApiary(apiary); setIsEditModalOpen(true); }}
                                className="p-2 bg-white/95 backdrop-blur-sm rounded-lg text-blue-600 shadow-md hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                title="Editar nombre"
                            >
                                <Edit2 size={16} />
                            </button>
                            {apiary.status === 'Active' ? (
                                <button 
                                    onClick={(e) => { e.preventDefault(); setDeactivatingApiary(apiary); setIsDeactivateModalOpen(true); }}
                                    className="p-2 bg-white/95 backdrop-blur-sm rounded-lg text-red-600 shadow-md hover:bg-red-600 hover:text-white transition-all border border-red-100"
                                    title="Desactivar apiario"
                                >
                                    <Trash2 size={16} />
                                </button>
                            ) : (
                                <button 
                                    onClick={(e) => { e.preventDefault(); updateApiary(apiary.id, { status: 'Active' }); }}
                                    className="p-2 bg-white/95 backdrop-blur-sm rounded-lg text-green-600 shadow-md hover:bg-green-600 hover:text-white transition-all border border-green-100"
                                    title="Reactivar apiario"
                                >
                                    <CheckCircle size={16} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            );
        })}
      </div>
      
      {filteredApiaries.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Archive size={32} />
              </div>
              <p className="text-slate-500 font-medium">
                  No se encontraron apiarios {showInactive ? 'inactivos' : ''} que coincidan con "{searchTerm}".
              </p>
          </div>
      )}

      {/* Controles de Paginación */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-white hover:text-amber-600 disabled:opacity-50 disabled:hover:bg-transparent transition-colors shadow-sm"
              >
                  <ChevronLeft size={20} />
              </button>
              <span className="text-sm font-bold text-slate-600 bg-white px-4 py-2 rounded-lg border border-slate-200">
                  Página {currentPage} de {totalPages}
              </span>
              <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-white hover:text-amber-600 disabled:opacity-50 transition-colors shadow-sm"
              >
                  <ChevronRight size={20} />
              </button>
          </div>
      )}

      {/* MODAL: AGREGAR */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative border border-slate-100">
            <button onClick={() => setIsAddModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20}/>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <Plus className="text-amber-600" /> Nuevo Apiario
            </h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Apiario</label>
                <input 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" 
                    placeholder="Ej. El Valle de las Abejas" 
                    value={newApiary.name} 
                    onChange={e => setNewApiary({...newApiary, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Área / Zona</label>
                <input 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" 
                    placeholder="Ej. Sector Noroeste" 
                    value={newApiary.area} 
                    onChange={e => setNewApiary({...newApiary, area: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Ubicación</label>
                <input 
                    required 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all outline-none" 
                    placeholder="Dirección o Coordenadas" 
                    value={newApiary.location} 
                    onChange={e => setNewApiary({...newApiary, location: e.target.value})} 
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setIsAddModalOpen(false)} 
                    className="px-6 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold transition-all"
                  >
                      Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-2.5 bg-amber-600 text-white rounded-xl font-bold hover:bg-amber-700 shadow-lg shadow-amber-200 transition-all"
                  >
                      Crear Apiario
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR NOMBRE */}
      {isEditModalOpen && editingApiary && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative border border-slate-100">
            <button onClick={() => setIsEditModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20}/>
            </button>
            <h2 className="text-2xl font-bold mb-6 text-slate-800 flex items-center gap-2">
                <Edit2 className="text-blue-600" size={24} /> Editar Nombre
            </h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Nuevo nombre para el apiario</label>
                <input 
                    required 
                    autoFocus
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all outline-none" 
                    placeholder="Nombre del apiario" 
                    value={editingApiary.name} 
                    onChange={e => setEditingApiary({...editingApiary, name: e.target.value})} 
                />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                  <button 
                    type="button" 
                    onClick={() => setIsEditModalOpen(false)} 
                    className="px-6 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold transition-all"
                  >
                      Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                  >
                      Guardar Cambios
                  </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: DESACTIVAR CONFIRMACIÓN */}
      {isDeactivateModalOpen && deactivatingApiary && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4 animate-fade-in backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl text-center border border-red-50">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2 text-slate-800">¿Estás seguro?</h2>
            <p className="text-slate-500 mb-8">
                Vas a desactivar el apiario <span className="font-bold text-slate-800">"{deactivatingApiary.name}"</span>. 
                Dejará de aparecer en las listas de trabajo activo.
            </p>
            <div className="flex flex-col gap-3">
                <button 
                    onClick={handleDeactivate}
                    className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all"
                >
                    Sí, Desactivar Apiario
                </button>
                <button 
                    onClick={() => setIsDeactivateModalOpen(false)} 
                    className="w-full py-3 text-slate-500 hover:bg-slate-100 rounded-xl font-semibold transition-all"
                >
                    No, Cancelar
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ApiaryList;
