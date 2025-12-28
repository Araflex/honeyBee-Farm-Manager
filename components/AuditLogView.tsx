
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Clock, Shield, User, FileText, Activity, Filter, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { EntityType, ActionType } from '../types';

const AuditLogView = () => {
  const { auditLogs, users } = useApp();
  const { t } = useLanguage();
  
  // Filter States
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const getActionColor = (action: ActionType) => {
      switch(action) {
          case ActionType.CREATE: return 'bg-green-100 text-green-700';
          case ActionType.UPDATE: return 'bg-blue-100 text-blue-700';
          case ActionType.DELETE: return 'bg-red-100 text-red-700';
          case ActionType.PROMOTE: return 'bg-purple-100 text-purple-700';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  const getEntityIcon = (type: EntityType) => {
      switch(type) {
          case EntityType.USER: return <User size={14} />;
          case EntityType.LOG: return <FileText size={14} />;
          case EntityType.APIARY:
          case EntityType.PALLET:
          case EntityType.HIVE:
          case EntityType.NUCLEUS: return <Activity size={14} />;
          default: return <Activity size={14} />;
      }
  };

  const uniqueUsers = Array.from(new Set(auditLogs.map(log => log.performedBy)));

  const filteredLogs = auditLogs.filter(log => {
      if (selectedUser && log.performedBy !== selectedUser) return false;
      if (selectedType && log.entityType !== selectedType) return false;
      if (searchTerm && !log.details.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      return true;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  );

  const handlePageChange = (newPage: number) => {
      if (newPage >= 1 && newPage <= totalPages) {
          setCurrentPage(newPage);
      }
  };

  // Reset page on filter change
  React.useEffect(() => {
      setCurrentPage(1);
  }, [selectedUser, selectedType, searchTerm]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
        <div>
            <h1 className="text-3xl font-bold text-amber-900">{t('audit.title')}</h1>
            <p className="text-slate-600">{t('audit.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-slate-500 font-medium">
                <Filter size={18} /> {t('logs.filters')}:
            </div>

            {/* User Filter */}
            <select 
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
            >
                <option value="">{t('audit.filter_user')}</option>
                {uniqueUsers.map(u => <option key={u} value={u}>{u}</option>)}
            </select>

            {/* Entity Type Filter */}
            <select 
                className="bg-white border border-slate-300 text-slate-700 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block p-2"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
            >
                <option value="">{t('audit.filter_type')}</option>
                {Object.values(EntityType).map(type => <option key={type} value={type}>{type}</option>)}
            </select>

            {/* Search Input */}
            <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    className="w-full bg-white border border-slate-300 text-slate-700 text-sm rounded-lg pl-9 pr-2 py-2 focus:ring-amber-500 focus:border-amber-500"
                    placeholder={t('audit.search_details')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Clear Filters */}
            {(selectedUser || selectedType || searchTerm) && (
                <button 
                    onClick={() => { setSelectedUser(''); setSelectedType(''); setSearchTerm(''); }}
                    className="text-xs text-red-500 hover:text-red-700 font-medium flex items-center gap-1"
                >
                    <X size={14} /> {t('logs.clear')}
                </button>
            )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                        <tr>
                            <th className="p-4 whitespace-nowrap">{t('audit.time')}</th>
                            <th className="p-4 whitespace-nowrap">{t('audit.user')}</th>
                            <th className="p-4 whitespace-nowrap">{t('audit.action')}</th>
                            <th className="p-4 whitespace-nowrap">{t('audit.entity')}</th>
                            <th className="p-4 w-full">{t('audit.details')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {currentLogs.map(log => (
                            <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-slate-500 whitespace-nowrap font-mono text-xs">
                                    <div className="flex items-center gap-2">
                                        <Clock size={14} />
                                        {new Date(log.timestamp).toLocaleString()}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-slate-700">
                                    {log.performedBy}
                                </td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                                        {log.action}
                                    </span>
                                </td>
                                <td className="p-4">
                                     <div className="flex items-center gap-2 text-slate-600">
                                        {getEntityIcon(log.entityType)}
                                        <span className="font-semibold">{log.entityType}</span>
                                        <span className="text-xs bg-slate-100 px-1 rounded border border-slate-200 font-mono text-slate-400">{log.entityId}</span>
                                     </div>
                                </td>
                                <td className="p-4 text-slate-600">
                                    {log.details}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-400">
                    No audit logs available matching your filters.
                </div>
            ) : (
                /* Pagination Controls */
                <div className="p-4 border-t border-slate-100 flex justify-center items-center gap-4 bg-slate-50">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-white hover:text-amber-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-colors"
                        title={t('pagination.prev')}
                    >
                        <ChevronLeft size={16} />
                    </button>
                    
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">
                        {t('pagination.page')} {currentPage} {t('pagination.of')} {totalPages}
                    </span>
                    
                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-white hover:text-amber-600 disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-slate-600 transition-colors"
                        title={t('pagination.next')}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    </div>
  );
};

export default AuditLogView;
