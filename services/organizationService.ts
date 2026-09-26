import { supabase } from './supabaseClient';
import { User, UserRole, UserOrganization, OrgUserRole, Company } from '../types';
import { logAuditEvent } from './auditService';
import { sendNotification } from './notificationService';

/**
 * In-memory fallback mappings for organization users
 */
const MEMORY_USER_ORGANIZATIONS: UserOrganization[] = [
  {
    id: 'uo-1',
    user_id: 'u-petro-admin',
    organization_id: 'comp-noble',
    org_role: 'admin',
    permissions: ['org.manage_users', 'org.manage_jobs', 'org.manage_nationalization'],
    status: 'active',
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'uo-2',
    user_id: 'u-petro-rrhh',
    organization_id: 'comp-noble',
    org_role: 'hr',
    permissions: ['org.manage_jobs', 'org.manage_nationalization'],
    status: 'active',
    created_at: '2026-01-15T00:00:00Z'
  },
  {
    id: 'uo-3',
    user_id: 'u-petro-tech',
    organization_id: 'comp-noble',
    org_role: 'technical',
    permissions: ['org.view_data', 'org.manage_nationalization'],
    status: 'active',
    created_at: '2026-02-01T00:00:00Z'
  }
];

/**
 * Check if a user belongs to a specific organization
 */
export const isUserInOrganization = (user: User | null, organizationId: string): boolean => {
  if (!user) return false;
  const userOrgId = user.organization_id || user.companyId;
  return userOrgId === organizationId;
};

/**
 * Data Isolation Guard: Ensures a user can only query or access data belonging to their own organization,
 * unless they possess institutional Ministry privileges (SUPER_ADMIN, ADMIN, DIRECTOR, RESPONSABLE_SECCION, FUNCIONARIO).
 */
export const canAccessOrganizationData = (user: User | null, targetOrganizationId: string): boolean => {
  if (!user) return false;

  // Institutional Ministry roles have global access
  if (
    user.role === UserRole.SUPER_ADMIN ||
    user.role === UserRole.ADMIN ||
    user.role === UserRole.DIRECTOR ||
    user.role === UserRole.RESPONSABLE_SECCION ||
    user.role === UserRole.FUNCIONARIO ||
    user.role === UserRole.CUERPO_TECNICO
  ) {
    return true;
  }

  // Same organization check
  return isUserInOrganization(user, targetOrganizationId);
};

/**
 * Fetch all users belonging to a specific organization (Data Isolated)
 */
export const getOrganizationUsers = async (organizationId: string, currentUser: User): Promise<UserOrganization[]> => {
  if (!canAccessOrganizationData(currentUser, organizationId)) {
    console.warn(`[SECURITY WARN] User ${currentUser.id} attempted to query organization ${organizationId} without permissions.`);
    return [];
  }

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('user_organizations')
        .select('*')
        .eq('organization_id', organizationId);

      if (!error && data) {
        return data as UserOrganization[];
      }
    } catch (e) {
      console.warn('Error fetching organization users from DB:', e);
    }
  }

  return MEMORY_USER_ORGANIZATIONS.filter(uo => uo.organization_id === organizationId);
};

/**
 * Invite a new user to an organization
 */
export const inviteUserToOrganization = async (
  organizationId: string,
  email: string,
  orgRole: OrgUserRole,
  inviter: User
): Promise<UserOrganization> => {
  // Verify inviter has admin rights in this org or is Super Admin
  if (!canAccessOrganizationData(inviter, organizationId)) {
    throw new Error('No dispone de permisos para invitar usuarios a esta organización.');
  }

  const newRelation: UserOrganization = {
    id: `uo-${Date.now()}`,
    user_id: `u-invited-${Date.now()}`,
    organization_id: organizationId,
    org_role: orgRole,
    permissions: orgRole === 'admin' 
      ? ['org.manage_users', 'org.manage_jobs', 'org.manage_nationalization']
      : ['org.view_data'],
    status: 'invited',
    created_at: new Date().toISOString()
  };

  MEMORY_USER_ORGANIZATIONS.push(newRelation);

  await logAuditEvent({
    user: inviter,
    action: 'CREATE',
    module: 'organizations',
    entityId: organizationId,
    details: `Invitación enviada a '${email}' con rol de organización '${orgRole}'`
  });

  await sendNotification({
    userId: inviter.id,
    title: 'Invitación de Equipo Enviada',
    description: `Se ha invitado a ${email} como ${orgRole.toUpperCase()} de la organización.`,
    type: 'system',
    category: 'Organización'
  });

  return newRelation;
};
