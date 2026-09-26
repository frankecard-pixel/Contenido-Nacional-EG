import { User, UserRole } from '../types';

/**
 * Granular Permissions Definition
 */
export const PERMISSIONS = {
  // Users Management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_DELETE: 'users.delete',

  // Companies Management
  COMPANIES_VIEW: 'companies.view',
  COMPANIES_CREATE: 'companies.create',
  COMPANIES_EDIT: 'companies.edit',
  COMPANIES_VERIFY: 'companies.verify',

  // Documents Management
  DOCUMENTS_VIEW: 'documents.view',
  DOCUMENTS_UPLOAD: 'documents.upload',
  DOCUMENTS_APPROVE: 'documents.approve',

  // Nationalization & Talent
  NATIONALIZATION_VIEW: 'nationalization.view',
  NATIONALIZATION_CREATE: 'nationalization.create',
  NATIONALIZATION_EDIT: 'nationalization.edit',
  NATIONALIZATION_REVIEW: 'nationalization.review',
  NATIONALIZATION_APPROVE: 'nationalization.approve',

  TALENT_VIEW: 'talent.view',
  TALENT_CREATE: 'talent.create',
  TALENT_EDIT: 'talent.edit',
  TALENT_VERIFY: 'talent.verify',

  EXPATRIATES_VIEW: 'expatriates.view',
  EXPATRIATES_CREATE: 'expatriates.create',
  EXPATRIATES_EDIT: 'expatriates.edit',

  TRANSFER_VIEW: 'transfer.view',
  TRANSFER_CREATE: 'transfer.create',
  TRANSFER_EDIT: 'transfer.edit',
  TRANSFER_APPROVE: 'transfer.approve',

  MATCHING_VIEW: 'matching.view',
  MATCHING_EXECUTE: 'matching.execute',

  // Training & Scholarships
  TRAINING_VIEW: 'training.view',
  TRAINING_CREATE: 'training.create',
  TRAINING_APPROVE: 'training.approve',

  // Social Projects
  SOCIAL_PROJECTS_VIEW: 'social_projects.view',
  SOCIAL_PROJECTS_CREATE: 'social_projects.create',
  SOCIAL_PROJECTS_APPROVE: 'social_projects.approve',

  // Jobs & Applications
  JOBS_VIEW: 'jobs.view',
  JOBS_CREATE: 'jobs.create',
  JOBS_APPLY: 'jobs.apply',

  // Audit & System Reports
  AUDIT_VIEW: 'audit.view',
  SETTINGS_EDIT: 'settings.edit',
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Role to Default Permissions Mapping
 */
export const ROLE_DEFAULT_PERMISSIONS: Record<string, string[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(PERMISSIONS),
  [UserRole.ADMIN]: Object.values(PERMISSIONS),
  
  [UserRole.DIRECTOR]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.COMPANIES_VERIFY,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_APPROVE,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.NATIONALIZATION_APPROVE,
    PERMISSIONS.TRAINING_VIEW,
    PERMISSIONS.TRAINING_APPROVE,
    PERMISSIONS.SOCIAL_PROJECTS_VIEW,
    PERMISSIONS.SOCIAL_PROJECTS_APPROVE,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.AUDIT_VIEW,
  ],

  [UserRole.RESPONSABLE_SECCION]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.COMPANIES_VERIFY,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_APPROVE,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.NATIONALIZATION_CREATE,
    PERMISSIONS.NATIONALIZATION_EDIT,
    PERMISSIONS.TRAINING_VIEW,
    PERMISSIONS.TRAINING_CREATE,
    PERMISSIONS.SOCIAL_PROJECTS_VIEW,
    PERMISSIONS.JOBS_VIEW,
  ],

  [UserRole.FUNCIONARIO]: [
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.TRAINING_VIEW,
    PERMISSIONS.SOCIAL_PROJECTS_VIEW,
    PERMISSIONS.JOBS_VIEW,
  ],

  [UserRole.CUERPO_TECNICO]: [
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.TRAINING_VIEW,
    PERMISSIONS.SOCIAL_PROJECTS_VIEW,
  ],
  [UserRole.TECNICO]: [
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.TRAINING_VIEW,
    PERMISSIONS.SOCIAL_PROJECTS_VIEW,
  ],

  [UserRole.SECRETARIA]: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.TRAINING_VIEW,
  ],

  [UserRole.PETROLERA]: [
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.NATIONALIZATION_CREATE,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_CREATE,
    PERMISSIONS.SOCIAL_PROJECTS_VIEW,
    PERMISSIONS.SOCIAL_PROJECTS_CREATE,
  ],

  [UserRole.COMPANY]: [
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_CREATE,
  ],
  [UserRole.EMPRESA]: [
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_CREATE,
  ],
  [UserRole.EMPRESA_LOCAL]: [
    PERMISSIONS.COMPANIES_VIEW,
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_CREATE,
  ],

  [UserRole.PERSONA]: [
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.TRAINING_VIEW,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_APPLY,
  ],
  [UserRole.PROFESIONAL]: [
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.DOCUMENTS_UPLOAD,
    PERMISSIONS.NATIONALIZATION_VIEW,
    PERMISSIONS.TRAINING_VIEW,
    PERMISSIONS.JOBS_VIEW,
    PERMISSIONS.JOBS_APPLY,
  ],

  [UserRole.COMUNICACION]: [
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.SOCIAL_PROJECTS_VIEW,
  ],

  [UserRole.COMUNIDAD]: [
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.SOCIAL_PROJECTS_VIEW,
    PERMISSIONS.JOBS_VIEW,
  ],
  [UserRole.USUARIO_EXTERNO]: [
    PERMISSIONS.DOCUMENTS_VIEW,
    PERMISSIONS.JOBS_VIEW,
  ],
};

/**
 * Checks if a user has a specific granular permission
 */
export const hasPermission = (user: User | null, permission: string): boolean => {
  if (!user) return false;

  // Super admin / admin override
  if (user.role === UserRole.SUPER_ADMIN || user.role === UserRole.ADMIN) {
    return true;
  }

  // Explicit user permissions array check
  if (user.permissions && Array.isArray(user.permissions)) {
    if (user.permissions.includes(permission) || user.permissions.includes('*')) {
      return true;
    }
  }

  // Fallback to role-based default permissions
  const defaultRolePermissions = ROLE_DEFAULT_PERMISSIONS[user.role] || [];
  return defaultRolePermissions.includes(permission);
};

/**
 * Checks if user has ANY of the provided permissions
 */
export const hasAnyPermission = (user: User | null, permissions: string[]): boolean => {
  if (!user) return false;
  return permissions.some(p => hasPermission(user, p));
};

/**
 * Checks if user has ALL of the provided permissions
 */
export const hasAllPermissions = (user: User | null, permissions: string[]): boolean => {
  if (!user) return false;
  return permissions.every(p => hasPermission(user, p));
};
