
export enum LidType {
  STANDARD = 'Standard',
  TELESCOPING = 'Telescoping',
  MIGRATORY = 'Migratory'
}

export enum NucleusStatus {
  BAD = 'Bad',    // Malo
  GOOD = 'Good',  // Bueno
  READY = 'Ready' // Listo
}

export enum HiveStatus {
  GOOD = 'Good',
  REGULAR = 'Regular',
  BAD = 'Bad',
  DEAD = 'Dead' // Muerta/Sacrificada
}

export enum QueenStatus {
  VIRGIN = 'Virgin',
  ALIVE = 'Alive',
  DEAD = 'Dead',
  REJECTED = 'Rejected',
  CELL = 'Cell' // Capullo
}

export enum TaskType {
  FEEDING = 'Feeding',
  MEDICATION = 'Medication',
  VARROA_CONTROL = 'Varroa Control',
  HARVEST = 'Harvest',
  HARVEST_SWAP = 'Harvest Swap', // Recambio de camaras
  INSPECTION = 'Inspection',
  GENERAL = 'General'
}

export enum TaskStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed'
}

export enum UserStatus {
  ACTIVE = 'Active',
  DISABLED = 'Disabled',
  PENDING = 'Pending'
}

export enum EntityType {
  HIVE = 'Hive',
  PALLET = 'Pallet',
  NUCLEUS = 'Nucleus',
  USER = 'User',
  APIARY = 'Apiary',
  LOG = 'WorkLog'
}

export enum ActionType {
  CREATE = 'Create',
  UPDATE = 'Update',
  DELETE = 'Delete',
  PROMOTE = 'Promote',
  MOVE = 'Move'
}

export type Theme = 'standard' | 'light' | 'dark';

// API: Estructura para el registro de auditoría.
// Backend debe generar 'id' y 'timestamp' automáticamente.
export interface AuditLog {
  id: string; // UUID
  entityType: EntityType;
  entityId: string;
  action: ActionType;
  details: string;
  performedBy: string; // ID o Nombre del usuario que realizó la acción
  timestamp: string; // ISO 8601
}

// API: Estructura principal de una Colmena.
// Requiere relación con Pallet (palletId).
export interface Hive {
  id: string; // UUID
  palletId: string; // Foreign Key -> Pallets
  chamberCount: number; // Int (1-4)
  lidType: LidType;
  status: HiveStatus;
  lastUpdated: string; // ISO Date
  updatedBy: string; // Nombre de usuario
  // Posición en el Pallet (0-3 para pallets de 4)
  position?: number; 
  // Detalles de la Reina (Pueden ser nulos si no hay info)
  queenStatus?: QueenStatus;
  queenOrigin?: string; // String libre
  queenInstallDate?: string; // ISO Date
}

// API: Estructura de Pallet.
// Requiere relación con Apiary (apiaryId).
export interface Pallet {
  id: string; // UUID
  apiaryId: string; // Foreign Key -> Apiaries
  code: string; // Código único visible (ej. P-001)
  capacity: number; // Por defecto 4
}

// API: Estructura de Núcleo.
// Requiere relación con Apiary (apiaryId).
export interface Nucleus {
  id: string; // UUID
  apiaryId: string; // Foreign Key -> Apiaries
  status: NucleusStatus;
  installDate: string; // ISO Date
  lastUpdated: string; // ISO Date
  updatedBy: string;
}

// API: Estructura de Apiario (Lugar físico).
export interface Apiary {
  id: string; // UUID
  name: string;
  area: string; // Zona o Región
  location: string; // Coordenadas GPS o Dirección
  honeyHarvestedKg: number; // Acumulativo calculado o almacenado
}

// API: Registro de trabajo / Tareas.
// Puede estar vinculado a un Apiario, un Pallet específico o un array de Colmenas.
export interface WorkLog {
  id: string; // UUID
  apiaryId: string; // Foreign Key -> Apiaries
  palletId?: string; // Foreign Key -> Pallets (Opcional)
  hiveIds?: string[]; // Array of UUIDs (Opcional)
  date: string; // ISO Date (Fecha programada)
  type: TaskType;
  description: string;
  status: TaskStatus;
  assignedTo?: string; // Usuario asignado
  completedBy?: string; // Usuario que completó
  completedDate?: string; // ISO Date
  // Específicos de Cosecha
  harvestedChambers?: number;
  harvestedFrames?: number;
  // Específicos de Varroa
  varroaPercentage?: number;
}

// API: Usuario del sistema.
// La contraseña NUNCA debe devolverse en el objeto User al frontend en producción.
export interface User {
  id: string; // UUID
  username: string;
  name: string;
  lastname: string;
  email: string;
  passport?: string;
  dateOfBirth?: string;
  country?: string;
  phone?: string;
  password?: string; // Solo para simulación/creación. En prod, hash.
  role: 'admin' | 'beekeeper';
  status: UserStatus;
  theme?: Theme; // Preferencia de tema del usuario
}

export interface AppState {
  apiaries: Apiary[];
  pallets: Pallet[];
  hives: Hive[];
  nuclei: Nucleus[];
  logs: WorkLog[];
  currentUser: User | null;
  users: User[];
  auditLogs: AuditLog[];
}
