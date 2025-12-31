
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Auth
    'login.title': 'ApiaryMaster',
    'login.subtitle': 'Sign in to manage your hives',
    'login.email': 'Email or Username',
    'login.password': 'Password',
    'login.submit': 'Sign In',
    'login.forgot': 'Forgot Password?',
    
    // Layout
    'nav.dashboard': 'Dashboard',
    'nav.apiaries': 'Apiaries',
    'nav.logs': 'Work Logs',
    'nav.varroa': 'Varroa Control',
    'nav.assistant': 'AI Assistant',
    'nav.users': 'Users',
    'nav.audit': 'Audit Log',
    'nav.profile': 'Profile',
    'nav.logout': 'Sign Out',
    
    // Varroa
    'varroa.title': 'Varroa Infestation Control',
    'varroa.subtitle': 'Record and calculate mite infestation rates.',
    'varroa.bees_count': 'Total Bees Sampled',
    'varroa.mites_count': 'Mites Found',
    'varroa.infestation_rate': 'Infestation Rate',
    'varroa.notes': 'Observations / Notes',
    'varroa.save': 'Save Record',
    'varroa.select_hive': 'Select Hive',
    'varroa.success': 'Record saved successfully',

    // Tasks Management in ApiaryDetail
    'detail.tasks_title': 'Tasks & Operations',
    'detail.add_task': 'New Task',
    'detail.no_tasks': 'No tasks scheduled for this apiary.',
    'detail.edit_task': 'Edit Task',
    'detail.confirm_delete_task': 'Are you sure you want to delete this task?',

    // Dashboard
    'dash.welcome': 'Hello',
    'dash.schedule': 'Here is your schedule for today.',
    'dash.system_online': 'System Online',
    'dash.upcoming': 'Upcoming Tasks',
    'dash.no_tasks': 'No pending tasks. Great job!',
    'dash.location': 'Location',
    'dash.work_mode': 'Work Mode',
    'dash.work_desc': 'Record your activities in the field immediately.',
    'dash.open_log': 'Open Work Log',
    'dash.quick_access': 'Apiary Quick Access',
    'dash.view_all': 'View All Apiaries',
    'dash.total_hives': 'Total Hives',
    'dash.active_nucs': 'Active Nuclei',
    'dash.honey_harvest': 'Honey Harvested',
    'dash.pending_tasks': 'Pending Tasks',
    'dash.honey_prod': 'Honey Production by Apiary',
    'dash.colony_strength': 'Colony Strength (Chambers)',
    'dash.queen_health': 'Queen Health',
    'dash.queens_replace': 'Queens to Replace (>2yr)',
    'dash.varroa_trends': 'Varroa Infestation Trends (%)',
    'dash.hive_status': 'Hive Status Distribution',

    // Apiary List
    'apiaries.title': 'Apiaries',
    'apiaries.subtitle': 'Manage your locations and colonies.',
    'apiaries.add': 'Add Apiary',
    'apiaries.search_placeholder': 'Search by name or area...',
    'apiaries.hives': 'Hives',
    'apiaries.nuclei': 'Nucs',
    'modal.add_apiary': 'Add New Apiary',
    'modal.name': 'Name',
    'modal.area': 'Area',
    'modal.location': 'Location (GPS/Address)',
    'modal.view_maps': 'View on Google Maps',

    // Apiary Detail
    'detail.back': 'Back to Apiaries',
    'detail.ai_check': 'AI Health Check',
    'detail.analyzing': 'Analyzing...',
    'detail.add_pallet': 'Add Pallet',
    'detail.hives_pallet': 'Hives by Pallet',
    'detail.cap': 'Cap',
    'detail.nuclei': 'Nuclei (Future Hives)',
    'detail.add_nuc': 'Add Nuc',
    'detail.id': 'ID',
    'detail.status': 'Status',
    'detail.install_date': 'Install Date',
    'detail.updated_by': 'Updated By',
    'detail.no_nucs': 'No nuclei recorded.',
    'detail.actions': 'Actions',
    
    // Statuses
    'status.good': 'Good',
    'status.bad': 'Bad',
    'status.ready': 'Ready',
    'status.regular': 'Regular',
    'status.dead': 'Dead',
    'status.active': 'Active',
    'status.disabled': 'Disabled',
    'status.pending': 'Pending',
    'status.completed': 'Completed',
    
    // Queen Status
    'queen.virgin': 'Virgin',
    'queen.alive': 'Alive',
    'queen.dead': 'Dead',
    'queen.rejected': 'Rejected',
    'queen.cell': 'Cell/Capullo',
    
    // Modals
    'modal.add_pallet': 'Add New Pallet',
    'modal.capacity': 'Capacity (Max Hives)',
    'modal.cancel': 'Cancel',
    'modal.create': 'Create',
    'modal.save': 'Save',
    'modal.add_hive': 'Add Hive',
    'modal.update_hive': 'Update Hive',
    'modal.update_nuc': 'Update Nucleus Status',
    'modal.promote_nuc': 'Promote to Hive',
    'modal.promote_desc': 'Transfer this nucleus to a pallet to become a full hive.',
    'modal.target_apiary': 'Target Apiary',
    'modal.target_pallet': 'Target Pallet',
    'modal.promote_confirm': 'Transfer & Create Hive',
    'modal.chambers': 'Chambers',
    'modal.lid': 'Lid Type',
    'modal.pallet_task': 'Add Task to Pallet',
    'modal.select_hives': 'Select Involved Hives',
    'modal.select_all': 'Select All',
    'modal.pallet_full': 'Pallet Limit Reached',
    'modal.pallet_full_desc': 'The selected pallet has no space available.',
    'modal.create_pallet': 'Create New Pallet',
    'modal.queen_info': 'Queen Information',
    'modal.queen_origin': 'Queen Origin',
    'modal.queen_date': 'Install Date',
    'modal.queen_status': 'Queen Status',
    'modal.move_hive': 'Move Hive',
    'modal.remove_hive': 'Remove Hive (Free Slot)',

    // Work Logs
    'logs.title': 'Work Logs & Schedule',
    'logs.subtitle': 'Track treatments, feedings, and inspections.',
    'logs.record': 'Record Log',
    'logs.filters': 'Filters',
    'logs.all_areas': 'All Areas',
    'logs.all_apiaries': 'All Apiaries',
    'logs.clear': 'Clear',
    'logs.no_logs': 'No logs found matching criteria.',
    'logs.overdue': 'Overdue',
    'logs.assigned': 'Assigned',
    'logs.done_by': 'Done by',
    'logs.apiary_search': 'Search Apiary...',
    'logs.level_apiary': 'Log for Apiary',
    'logs.level_pallet': 'Log for Pallet',
    'logs.level_hives': 'Log for Specific Hives',
    'modal.record_log': 'Record New Log',
    'modal.date': 'Date',
    'modal.type': 'Type',
    'modal.description': 'Description / Job Details',
    'modal.description_ph': 'e.g. Fed 2:1 syrup, checked for mites...',
    'modal.select_pallet': 'Select Pallet (Optional)',
    'modal.select_hives_opt': 'Select Hives (Optional)',
    'log.harvested_chambers': 'Chambers Extracted',
    'log.harvested_frames': 'Frames Extracted',
    'log.varroa_pct': 'Varroa Infestation %',
    'task.harvest_swap': 'Harvest Swap / Extraction',

    // Profile
    'profile.title': 'User Profile',
    'profile.subtitle': 'Manage your personal information and security settings.',
    'profile.username': 'Username',
    'profile.full_name': 'First Name',
    'profile.lastname': 'Last Name',
    'profile.passport': 'Passport / ID',
    'profile.dob': 'Date of Birth',
    'profile.country': 'Country',
    'profile.email': 'Email Address',
    'profile.phone': 'Phone Number',
    'profile.password': 'Password',
    'profile.save_changes': 'Save Changes',
    'profile.saved': 'Saved',
    'profile.local_session': 'All changes are local to this session.',
    'profile.changes_saved': 'Changes saved successfully!',

    // User Management
    'users.title': 'User Management',
    'users.subtitle': 'Manage team access and roles.',
    'users.invite': 'Add New User',
    'users.user': 'User',
    'users.role': 'Role',
    'users.status': 'Status',
    'users.actions': 'Actions',
    'users.enable': 'Enable',
    'users.disable': 'Disable',
    'modal.invite_user': 'Create User Account',
    'modal.send_invite': 'Create Account',
    'users.view_profile': 'View Full Profile',

    // Audit Log
    'audit.title': 'Audit Log',
    'audit.subtitle': 'Track all system changes and user actions.',
    'audit.entity': 'Entity',
    'audit.action': 'Action',
    'audit.details': 'Details',
    'audit.user': 'User',
    'audit.time': 'Timestamp',
    'audit.filter_user': 'Filter by User',
    'audit.filter_type': 'Filter by Entity',
    'audit.search_details': 'Search details...',

    // Recovery
    'recovery.back': 'Back to Login',
    'recovery.reset_title': 'Reset Password',
    'recovery.enter_email': "Enter your email address and we'll send you a verification code.",
    'recovery.send_code': 'Send Code',
    'recovery.sending': 'Sending...',
    'recovery.check_email': 'Check your Email',
    'recovery.code_sent': 'We sent a 6-digit code to',
    'recovery.verify_code': 'Verify Code',
    'recovery.verifying': 'Verifying...',
    'recovery.set_new_pass': 'Set New Password',
    'recovery.choose_pass': 'Choose a strong password for your account.',
    'recovery.new_pass': 'New Password',
    'recovery.saving': 'Saving...',
    'recovery.success_title': 'Password Reset!',
    'recovery.success_msg': 'Your password has been successfully updated.',
    'recovery.back_login': 'Back to Login',
    
    // Pagination
    'pagination.prev': 'Previous',
    'pagination.next': 'Next',
    'pagination.page': 'Page',
    'pagination.of': 'of',
  },
  es: {
    // Auth
    'login.title': 'ApiaryMaster',
    'login.subtitle': 'Inicia sesión para gestionar',
    'login.email': 'Correo o Usuario',
    'login.password': 'Contraseña',
    'login.submit': 'Ingresar',
    'login.forgot': '¿Olvidaste tu contraseña?',

    // Layout
    'nav.dashboard': 'Panel',
    'nav.apiaries': 'Apiarios',
    'nav.logs': 'Registros',
    'nav.varroa': 'Control Varroa',
    'nav.assistant': 'Asistente IA',
    'nav.users': 'Usuarios',
    'nav.audit': 'Auditoría',
    'nav.profile': 'Perfil',
    'nav.logout': 'Salir',

    // Varroa
    'varroa.title': 'Control de Infestación por Varroa',
    'varroa.subtitle': 'Registra y calcula los niveles de infestación.',
    'varroa.bees_count': 'Total de Abejas de la Muestra',
    'varroa.mites_count': 'Ácaros Encontrados',
    'varroa.infestation_rate': 'Tasa de Infestación',
    'varroa.notes': 'Observaciones / Notas',
    'varroa.save': 'Guardar Registro',
    'varroa.select_hive': 'Seleccionar Colmena',
    'varroa.success': 'Registro guardado con éxito',

    // Tasks Management in ApiaryDetail
    'detail.tasks_title': 'Tareas y Operaciones',
    'detail.add_task': 'Nueva Tarea',
    'detail.no_tasks': 'No hay tareas programadas para este apiario.',
    'detail.edit_task': 'Editar Tarea',
    'detail.confirm_delete_task': '¿Estás seguro de que deseas eliminar esta tarea?',

    // Dashboard
    // Fix: Removed duplicate keys that were causing object literal errors.
    'dash.welcome': 'Hola',
    'dash.schedule': 'Aquí está tu agenda para hoy.',
    'dash.system_online': 'Sistema en Línea',
    'dash.upcoming': 'Próximas Tareas',
    'dash.no_tasks': 'No hay tareas pendientes. ¡Buen trabajo!',
    'dash.location': 'Ubicación',
    'dash.work_mode': 'Modo Trabajo',
    'dash.work_desc': 'Registra actividades en campo inmediatamente.',
    'dash.open_log': 'Abrir Registros',
    'dash.quick_access': 'Acceso Rápido',
    'dash.view_all': 'Ver Todos',
    'dash.total_hives': 'Total Colmenas',
    'dash.active_nucs': 'Núcleos Activos',
    'dash.honey_harvest': 'Miel Cosechada',
    'dash.pending_tasks': 'Tareas Pendientes',
    'dash.honey_prod': 'Producción de Miel',
    'dash.colony_strength': 'Fortaleza (Cámaras)',
    'dash.queen_health': 'Estado de Reinas',
    'dash.queens_replace': 'Reinas a Reemplazar (>2 años)',
    'dash.varroa_trends': 'Tendencia de Varroa (%)',
    'dash.hive_status': 'Estado de Colmenas',

    // Apiary List
    'apiaries.title': 'Apiarios',
    'apiaries.subtitle': 'Administra tus ubicaciones y colonias.',
    'apiaries.add': 'Agregar Apiario',
    'apiaries.search_placeholder': 'Buscar por nombre o área...',
    'apiaries.hives': 'Colmenas',
    'apiaries.nuclei': 'Núcleos',
    'modal.add_apiary': 'Nuevo Apiario',
    'modal.name': 'Nombre',
    'modal.area': 'Área',
    'modal.location': 'Ubicación (GPS/Dirección)',
    'modal.view_maps': 'Ver en Google Maps',

    // Apiary Detail
    'detail.back': 'Volver a Apiarios',
    'detail.ai_check': 'Análisis IA',
    'detail.analyzing': 'Analizando...',
    'detail.add_pallet': 'Agregar Pallet',
    'detail.hives_pallet': 'Colmenas por Pallet',
    'detail.cap': 'Cap',
    'detail.nuclei': 'Núcleos (Futuras Colmenas)',
    'detail.add_nuc': 'Agregar Núcleo',
    'detail.id': 'ID',
    'detail.status': 'Estado',
    'detail.install_date': 'Fecha Instalación',
    'detail.updated_by': 'Actualizado Por',
    'detail.no_nucs': 'No hay núcleos registrados.',
    'detail.actions': 'Acciones',

    // Statuses
    'status.good': 'Bueno',
    'status.bad': 'Malo',
    'status.ready': 'Listo',
    'status.regular': 'Regular',
    'status.dead': 'Muerta',
    'status.active': 'Activo',
    'status.disabled': 'Desactivado',
    'status.pending': 'Pendiente',
    'status.completed': 'Completado',

    // Queen Status
    'queen.virgin': 'Virgen',
    'queen.alive': 'Viva',
    'queen.dead': 'Muerta',
    'queen.rejected': 'Rechazada',
    'queen.cell': 'Capullo/Celda',

    // Modals
    'modal.add_pallet': 'Nuevo Pallet',
    'modal.capacity': 'Capacidad (Máx Colmenas)',
    'modal.cancel': 'Cancelar',
    'modal.create': 'Crear',
    'modal.save': 'Guardar',
    'modal.add_hive': 'Agregar Colmena',
    'modal.update_hive': 'Actualizar Colmena',
    'modal.update_nuc': 'Actualizar Estado Núcleo',
    'modal.promote_nuc': 'Promover a Colmena',
    'modal.promote_desc': 'Traslada este núcleo a un pallet para convertirlo en colmena.',
    'modal.target_apiary': 'Apiario Destino',
    'modal.target_pallet': 'Pallet Destino',
    'modal.promote_confirm': 'Trasladar y Crear',
    'modal.chambers': 'Cámaras',
    'modal.lid': 'Tipo de Tapa',
    'modal.pallet_task': 'Tarea de Pallet',
    'modal.select_hives': 'Seleccionar Colmenas',
    'modal.select_all': 'Seleccionar Todas',
    'modal.pallet_full': 'Límite de Pallet Alcanzado',
    'modal.pallet_full_desc': 'El pallet seleccionado no tiene espacio disponible.',
    'modal.create_pallet': 'Crear Nuevo Pallet',
    'modal.queen_info': 'Información de la Reina',
    'modal.queen_origin': 'Origen',
    'modal.queen_date': 'Fecha Alta',
    'modal.queen_status': 'Estado Reina',
    'modal.move_hive': 'Mover Colmena',
    'modal.remove_hive': 'Quitar Colmena (Liberar Espacio)',

    // Work Logs
    'logs.title': 'Registros de Trabajo',
    'logs.subtitle': 'Seguimiento de tratamientos, alimentación e inspecciones.',
    'logs.record': 'Registrar',
    'logs.filters': 'Filtros',
    'logs.all_areas': 'Todas las Áreas',
    'logs.all_apiaries': 'Todos los Apiarios',
    'logs.clear': 'Limpiar',
    'logs.no_logs': 'No se encontraron registros.',
    'logs.overdue': 'Atrasado',
    'logs.assigned': 'Asignado',
    'logs.done_by': 'Hecho por',
    'logs.apiary_search': 'Buscar Apiario...',
    'logs.level_apiary': 'Tarea para Apiario',
    'logs.level_pallet': 'Tarea para Pallet',
    'logs.level_hives': 'Tarea para Colmenas Específicas',
    'modal.record_log': 'Nuevo Registro',
    'modal.date': 'Fecha',
    'modal.type': 'Tipo',
    'modal.description': 'Descripción / Detalles',
    'modal.description_ph': 'ej. Alimentación 2:1, control de ácaros...',
    'modal.select_pallet': 'Seleccionar Pallet (Opcional)',
    'modal.select_hives_opt': 'Seleccionar Colmenas (Opcional)',
    'log.harvested_chambers': 'Cámaras Extraídas',
    'log.harvested_frames': 'Bastidores Extraídos',
    'log.varroa_pct': '% Infestación Varroa',
    'task.harvest_swap': 'Recambio de Cámaras/Cosecha',

    // Profile
    'profile.title': 'Perfil de Usuario',
    'profile.subtitle': 'Gestiona tu información personal y seguridad.',
    'profile.username': 'Usuario',
    'profile.full_name': 'Nombre',
    'profile.lastname': 'Apellido',
    'profile.passport': 'Pasaporte / ID',
    'profile.dob': 'Fecha de Nacimiento',
    'profile.country': 'País',
    'profile.email': 'Correo Electrónico',
    'profile.phone': 'Teléfono',
    'profile.password': 'Contraseña',
    'profile.save_changes': 'Guardar Cambios',
    'profile.saved': 'Guardado',
    'profile.local_session': 'Los cambios son locales en esta sesión.',
    'profile.changes_saved': '¡Cambios guardados con éxito!',

    // User Management
    'users.title': 'Gestión de Usuarios',
    'users.subtitle': 'Gestiona el acceso del equipo y roles.',
    'users.invite': 'Agregar Usuario',
    'users.user': 'Usuario',
    'users.role': 'Rol',
    'users.status': 'Estado',
    'users.actions': 'Acciones',
    'users.enable': 'Habilitar',
    'users.disable': 'Deshabilitar',
    'modal.invite_user': 'Crear Cuenta de Usuario',
    'modal.send_invite': 'Crear Cuenta',
    'users.view_profile': 'Ver Perfil Completo',

    // Audit Log
    'audit.title': 'Registro de Auditoría',
    'audit.subtitle': 'Rastrea todos los cambios del sistema y acciones de usuario.',
    'audit.entity': 'Entidad',
    'audit.action': 'Acción',
    'audit.details': 'Detalles',
    'audit.user': 'Usuario',
    'audit.time': 'Marca de Tiempo',
    'audit.filter_user': 'Filtrar por Usuario',
    'audit.filter_type': 'Filtrar por Entidad',
    'audit.search_details': 'Buscar detalles...',

    // Recovery
    'recovery.back': 'Volver al Login',
    'recovery.reset_title': 'Restablecer Contraseña',
    'recovery.enter_email': 'Ingresa tu correo y te enviaremos un código de verificación.',
    'recovery.send_code': 'Enviar Código',
    'recovery.sending': 'Enviando...',
    'recovery.check_email': 'Revisa tu Correo',
    'recovery.code_sent': 'Enviamos un código de 6 dígitos a',
    'recovery.verify_code': 'Verificar Código',
    'recovery.verifying': 'Verificando...',
    'recovery.set_new_pass': 'Nueva Contraseña',
    'recovery.choose_pass': 'Elige una contraseña segura.',
    'recovery.new_pass': 'Nueva Contraseña',
    'recovery.saving': 'Guardando...',
    'recovery.success_title': '¡Contraseña Restablecida!',
    'recovery.success_msg': 'Tu contraseña ha sido actualizada.',
    'recovery.back_login': 'Ir al Login',
    
    // Pagination
    'pagination.prev': 'Anterior',
    'pagination.next': 'Siguiente',
    'pagination.page': 'Página',
    'pagination.of': 'de',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Fix: Made children optional to prevent TypeScript error when using nested JSX elements.
export const LanguageProvider = ({ children }: { children?: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('es'); 

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
