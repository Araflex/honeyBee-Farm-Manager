
import { Apiary, Hive, Nucleus, Pallet, User, WorkLog, AuditLog } from '../types';
import { INITIAL_APIARIES, INITIAL_HIVES, INITIAL_LOGS, INITIAL_NUCLEI, INITIAL_PALLETS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from './mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const obtenerApiarios = async (): Promise<Apiary[]> => {
    await delay(300);
    return [...INITIAL_APIARIES];
};

export const crearApiario = async (apiary: Apiary): Promise<Apiary> => {
    await delay(300);
    return apiary;
};

// Nueva función para actualizar apiario
export const actualizarApiario = async (id: string, updates: Partial<Apiary>): Promise<Apiary> => {
    // API: PATCH /api/apiaries/:id
    await delay(300);
    const existing = INITIAL_APIARIES.find(a => a.id === id);
    return { ...existing, ...updates } as Apiary;
};

export const obtenerPallets = async (): Promise<Pallet[]> => {
    await delay(300);
    return [...INITIAL_PALLETS];
};

export const crearPallet = async (pallet: Pallet): Promise<Pallet> => {
    await delay(300);
    return pallet;
};

export const obtenerColmenas = async (): Promise<Hive[]> => {
    await delay(300);
    return [...INITIAL_HIVES]; 
};

export const crearColmena = async (hive: Hive): Promise<Hive> => {
    await delay(300);
    return hive;
};

export const actualizarColmena = async (id: string, updates: Partial<Hive>): Promise<Hive> => {
    await delay(300);
    return { ...INITIAL_HIVES.find(h => h.id === id)!, ...updates } as Hive;
};

export const eliminarColmena = async (id: string): Promise<void> => {
    await delay(300);
};

export const moverColmena = async (hiveId: string, targetPalletId: string, targetPosition?: number): Promise<void> => {
    await delay(300);
};

export const obtenerNucleos = async (): Promise<Nucleus[]> => {
    await delay(300);
    return [...INITIAL_NUCLEI];
};

export const crearNucleo = async (nucleus: Nucleus): Promise<Nucleus> => {
    await delay(300);
    return nucleus;
};

export const actualizarNucleo = async (id: string, updates: Partial<Nucleus>): Promise<Nucleus> => {
    await delay(300);
    return { ...INITIAL_NUCLEI.find(n => n.id === id)!, ...updates } as Nucleus;
};

export const eliminarNucleo = async (id: string): Promise<void> => {
    await delay(300);
};

export const obtenerLogs = async (): Promise<WorkLog[]> => {
    await delay(300);
    return [...INITIAL_LOGS];
};

export const crearLog = async (log: WorkLog): Promise<WorkLog> => {
    await delay(300);
    return log;
};

export const actualizarLog = async (id: string, updates: Partial<WorkLog>): Promise<WorkLog> => {
    await delay(300);
    return { ...INITIAL_LOGS.find(l => l.id === id)!, ...updates } as WorkLog;
};

export const eliminarLog = async (id: string): Promise<void> => {
    await delay(300);
};

export const obtenerUsuarios = async (): Promise<User[]> => {
    await delay(300);
    return [...INITIAL_USERS];
};

export const loginUsuario = async (identifier: string, password: string): Promise<User | null> => {
    await delay(500);
    const user = INITIAL_USERS.find(u => 
        (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()) && 
        u.password === password
    );
    return user || null;
};

export const actualizarUsuario = async (id: string, updates: Partial<User>): Promise<User> => {
    await delay(300);
    return { ...INITIAL_USERS.find(u => u.id === id)!, ...updates } as User;
};

export const crearUsuario = async (user: User): Promise<User> => {
    await delay(300);
    return user;
};

export const obtenerAuditoria = async (): Promise<AuditLog[]> => {
    await delay(300);
    return [...INITIAL_AUDIT_LOGS];
};

export const crearRegistroAuditoria = async (audit: AuditLog): Promise<void> => {
    await delay(100);
};
