import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MapPin, Plus, Archive, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Apiary, HiveStatus } from '../types';

const ApiaryList = () => {
  const { apiaries, addApiary, hives, nuclei, currentUser } = useApp();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newApiary, setNewApiary] = useState({ name: '', area: '', location: '' });
  const [searchTerm, setSearchTerm] = useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `a${Date.now()}`;
    addApiary({ ...newApiary, id, honeyHarvestedKg: 0 });
    setIsModalOpen(false);
    setNewApiary({ name: '', area: '', location: '' });
  };

  const getCounts = (apiaryId: string) => {
    // Assuming hives are linked to pallets, pallets to apiaries.
    const { pallets } = useApp();
    const palletIds = pallets.filter(p => p.apiaryId === apiaryId).map(p => p.id);
    const hiveCount = hives.filter(h => palletIds.includes(h.palletId) && h.status !== HiveStatus.DEAD).length;
    const nucCount = nuclei.filter(n => n.apiaryId === apiaryId).length;
    return { hiveCount, nucCount };
  };

  const filteredApiaries = apiaries.filter(apiary => {
      const term = searchTerm.toLowerCase();
      return apiary.name.toLowerCase().includes(term) || apiary.area.toLowerCase().includes(term);
  });

  // Calculate Pagination
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

  // Reset to page 1 when search changes
  React.useEffect(() => {
      setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h1 className="text-3xl font-bold text-amber-900">{t('apiaries.title')}</h1>
            <p className="text-slate-600">{t('apiaries.subtitle')}</p>
        </div>
        {currentUser.role === 'admin' && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
          >
            <Plus size={20} /> {t('apiaries.add')}
          </button>
        )}
      </div>

      {/* Search Filter */}
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
                <ApiaryCard key={apiary.id} apiary={apiary} hiveCount={counts.hiveCount} nucCount={counts.nucCount} t={t} />
            );
        })}
      </div>
      
      {filteredApiaries.length === 0 && (
          <div className="text-center py-10 text-slate-500 italic">
              No apiaries found matching "{searchTerm}".
          </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-8">
              <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-white hover:text-amber-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-colors"
                  title={t('pagination.prev')}
              >
                  <ChevronLeft size={20} />
              </button>
              
              <span className="text-sm font-medium text-slate-600">
                  {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
              </span>
              
              <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-white hover:text-amber-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-colors"
                  title={t('pagination.next')}
              >
                  <ChevronRight size={20} />
              </button>
          </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
            <h2 className="text-xl font-bold mb-4 text-slate-800">{t('modal.add_apiary')}</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('modal.name')}</label>
                <input 
                    required 
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    placeholder="e.g. Hidden Valley"
                    value={newApiary.name} 
                    onChange={e => setNewApiary({...newApiary, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('modal.area')}</label>
                <input 
                    required 
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    placeholder="e.g. North Sector"
                    value={newApiary.area} 
                    onChange={e => setNewApiary({...newApiary, area: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{t('modal.location')}</label>
                <input 
                    required 
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" 
                    placeholder="e.g. 40.7128, -74.0060"
                    value={newApiary.location} 
                    onChange={e => setNewApiary({...newApiary, location: e.target.value})} 
                />
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">{t('modal.cancel')}</button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-sm">{t('modal.create')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

interface ApiaryCardProps {
  apiary: Apiary;
  hiveCount: number;
  nucCount: number;
  t: any;
}

const ApiaryCard: React.FC<ApiaryCardProps> = ({ apiary, hiveCount, nucCount, t }) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-all group block relative">
    <div className="flex justify-between items-start mb-4">
      {/* Google Maps Link */}
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apiary.location)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-amber-100 p-3 rounded-lg text-amber-600 hover:bg-amber-600 hover:text-white transition-colors z-10"
        title={t('modal.view_maps')}
        onClick={(e) => e.stopPropagation()} 
      >
        <MapPin size={24} />
      </a>
      <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{apiary.area}</span>
    </div>
    
    <Link to={`/apiaries/${apiary.id}`} className="block">
        <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-amber-700 transition-colors">{apiary.name}</h3>
        <p className="text-sm text-slate-500 mb-4 truncate">{apiary.location}</p>
        
        <div className="flex gap-4 border-t pt-4">
            <div className="flex items-center gap-2">
                <Archive size={16} className="text-slate-400" />
                <span className="text-sm font-medium text-slate-700">{hiveCount} {t('apiaries.hives')}</span>
            </div>
            <div className="flex items-center gap-2">
                <Archive size={16} className="text-slate-400 opacity-50" />
                <span className="text-sm font-medium text-slate-700">{nucCount} {t('apiaries.nuclei')}</span>
            </div>
        </div>
    </Link>
  </div>
);

export default ApiaryList;