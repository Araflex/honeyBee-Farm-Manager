
import { Apiary, Pallet, Hive, Nucleus, WorkLog, User, LidType, NucleusStatus, TaskType, TaskStatus, HiveStatus, UserStatus, AuditLog, EntityType, ActionType } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u1',
    username: 'admin',
    name: 'Super',
    lastname: 'Admin',
    email: 'admin@honeyfarm.com',
    passport: 'A12345678',
    dateOfBirth: '1985-05-15',
    country: 'Canada',
    phone: '555-0123',
    password: 'admin',
    role: 'admin',
    status: UserStatus.ACTIVE
  },
  {
    id: 'u2',
    username: 'beekeeper_bob',
    name: 'Bob',
    lastname: 'Smith',
    email: 'bob@honeyfarm.com',
    passport: 'B98765432',
    dateOfBirth: '1990-08-20',
    country: 'USA',
    phone: '555-9876',
    password: 'user',
    role: 'beekeeper',
    status: UserStatus.ACTIVE
  },
  {
    id: 'u3',
    username: 'new_guy',
    name: 'John',
    lastname: 'Doe',
    email: 'new@honeyfarm.com',
    passport: 'C11223344',
    dateOfBirth: '1995-01-10',
    country: 'Mexico',
    phone: '555-0000',
    password: 'password',
    role: 'beekeeper',
    status: UserStatus.DISABLED
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
    {
        id: 'aud1',
        entityType: EntityType.HIVE,
        entityId: 'h1',
        action: ActionType.UPDATE,
        details: 'Status changed from Regular to Good',
        performedBy: 'Super Admin',
        timestamp: '2023-10-01T10:00:00Z'
    },
    {
        id: 'aud2',
        entityType: EntityType.NUCLEUS,
        entityId: 'n2',
        action: ActionType.CREATE,
        details: 'Nucleus installed',
        performedBy: 'Bob Smith',
        timestamp: '2023-09-15T14:30:00Z'
    }
];

const RAW_APIARIES = [
  { name: "17-4", area: "Botha" },
  { name: "225", area: "Other Side Of the River" },
  { name: "4 Amigos", area: "601 West" },
  { name: "Aguados", area: "601 West" },
  { name: "Airport", area: "West of Stettler" },
  { name: "Alamania 1", area: "Botha" },
  { name: "Alamania 2", area: "Botha" },
  { name: "Alfalfa", area: "Fenn Road Big Valley" },
  { name: "Antena", area: "North on 56" },
  { name: "Arbollas", area: "South and east of the house" },
  { name: "Banco Tierra", area: "Fenn Road Big Valley" },
  { name: "Beside The 21", area: "601 West" },
  { name: "Beside The 21 -2", area: "601 West" },
  { name: "Blue Gates", area: "Botha" },
  { name: "Bomba Roga", area: "West of Stettler" },
  { name: "Borregos", area: "North on 56" },
  { name: "Buffalo", area: "Fenn Road Big Valley" },
  { name: "Caballos Jovenes", area: "North on 56" },
  { name: "Caballos Viejos", area: "601 West" },
  { name: "Cama Gardin", area: "601 West" },
  { name: "Cas Vieja De Roham", area: "Linda Hall Road" },
  { name: "Casa Vieja", area: "Fenn Road Big Valley" },
  { name: "Casa Vieja", area: "North on 56" },
  { name: "Casa Vieja", area: "Linda Hall Road" },
  { name: "Casa Vieja De Erskine", area: "601 West" },
  { name: "Castor", area: "Fenn Road Big Valley" },
  { name: "Cementario", area: "West of Stettler" },
  { name: "Cementario", area: "Other Side Of the River" },
  { name: "Charco", area: "West of Stettler" },
  { name: "Chivos", area: "601 West" },
  { name: "Chocco", area: "West of Stettler" },
  { name: "Compressor", area: "Other Side Of the River" },
  { name: "Compressor", area: "601 West" },
  { name: "Corner Of 11/12", area: "West of Stettler" },
  { name: "Dairy Farm/Lecheritos", area: "Red Willow" },
  { name: "Ducks 1", area: "601 West" },
  { name: "Ducks 2", area: "601 West" },
  { name: "Dugout", area: "West of Stettler" },
  { name: "El Nuevo", area: "Other Side Of the River" },
  { name: "El Nuevo", area: "North on 56" },
  { name: "Erskine", area: "West of Stettler" },
  { name: "Escualita", area: "North on 56" },
  { name: "Esquina De Erskine", area: "601 West" },
  { name: "Fletcha", area: "Fenn Road Big Valley" },
  { name: "Golf II/La Loma", area: "601 West" },
  { name: "Grandpas Berry Farm", area: "West of Stettler" },
  { name: "Hay Field", area: "Red Willow" },
  { name: "Hogies", area: "West of Stettler" },
  { name: "Illisha", area: "601 West" },
  { name: "Kempfs", area: "South and east of the house" },
  { name: "Kieths", area: "Red Willow" },
  { name: "Kudras", area: "Linda Hall Road" },
  { name: "La Isla", area: "North on 56" },
  { name: "La Junta", area: "South and east of the house" },
  { name: "La Loma", area: "North on 56" },
  { name: "La Loma", area: "West of Stettler" },
  { name: "La Loma", area: "Other Side Of the River" },
  { name: "La Loma", area: "Red Willow" },
  { name: "Lagoona De Crocodilla", area: "Red Willow" },
  { name: "Lagoona Senora", area: "601 West" },
  { name: "Linda Hall", area: "Linda Hall Road" },
  { name: "Linea De Luz", area: "601 West" },
  { name: "Linea De Luz", area: "Red Willow" },
  { name: "Llamas", area: "Fenn Road Big Valley" },
  { name: "Llanta De Pablo", area: "West of Stettler" },
  { name: "MacArthers", area: "Botha" },
  { name: "Maquinas Viejas", area: "Fenn Road Big Valley" },
  { name: "Maquinas Viejos", area: "Other Side Of the River" },
  { name: "Maquinaz Veijos", area: "Red Willow" },
  { name: "Marshmellow 1", area: "Botha" },
  { name: "Marshmellow 2", area: "Botha" },
  { name: "Mennonite Church", area: "Fenn Road Big Valley" },
  { name: "Messy Farm", area: "Linda Hall Road" },
  { name: "Mina De Graba", area: "Fenn Road Big Valley" },
  { name: "Mina De Graba", area: "North on 56" },
  { name: "Narrows", area: "601 West" },
  { name: "Nevis Gas Plant", area: "West of Stettler" },
  { name: "New Yard", area: "Other Side Of the River" },
  { name: "Ol Macdonald", area: "601 West" },
  { name: "Old Cars", area: "West of Stettler" },
  { name: "Owl 1", area: "601 West" },
  { name: "Owl 2", area: "601 West" },
  { name: "Paja Rollo", area: "Linda Hall Road" },
  { name: "Paquetes 1", area: "Red Willow" },
  { name: "Paquetes 2", area: "Red Willow" },
  { name: "Pigs I Puercos I", area: "North on 56" },
  { name: "Pigs II Puercos II", area: "North on 56" },
  { name: "PPS", area: "Fenn Road Big Valley" },
  { name: "Puerto Azul", area: "South and east of the house" },
  { name: "Puerto Azul", area: "Fenn Road Big Valley" },
  { name: "Puerto Verde", area: "Other Side Of the River" },
  { name: "Pumpjacks", area: "Linda Hall Road" },
  { name: "Radiador De Luciano", area: "Fenn Road Big Valley" },
  { name: "Red Willow", area: "Red Willow" },
  { name: "Road Allowance", area: "601 West" },
  { name: "Road Allowance", area: "North on 56" },
  { name: "Rohan", area: "Linda Hall Road" },
  { name: "Ross Lake", area: "Linda Hall Road" },
  { name: "Ruta De Tren", area: "South and east of the house" },
  { name: "Ruta De Tren", area: "North on 56" },
  { name: "Salmon Ranches", area: "North on 56" },
  { name: "Salmon Sur", area: "North on 56" },
  { name: "Saskatoon", area: "Linda Hall Road" },
  { name: "Skocdapoles 1", area: "Fenn Road Big Valley" },
  { name: "Skocdapoles 2", area: "Fenn Road Big Valley" },
  { name: "Steel Plate", area: "Linda Hall Road" },
  { name: "Tanques Negros", area: "Fenn Road Big Valley" },
  { name: "Tanques Viejos", area: "Fenn Road Big Valley" },
  { name: "Toros", area: "Fenn Road Big Valley" },
  { name: "Tower 1", area: "South and east of the house" },
  { name: "Tower 2", area: "South and east of the house" },
  { name: "UFA Road", area: "601 West" },
  { name: "Vacas Jovenes", area: "Botha" },
  { name: "White Sands", area: "601 West" },
  { name: "White Tanks", area: "601 West" },
  { name: "Windmill", area: "Linda Hall Road" },
  { name: "Windmill", area: "Other Side Of the River" }
];

export const INITIAL_APIARIES: Apiary[] = RAW_APIARIES.map((a, index) => ({
  id: `a${index}`,
  name: a.name,
  area: a.area,
  location: "Alberta, CA", 
  honeyHarvestedKg: Math.floor(Math.random() * 800) + 100 
}));

export const INITIAL_PALLETS: Pallet[] = [
  { id: 'p1', apiaryId: 'a0', code: 'P-001', capacity: 4 }, 
  { id: 'p2', apiaryId: 'a0', code: 'P-002', capacity: 4 },
  { id: 'p3', apiaryId: 'a2', code: 'P-003', capacity: 2 }, 
];

export const INITIAL_HIVES: Hive[] = [
  { id: 'h1', palletId: 'p1', chamberCount: 2, lidType: LidType.MIGRATORY, status: HiveStatus.GOOD, lastUpdated: '2023-10-01', updatedBy: 'Mike' },
  { id: 'h2', palletId: 'p1', chamberCount: 1, lidType: LidType.STANDARD, status: HiveStatus.REGULAR, lastUpdated: '2023-10-05', updatedBy: 'Sarah' },
  { id: 'h3', palletId: 'p2', chamberCount: 3, lidType: LidType.TELESCOPING, status: HiveStatus.BAD, lastUpdated: '2023-09-20', updatedBy: 'Mike' },
  { id: 'h4', palletId: 'p3', chamberCount: 2, lidType: LidType.MIGRATORY, status: HiveStatus.GOOD, lastUpdated: '2023-10-10', updatedBy: 'Admin User' },
];

export const INITIAL_NUCLEI: Nucleus[] = [
  { id: 'n1', apiaryId: 'a0', status: NucleusStatus.GOOD, installDate: '2023-09-01', lastUpdated: '2023-09-15', updatedBy: 'Sarah' },
  { id: 'n2', apiaryId: 'a1', status: NucleusStatus.READY, installDate: '2023-08-15', lastUpdated: '2023-10-01', updatedBy: 'Mike' }, 
];

const futureDate = new Date();
futureDate.setDate(futureDate.getDate() + 5);
const pendingDateStr = futureDate.toISOString().split('T')[0];

export const INITIAL_LOGS: WorkLog[] = [
  { id: 'l1', apiaryId: 'a0', date: '2023-10-01', type: TaskType.FEEDING, description: 'Fed 2:1 syrup to all hives.', status: TaskStatus.COMPLETED, completedBy: 'Mike', completedDate: '2023-10-01' },
  { id: 'l2', apiaryId: 'a0', date: '2023-10-15', type: TaskType.VARROA_CONTROL, description: 'Apply oxalic acid drip.', status: TaskStatus.PENDING, assignedTo: 'Sarah' },
  { id: 'l3', apiaryId: 'a2', date: pendingDateStr, type: TaskType.INSPECTION, description: 'Check for queen cells.', status: TaskStatus.PENDING, assignedTo: 'Mike' },
];
