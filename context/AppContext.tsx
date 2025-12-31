
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AppState, Apiary, Hive, Nucleus, WorkLog, Pallet, User, UserStatus, AuditLog, ActionType, EntityType, HiveStatus, LidType, QueenStatus, Theme } from '../types';
import * as api from '../services/api';
import { useTheme } from './ThemeContext';

interface AppContextType extends AppState {
  addApiary: (apiary: Apiary) => void;
  updateApiary: (id: string, updates: Partial<Apiary>) => void; // Nueva función
  addPallet: (pallet: Pallet) => void;
  addHive: (hive: Hive) => void;
  updateHive: (id: string, updates: Partial<Hive>) => void;
  removeHive: (id: string) => void;
  moveHive: (hiveId: string, targetPalletId: string, targetApiaryId?: string, targetPosition?: number) => void;
  addNucleus: (nucleus: Nucleus) => void;
  updateNucleus: (id: string, updates: Partial<Nucleus>) => void;
  promoteNucleus: (nucleusId: string, targetPalletId: string, chamberCount: number) => void;
  addLog: (log: WorkLog) => void;
  updateLog: (id: string, updates: Partial<WorkLog>) => void;
  
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  adminAddUser: (newUser: User) => void;
  adminToggleUserStatus: (userId: string) => void;
  recoverPassword: (email: string, newPassword: string) => Promise<boolean>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Fix: Made children optional to prevent TypeScript error when using nested JSX elements.
export const AppProvider = ({ children }: { children?: ReactNode }) => {
  const [apiaries, setApiaries] = useState<Apiary[]>([]);
  const [pallets, setPallets] = useState<Pallet[]>([]);
  const [hives, setHives] = useState<Hive[]>([]);
  const [nuclei, setNuclei] = useState<Nucleus[]>([]);
  const [logs, setLogs] = useState<WorkLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const { setTheme } = useTheme();

  useEffect(() => {
      const cargarDatos = async () => {
          const [a, p, h, n, l, u, au] = await Promise.all([
              api.obtenerApiarios(),
              api.obtenerPallets(),
              api.obtenerColmenas(),
              api.obtenerNucleos(),
              api.obtenerLogs(),
              api.obtenerUsuarios(),
              api.obtenerAuditoria()
          ]);
          
          // Asegurar que todos los apiarios tengan status Active si no lo tienen
          setApiaries(a.map(apiary => ({ ...apiary, status: apiary.status || 'Active' })));
          setPallets(p);
          
          const hivesByPallet: Record<string, number> = {};
          const hivesEnriched = h.map(hive => {
             const currentCount = hivesByPallet[hive.palletId] || 0;
             hivesByPallet[hive.palletId] = currentCount + 1;
             
             return {
                 ...hive,
                 queenStatus: hive.queenStatus || QueenStatus.ALIVE,
                 queenOrigin: hive.queenOrigin || 'Local',
                 queenInstallDate: hive.queenInstallDate || '2023-05-10',
                 position: hive.position !== undefined ? hive.position : currentCount
             };
          });
          setHives(hivesEnriched);
          
          setNuclei(n);
          setLogs(l);
          setUsers(u);
          setAuditLogs(au);
      };
      cargarDatos();
  }, []);

  const registrarAuditoria = (entityType: EntityType, entityId: string, action: ActionType, details: string) => {
      const newLog: AuditLog = {
          id: `aud${Date.now()}`,
          entityType,
          entityId,
          action,
          details,
          performedBy: currentUser?.name || 'System',
          timestamp: new Date().toISOString()
      };
      api.crearRegistroAuditoria(newLog);
      setAuditLogs(prev => [newLog, ...prev]);
  };

  const login = async (identifier: string, password: string): Promise<boolean> => {
    const user = await api.loginUsuario(identifier, password);
    if (user) {
        if (user.status === UserStatus.DISABLED) {
            alert("Su cuenta ha sido deshabilitada. Contacte al administrador.");
            return false;
        }
        setCurrentUser(user);
        if (user.theme) setTheme(user.theme);
        return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setTheme('standard');
  };

  const recoverPassword = async (email: string, newPass: string): Promise<boolean> => {
      await api.actualizarUsuario(email, { password: newPass });
      registrarAuditoria(EntityType.USER, email, ActionType.UPDATE, 'Restablecimiento de contraseña');
      return true;
  };

  const updateUser = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updates };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
    if (updates.theme) setTheme(updates.theme);
    api.actualizarUsuario(currentUser.id, updates);
    registrarAuditoria(EntityType.USER, currentUser.id, ActionType.UPDATE, 'Usuario actualizó su perfil');
  };

  const adminAddUser = (newUser: User) => {
      api.crearUsuario(newUser);
      setUsers([...users, newUser]);
      registrarAuditoria(EntityType.USER, newUser.id, ActionType.CREATE, `Creó usuario ${newUser.username} (${newUser.role})`);
  };

  const adminToggleUserStatus = (userId: string) => {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      const newStatus = user.status === UserStatus.ACTIVE ? UserStatus.DISABLED : UserStatus.ACTIVE;
      api.actualizarUsuario(userId, { status: newStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      registrarAuditoria(EntityType.USER, userId, ActionType.UPDATE, `Cambió estado a ${newStatus}`);
  };

  const addApiary = (apiary: Apiary) => {
      const apiaryWithStatus = { ...apiary, status: 'Active' as const };
      api.crearApiario(apiaryWithStatus);
      setApiaries([...apiaries, apiaryWithStatus]);
      registrarAuditoria(EntityType.APIARY, apiary.id, ActionType.CREATE, `Creó apiario ${apiary.name}`);
  }

  const updateApiary = (id: string, updates: Partial<Apiary>) => {
      setApiaries(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
      api.actualizarApiario(id, updates);
      
      let detail = "Actualizó apiario";
      if (updates.name) detail = `Cambió nombre a ${updates.name}`;
      if (updates.status === 'Inactive') detail = `Desactivó apiario`;
      if (updates.status === 'Active') detail = `Activó apiario`;
      
      registrarAuditoria(EntityType.APIARY, id, ActionType.UPDATE, detail);
  }

  const addPallet = (pallet: Pallet) => {
      api.crearPallet(pallet);
      setPallets([...pallets, pallet]);
      registrarAuditoria(EntityType.PALLET, pallet.id, ActionType.CREATE, `Creó pallet ${pallet.code} en ${pallet.apiaryId}`);
  }

  const addHive = (hive: Hive) => {
      const existingPositions = hives
        .filter(h => h.palletId === hive.palletId && h.status !== HiveStatus.DEAD)
        .map(h => h.position || 0);
      
      let newPosition = 0;
      while (existingPositions.includes(newPosition)) newPosition++;

      const hiveWithPosition = { ...hive, position: newPosition };
      api.crearColmena(hiveWithPosition);
      setHives([...hives, hiveWithPosition]);
      registrarAuditoria(EntityType.HIVE, hive.id, ActionType.CREATE, `Añadió colmena a pallet ${hive.palletId} pos ${newPosition}`);
  }
  
  const updateHive = (id: string, updates: Partial<Hive>) => {
    const oldHive = hives.find(h => h.id === id);
    setHives(hives.map(h => h.id === id ? { ...h, ...updates, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: currentUser?.name || 'Unknown' } : h));
    api.actualizarColmena(id, updates);

    let changes = [];
    if (updates.status && oldHive?.status !== updates.status) changes.push(`Estado: ${oldHive?.status} -> ${updates.status}`);
    if (updates.chamberCount && oldHive?.chamberCount !== updates.chamberCount) changes.push(`Cámaras: ${oldHive?.chamberCount} -> ${updates.chamberCount}`);
    if (updates.queenStatus && oldHive?.queenStatus !== updates.queenStatus) changes.push(`Reina: ${oldHive?.queenStatus} -> ${updates.queenStatus}`);
    
    if (changes.length > 0) registrarAuditoria(EntityType.HIVE, id, ActionType.UPDATE, changes.join(', '));
  };

  const removeHive = (id: string) => {
      const hive = hives.find(h => h.id === id);
      if(hive) {
          api.eliminarColmena(id);
          setHives(prev => prev.filter(h => h.id !== id));
          registrarAuditoria(EntityType.HIVE, id, ActionType.DELETE, `Eliminó colmena del pallet ${hive.palletId}`);
      }
  }

  const moveHive = (hiveId: string, targetPalletId: string, targetApiaryId?: string, targetPosition?: number) => {
      const draggedHive = hives.find(h => h.id === hiveId);
      if(!draggedHive) return;
      
      const oldPallet = pallets.find(p => p.id === draggedHive.palletId);
      const newPallet = pallets.find(p => p.id === targetPalletId);

      let updatesHives = [...hives];
      let details = "";

      if (targetPosition !== undefined) {
          const residentHive = updatesHives.find(h => h.palletId === targetPalletId && h.position === targetPosition && h.status !== HiveStatus.DEAD && h.id !== hiveId);
          if (residentHive) {
              if (draggedHive.palletId === targetPalletId) {
                  const oldPos = draggedHive.position ?? 0;
                  details = `Intercambió posición ${oldPos} <-> ${targetPosition} en ${newPallet?.code}`;
                  updatesHives = updatesHives.map(h => {
                      if (h.id === hiveId) return { ...h, position: targetPosition };
                      if (h.id === residentHive.id) return { ...h, position: oldPos };
                      return h;
                  });
              } else {
                  details = `Intercambió ${draggedHive.id} por ${residentHive.id}`;
                  updatesHives = updatesHives.map(h => {
                      if (h.id === hiveId) return { ...h, palletId: targetPalletId, position: targetPosition };
                      if (h.id === residentHive.id) return { ...h, palletId: draggedHive.palletId, position: draggedHive.position };
                      return h;
                  });
              }
          } else {
              details = `Movió a posición ${targetPosition} en ${newPallet?.code}`;
              updatesHives = updatesHives.map(h => {
                  if (h.id === hiveId) return { ...h, palletId: targetPalletId, position: targetPosition };
                  return h;
              });
          }
      } else {
          const takenPositions = updatesHives.filter(h => h.palletId === targetPalletId && h.status !== HiveStatus.DEAD).map(h => h.position || 0);
          let newPos = 0;
          while (takenPositions.includes(newPos)) newPos++;
          details = `Movió a ${newPallet?.code} (Auto-pos: ${newPos})`;
          updatesHives = updatesHives.map(h => {
              if (h.id === hiveId) return { ...h, palletId: targetPalletId, position: newPos };
              return h;
          });
      }

      api.moverColmena(hiveId, targetPalletId, targetPosition);
      setHives(updatesHives);
      registrarAuditoria(EntityType.HIVE, hiveId, ActionType.MOVE, `${details}`);
  }

  const addNucleus = (nucleus: Nucleus) => {
      api.crearNucleo(nucleus);
      setNuclei([...nuclei, nucleus]);
      registrarAuditoria(EntityType.NUCLEUS, nucleus.id, ActionType.CREATE, `Creó núcleo en ${nucleus.apiaryId}`);
  }
  
  const updateNucleus = (id: string, updates: Partial<Nucleus>) => {
    const oldNuc = nuclei.find(n => n.id === id);
    api.actualizarNucleo(id, updates);
    setNuclei(nuclei.map(n => n.id === id ? { ...n, ...updates, lastUpdated: new Date().toISOString().split('T')[0], updatedBy: currentUser?.name || 'Unknown' } : n));
    if (updates.status && oldNuc?.status !== updates.status) registrarAuditoria(EntityType.NUCLEUS, id, ActionType.UPDATE, `Estado: ${oldNuc?.status} -> ${updates.status}`);
  };

  const promoteNucleus = (nucleusId: string, targetPalletId: string, chamberCount: number) => {
      const nucleus = nuclei.find(n => n.id === nucleusId);
      if (!nucleus) return;
      const takenPositions = hives.filter(h => h.palletId === targetPalletId && h.status !== HiveStatus.DEAD).map(h => h.position || 0);
      let newPos = 0;
      while (takenPositions.includes(newPos)) newPos++;

      const newHive: Hive = {
          id: `h${Date.now()}`,
          palletId: targetPalletId,
          chamberCount: chamberCount,
          lidType: LidType.STANDARD,
          status: HiveStatus.GOOD,
          lastUpdated: new Date().toISOString().split('T')[0],
          updatedBy: currentUser?.name || 'System',
          queenStatus: QueenStatus.ALIVE,
          queenInstallDate: new Date().toISOString().split('T')[0],
          queenOrigin: 'Nucleus',
          position: newPos
      };

      api.crearColmena(newHive);
      api.eliminarNucleo(nucleusId);
      setHives(prev => [...prev, newHive]);
      setNuclei(prev => prev.filter(n => n.id !== nucleusId));
      registrarAuditoria(EntityType.NUCLEUS, nucleusId, ActionType.PROMOTE, `Promovió Núcleo a Colmena ${newHive.id} en Pallet ${targetPalletId}`);
  };

  const addLog = (log: WorkLog) => {
      api.crearLog(log);
      setLogs([...logs, log]);
      registrarAuditoria(EntityType.LOG, log.id, ActionType.CREATE, `Registro de trabajo: ${log.type}`);
  }
  
  const updateLog = (id: string, updates: Partial<WorkLog>) => {
    api.actualizarLog(id, updates);
    setLogs(logs.map(l => l.id === id ? { ...l, ...updates } : l));
    if (updates.status) registrarAuditoria(EntityType.LOG, id, ActionType.UPDATE, `Estado de registro: ${updates.status}`);
  };

  return (
    <AppContext.Provider value={{
      apiaries, pallets, hives, nuclei, logs, currentUser, users, auditLogs,
      addApiary, updateApiary, addPallet, addHive, updateHive, removeHive, moveHive, addNucleus, updateNucleus, promoteNucleus, addLog, updateLog, 
      login, logout, updateUser, adminAddUser, adminToggleUserStatus, recoverPassword
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
