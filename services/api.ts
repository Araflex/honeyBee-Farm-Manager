
import { Apiary, Hive, Nucleus, Pallet, User, WorkLog, AuditLog } from '../types';
import { INITIAL_APIARIES, INITIAL_HIVES, INITIAL_LOGS, INITIAL_NUCLEI, INITIAL_PALLETS, INITIAL_USERS, INITIAL_AUDIT_LOGS } from './mockData';

/**
 * SERVICIO DE API (Simulado)
 * --------------------------
 * Este archivo actúa como una capa de abstracción para las llamadas al backend.
 * Actualmente devuelve datos mockeados (simulados).
 * 
 * PARA IMPLEMENTAR LA API REAL:
 * 1. Instalar axios: `npm install axios`
 * 2. Configurar una instancia base: `const api = axios.create({ baseURL: process.env.API_URL });`
 * 3. Reemplazar las promesas simuladas con llamadas reales: `return await api.get('/apiaries');`
 */

// Simulación de latencia de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// --- APIARIOS ---

export const obtenerApiarios = async (): Promise<Apiary[]> => {
    // API: GET /api/apiaries
    await delay(300);
    return [...INITIAL_APIARIES];
};

export const crearApiario = async (apiary: Apiary): Promise<Apiary> => {
    // API: POST /api/apiaries
    // Body: { name, area, location }
    await delay(300);
    return apiary;
};

// --- PALLETS ---

export const obtenerPallets = async (): Promise<Pallet[]> => {
    // API: GET /api/pallets
    await delay(300);
    return [...INITIAL_PALLETS];
};

export const crearPallet = async (pallet: Pallet): Promise<Pallet> => {
    // API: POST /api/pallets
    // Body: { apiaryId, code, capacity }
    await delay(300);
    return pallet;
};

// --- COLMENAS (HIVES) ---

export const obtenerColmenas = async (): Promise<Hive[]> => {
    // API: GET /api/hives
    // Debería incluir detalles de reina si existen
    await delay(300);
    // En la App real, esto vendría de la DB. Aquí inyectamos datos enriquecidos.
    return [...INITIAL_HIVES]; 
};

export const crearColmena = async (hive: Hive): Promise<Hive> => {
    // API: POST /api/hives
    // Body: { palletId, chamberCount, lidType, status, queenStatus, ... }
    await delay(300);
    return hive;
};

export const actualizarColmena = async (id: string, updates: Partial<Hive>): Promise<Hive> => {
    // API: PATCH /api/hives/:id
    // Body: updates
    await delay(300);
    return { ...INITIAL_HIVES.find(h => h.id === id)!, ...updates } as Hive;
};

export const eliminarColmena = async (id: string): Promise<void> => {
    // API: DELETE /api/hives/:id
    await delay(300);
};

export const moverColmena = async (hiveId: string, targetPalletId: string, targetPosition?: number): Promise<void> => {
    // API: POST /api/hives/:id/move
    // Body: { targetPalletId, targetPosition }
    await delay(300);
};

// --- NÚCLEOS ---

export const obtenerNucleos = async (): Promise<Nucleus[]> => {
    // API: GET /api/nuclei
    await delay(300);
    return [...INITIAL_NUCLEI];
};

export const crearNucleo = async (nucleus: Nucleus): Promise<Nucleus> => {
    // API: POST /api/nuclei
    await delay(300);
    return nucleus;
};

export const actualizarNucleo = async (id: string, updates: Partial<Nucleus>): Promise<Nucleus> => {
    // API: PATCH /api/nuclei/:id
    await delay(300);
    return { ...INITIAL_NUCLEI.find(n => n.id === id)!, ...updates } as Nucleus;
};

export const eliminarNucleo = async (id: string): Promise<void> => {
    // API: DELETE /api/nuclei/:id
    await delay(300);
};

// --- REGISTROS DE TRABAJO (LOGS) ---

export const obtenerLogs = async (): Promise<WorkLog[]> => {
    // API: GET /api/logs
    await delay(300);
    return [...INITIAL_LOGS];
};

export const crearLog = async (log: WorkLog): Promise<WorkLog> => {
    // API: POST /api/logs
    await delay(300);
    return log;
};

export const actualizarLog = async (id: string, updates: Partial<WorkLog>): Promise<WorkLog> => {
    // API: PATCH /api/logs/:id
    await delay(300);
    return { ...INITIAL_LOGS.find(l => l.id === id)!, ...updates } as WorkLog;
};

// --- USUARIOS Y AUTH ---

export const obtenerUsuarios = async (): Promise<User[]> => {
    // API: GET /api/users (Solo Admin)
    await delay(300);
    return [...INITIAL_USERS];
};

export const loginUsuario = async (identifier: string, password: string): Promise<User | null> => {
    // API: POST /api/auth/login
    // Body: { email: identifier, password }
    // Retorna: { token, user }
    await delay(500);
    const user = INITIAL_USERS.find(u => 
        (u.email.toLowerCase() === identifier.toLowerCase() || u.username.toLowerCase() === identifier.toLowerCase()) && 
        u.password === password
    );
    return user || null;
};

export const actualizarUsuario = async (id: string, updates: Partial<User>): Promise<User> => {
    // API: PATCH /api/users/:id
    await delay(300);
    return { ...INITIAL_USERS.find(u => u.id === id)!, ...updates } as User;
};

export const crearUsuario = async (user: User): Promise<User> => {
    // API: POST /api/users
    await delay(300);
    return user;
};

// --- AUDITORÍA ---

export const obtenerAuditoria = async (): Promise<AuditLog[]> => {
    // API: GET /api/audit-logs (Paginado idealmente)
    await delay(300);
    return [...INITIAL_AUDIT_LOGS];
};

export const crearRegistroAuditoria = async (audit: AuditLog): Promise<void> => {
    // API: Generalmente esto lo maneja el Backend automáticamente en cada acción,
    // pero si el frontend necesita forzar un log: POST /api/audit-logs
    await delay(100);
};
