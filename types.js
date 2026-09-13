// Enums y constantes del sistema en JavaScript puro

export const LidType = {
  STANDARD: 'Standard',
  TELESCOPING: 'Telescoping',
  MIGRATORY: 'Migratory'
};

export const NucleusStatus = {
  BAD: 'Bad',    // Malo
  GOOD: 'Good',  // Bueno
  READY: 'Ready' // Listo
};

export const HiveStatus = {
  GOOD: 'Good',
  REGULAR: 'Regular',
  BAD: 'Bad',
  DEAD: 'Dead' // Muerta/Sacrificada
};

export const QueenStatus = {
  VIRGIN: 'Virgin',
  ALIVE: 'Alive',
  DEAD: 'Dead',
  REJECTED: 'Rejected',
  CELL: 'Cell' // Capullo
};

export const TaskType = {
  FEEDING: 'Feeding',
  MEDICATION: 'Medication',
  VARROA_CONTROL: 'Varroa Control',
  HARVEST: 'Harvest',
  HARVEST_SWAP: 'Harvest Swap', // Recambio de camaras
  INSPECTION: 'Inspection',
  GENERAL: 'General'
};

export const TaskStatus = {
  PENDING: 'Pending',
  COMPLETED: 'Completed'
};

export const UserStatus = {
  ACTIVE: 'Active',
  DISABLED: 'Disabled',
  PENDING: 'Pending'
};

export const EntityType = {
  HIVE: 'Hive',
  PALLET: 'Pallet',
  NUCLEUS: 'Nucleus',
  USER: 'User',
  APIARY: 'Apiary',
  LOG: 'WorkLog'
};

export const ActionType = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  PROMOTE: 'Promote',
  MOVE: 'Move'
};
