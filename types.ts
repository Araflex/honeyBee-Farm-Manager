
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

export interface AuditLog {
  id: string;
  entityType: EntityType;
  entityId: string;
  action: ActionType;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface Hive {
  id: string;
  palletId: string;
  chamberCount: number;
  lidType: LidType;
  status: HiveStatus;
  lastUpdated: string;
  updatedBy: string;
  position?: number; 
  queenStatus?: QueenStatus;
  queenOrigin?: string;
  queenInstallDate?: string;
}

export interface Pallet {
  id: string;
  apiaryId: string;
  code: string;
  capacity: number;
}

export interface Nucleus {
  id: string;
  apiaryId: string;
  status: NucleusStatus;
  installDate: string;
  lastUpdated: string;
  updatedBy: string;
}

export interface Apiary {
  id: string;
  name: string;
  area: string;
  location: string;
  honeyHarvestedKg: number;
  status?: 'Active' | 'Inactive'; // Nuevo campo para control de estado
}

export interface WorkLog {
  id: string;
  apiaryId: string;
  palletId?: string;
  hiveIds?: string[];
  date: string;
  type: TaskType;
  description: string;
  status: TaskStatus;
  assignedTo?: string;
  completedBy?: string;
  completedDate?: string;
  harvestedChambers?: number;
  harvestedFrames?: number;
  varroaPercentage?: number;
}

export interface User {
  id: string;
  username: string;
  name: string;
  lastname: string;
  email: string;
  passport?: string;
  dateOfBirth?: string;
  country?: string;
  phone?: string;
  password?: string;
  role: 'admin' | 'beekeeper';
  status: UserStatus;
  theme?: Theme;
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
