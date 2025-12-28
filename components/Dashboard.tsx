import React from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Package, Hexagon, Activity, Calendar, CheckSquare, ArrowRight, Users, Map } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HiveStatus } from '../types';

const Dashboard = () => {
  const { currentUser } = useApp();

  return currentUser?.role === 'admin' ? <AdminDashboard /> : <BeekeeperDashboard />;
};

const AdminDashboard = () => {
  const { apiaries, hives, users, auditLogs } = useApp();
  const { t } = useLanguage();
  const { currentUser } = useApp();

  const hiveStatusData = [
      { name: 'Good', value: hives.filter(h => h.status === HiveStatus.GOOD).length, color: '#22c55e' },
      { name: 'Regular', value: hives.filter(h => h.status === HiveStatus.REGULAR).length, color: '#eab308' },
      { name: 'Bad', value: hives.filter(h => h.status === HiveStatus.BAD).length, color: '#ef4444' },
      { name: 'Dead', value: hives.filter(h => h.status === HiveStatus.DEAD).length, color: '#64748b' },
  ];

  const recentActivity = auditLogs.slice(0, 5);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
        <header className="mb-8">
            <h1 className="text-3xl font-bold text-amber-900">{t('dash.welcome')}, {currentUser?.name} (Admin)</h1>
            <p className="text-slate-600">System Overview</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-amber-100 text-amber-600 rounded-full"><Map size={24} /></div>
                <div><div className="text-2xl font-bold">{apiaries.length}</div><div className="text-sm text-slate-500">{t('nav.apiaries')}</div></div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-yellow-100 text-yellow-600 rounded-full"><Package size={24} /></div>
                <div><div className="text-2xl font-bold">{hives.filter(h => h.status !== HiveStatus.DEAD).length}</div><div className="text-sm text-slate-500">{t('apiaries.hives')}</div></div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24} /></div>
                <div><div className="text-2xl font-bold">{users.length}</div><div className="text-sm text-slate-500">{t('nav.users')}</div></div>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex items-center gap-4">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Activity size={24} /></div>
                <div><div className="text-2xl font-bold">{auditLogs.length}</div><div className="text-sm text-slate-500">Audit Events</div></div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg mb-4 text-slate-800">{t('dash.hive_status')}</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie data={hiveStatusData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {hiveStatusData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-lg mb-4 text-slate-800">Recent System Activity</h3>
                <div className="space-y-4">
                    {recentActivity.map(log => (
                        <div key={log.id} className="flex items-start gap-3 text-sm">
                             <div className="mt-1 min-w-[4px] h-4 rounded-full bg-slate-300"></div>
                             <div>
                                 <div className="font-medium text-slate-800">{log.action} on {log.entityType}</div>
                                 <div className="text-slate-500">{log.details} by {log.performedBy}</div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

const BeekeeperDashboard = () => {
    const { logs, apiaries, currentUser, hives, nuclei } = useApp();
    const { t } = useLanguage();
    const pendingLogs = logs.filter(l => l.status === 'Pending').sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);

    const totalHives = hives.filter(h => h.status !== HiveStatus.DEAD).length;
    const activeNucs = nuclei.length;
    const pendingTasksCount = logs.filter(l => l.status === 'Pending').length;

    return (
        <div className="p-6 space-y-6 animate-fade-in">
            <header className="mb-8 bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-amber-900">{t('dash.welcome')}, {currentUser?.name} 👋</h1>
                    <p className="text-slate-600">{t('dash.schedule')}</p>
                </div>
                <div className="hidden sm:block">
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{t('dash.system_online')}</span>
                </div>
            </header>
            
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-amber-500 text-white p-6 rounded-xl shadow-lg">
                    <div className="flex justify-between items-center mb-2">
                        <span className="font-medium opacity-90">{t('dash.total_hives')}</span>
                        <Package size={20} />
                    </div>
                    <div className="text-3xl font-bold">{totalHives}</div>
                </div>
                <div className="bg-blue-500 text-white p-6 rounded-xl shadow-lg">
                     <div className="flex justify-between items-center mb-2">
                        <span className="font-medium opacity-90">{t('dash.active_nucs')}</span>
                        <Hexagon size={20} />
                    </div>
                    <div className="text-3xl font-bold">{activeNucs}</div>
                </div>
                 <div className="bg-emerald-500 text-white p-6 rounded-xl shadow-lg">
                     <div className="flex justify-between items-center mb-2">
                        <span className="font-medium opacity-90">{t('dash.pending_tasks')}</span>
                        <CheckSquare size={20} />
                    </div>
                    <div className="text-3xl font-bold">{pendingTasksCount}</div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Calendar className="text-amber-600" /> {t('dash.upcoming')}
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        {pendingLogs.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">{t('dash.no_tasks')}</div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {pendingLogs.map(log => {
                                    const apiary = apiaries.find(a => a.id === log.apiaryId);
                                    return (
                                        <div key={log.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded text-white ${log.type === 'Feeding' ? 'bg-orange-400' : log.type === 'Medication' ? 'bg-red-400' : 'bg-blue-400'}`}>
                                                        {log.type}
                                                    </span>
                                                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{log.date}</span>
                                                </div>
                                                <h3 className="font-semibold text-slate-800">{log.description}</h3>
                                                <p className="text-sm text-slate-500">{t('dash.location')}: {apiary?.name || 'Unknown'}</p>
                                            </div>
                                            <Link to="/logs" className="text-slate-300 group-hover:text-amber-500 transition-colors">
                                                <ArrowRight size={20} />
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                            <Link to="/logs" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                                {t('dash.open_log')} &rarr;
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="text-amber-600" /> {t('dash.quick_access')}
                    </h2>
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                        <div className="space-y-2">
                            {apiaries.slice(0, 5).map(apiary => (
                                <Link key={apiary.id} to={`/apiaries/${apiary.id}`} className="block p-3 rounded-lg hover:bg-amber-50 transition-colors border border-transparent hover:border-amber-100">
                                    <div className="font-medium text-slate-800">{apiary.name}</div>
                                    <div className="text-xs text-slate-500">{apiary.area}</div>
                                </Link>
                            ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-slate-100 text-center">
                             <Link to="/apiaries" className="text-sm font-medium text-amber-600 hover:text-amber-700">
                                {t('dash.view_all')}
                            </Link>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default Dashboard;