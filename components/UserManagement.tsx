
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Users, UserPlus, Ban, CheckCircle, Mail, Shield, Eye, Calendar, MapPin, CreditCard, Phone, User as UserIcon } from 'lucide-react';
import { UserStatus, User } from '../types';

const UserManagement = () => {
  const { users, adminAddUser, adminToggleUserStatus } = useApp();
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [newUser, setNewUser] = useState<Partial<User>>({ 
      email: '', name: '', lastname: '', username: '', role: 'beekeeper', country: '', passport: '', dateOfBirth: ''
  });

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.email || !newUser.username) return;

    const userToAdd: User = {
        id: `u${Date.now()}`,
        username: newUser.username!,
        name: newUser.name!,
        lastname: newUser.lastname || '',
        email: newUser.email!,
        role: newUser.role as 'admin' | 'beekeeper',
        status: UserStatus.PENDING,
        passport: newUser.passport,
        country: newUser.country,
        dateOfBirth: newUser.dateOfBirth,
        password: 'password123', // Default
        phone: newUser.phone
    };

    adminAddUser(userToAdd);
    setIsModalOpen(false);
    setNewUser({ email: '', name: '', lastname: '', username: '', role: 'beekeeper', country: '', passport: '', dateOfBirth: '' });
  };

  const openViewModal = (user: User) => {
      setSelectedUser(user);
      setIsViewModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-bold text-amber-900">{t('users.title')}</h1>
            <p className="text-slate-600">{t('users.subtitle')}</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-amber-700 transition-colors shadow-sm"
        >
            <UserPlus size={20} /> {t('users.invite')}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold text-sm">
                  <tr>
                      <th className="p-4">{t('users.user')}</th>
                      <th className="p-4">{t('users.role')}</th>
                      <th className="p-4">{t('users.status')}</th>
                      <th className="p-4 text-right">{t('users.actions')}</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                  {users.map(user => (
                      <tr 
                        key={user.id} 
                        className="hover:bg-amber-50 transition-colors cursor-pointer group"
                        onClick={() => openViewModal(user)}
                      >
                          <td className="p-4">
                              <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold group-hover:bg-amber-200 group-hover:text-amber-800 transition-colors">
                                      {user.name.charAt(0)}{user.lastname ? user.lastname.charAt(0) : ''}
                                  </div>
                                  <div>
                                      <div className="font-medium text-slate-800">{user.name} {user.lastname}</div>
                                      <div className="text-sm text-slate-500">@{user.username}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="p-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide
                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                  {user.role === 'admin' && <Shield size={12} />} {user.role}
                              </span>
                          </td>
                          <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold
                                ${user.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-700' : 
                                  user.status === UserStatus.DISABLED ? 'bg-red-100 text-red-700' : 
                                  'bg-orange-100 text-orange-700'}`}>
                                  {t(`status.${user.status.toLowerCase()}`)}
                              </span>
                          </td>
                          <td className="p-4 text-right">
                              <div className="flex justify-end items-center gap-2" onClick={e => e.stopPropagation()}>
                                  {user.role !== 'admin' && (
                                      <button 
                                          onClick={() => adminToggleUserStatus(user.id)}
                                          className={`p-2 rounded-full border transition-colors
                                          ${user.status === UserStatus.ACTIVE 
                                              ? 'border-red-200 text-red-600 hover:bg-red-50' 
                                              : 'border-green-200 text-green-600 hover:bg-green-50'}`}
                                          title={user.status === UserStatus.ACTIVE ? t('users.disable') : t('users.enable')}
                                      >
                                          {user.status === UserStatus.ACTIVE ? <Ban size={16} /> : <CheckCircle size={16} />}
                                      </button>
                                  )}
                                  <button onClick={() => openViewModal(user)} className="text-slate-400 hover:text-amber-600 p-2">
                                    <Eye size={18} />
                                  </button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>

      {/* Add User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 overflow-y-auto max-h-[90vh]">
                <h2 className="text-xl font-bold text-slate-800 mb-6 border-b pb-4">{t('modal.invite_user')}</h2>
                <form onSubmit={handleAddUser} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Account Info */}
                        <div className="col-span-full">
                            <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-4 bg-amber-50 p-2 rounded">Account Info</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.username')}</label>
                                    <input required className="w-full border rounded-lg px-3 py-2" value={newUser.username} onChange={e => setNewUser({...newUser, username: e.target.value})} placeholder="jdoe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.email')}</label>
                                    <input required type="email" className="w-full border rounded-lg px-3 py-2" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} placeholder="john@example.com" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('users.role')}</label>
                                    <select className="w-full border rounded-lg px-3 py-2" value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as any})}>
                                        <option value="beekeeper">Beekeeper</option>
                                        <option value="admin">Administrator</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="col-span-full">
                             <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider mb-4 bg-amber-50 p-2 rounded">Personal Info</h3>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.full_name')}</label>
                                    <input required className="w-full border rounded-lg px-3 py-2" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} placeholder="John" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.lastname')}</label>
                                    <input className="w-full border rounded-lg px-3 py-2" value={newUser.lastname} onChange={e => setNewUser({...newUser, lastname: e.target.value})} placeholder="Doe" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.passport')}</label>
                                    <input className="w-full border rounded-lg px-3 py-2" value={newUser.passport} onChange={e => setNewUser({...newUser, passport: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.dob')}</label>
                                    <input type="date" className="w-full border rounded-lg px-3 py-2" value={newUser.dateOfBirth} onChange={e => setNewUser({...newUser, dateOfBirth: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.country')}</label>
                                    <input className="w-full border rounded-lg px-3 py-2" value={newUser.country} onChange={e => setNewUser({...newUser, country: e.target.value})} placeholder="Canada" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.phone')}</label>
                                    <input className="w-full border rounded-lg px-3 py-2" value={newUser.phone} onChange={e => setNewUser({...newUser, phone: e.target.value})} placeholder="+1 555 0000" />
                                </div>
                             </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                        <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">{t('modal.cancel')}</button>
                        <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 shadow-sm">{t('modal.send_invite')}</button>
                    </div>
                </form>
            </div>
        </div>
      )}

      {/* View Profile Modal */}
      {isViewModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden relative">
                  <button onClick={() => setIsViewModalOpen(false)} className="absolute top-4 right-4 text-white/80 hover:text-white z-10">
                      <div className="bg-black/20 p-1 rounded-full"><Users size={20} /></div>
                  </button>
                  
                  {/* Header */}
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-8 text-white">
                      <div className="flex items-center gap-4">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold border-2 border-white/30">
                              {selectedUser.name.charAt(0)}{selectedUser.lastname ? selectedUser.lastname.charAt(0) : ''}
                          </div>
                          <div>
                              <h2 className="text-2xl font-bold">{selectedUser.name} {selectedUser.lastname}</h2>
                              <div className="flex items-center gap-2 opacity-90 text-sm">
                                  <span>@{selectedUser.username}</span>
                                  <span>•</span>
                                  <span className="uppercase font-semibold tracking-wider flex items-center gap-1">
                                    {selectedUser.role === 'admin' ? <Shield size={12}/> : <UserIcon size={12}/>} {selectedUser.role}
                                  </span>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1">
                                 <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><Mail size={12}/> {t('profile.email')}</div>
                                 <div className="text-slate-800 font-medium truncate">{selectedUser.email}</div>
                             </div>
                             <div className="space-y-1">
                                 <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><Phone size={12}/> {t('profile.phone')}</div>
                                 <div className="text-slate-800 font-medium">{selectedUser.phone || 'N/A'}</div>
                             </div>
                             <div className="space-y-1">
                                 <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><CreditCard size={12}/> {t('profile.passport')}</div>
                                 <div className="text-slate-800 font-medium">{selectedUser.passport || 'N/A'}</div>
                             </div>
                             <div className="space-y-1">
                                 <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><Calendar size={12}/> {t('profile.dob')}</div>
                                 <div className="text-slate-800 font-medium">{selectedUser.dateOfBirth || 'N/A'}</div>
                             </div>
                             <div className="space-y-1 col-span-2">
                                 <div className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1"><MapPin size={12}/> {t('profile.country')}</div>
                                 <div className="text-slate-800 font-medium">{selectedUser.country || 'N/A'}</div>
                             </div>
                        </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 border-t text-right">
                      <button onClick={() => setIsViewModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 font-medium text-sm">
                          Close
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default UserManagement;
