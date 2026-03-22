import { Role } from '../enums/role.enum';

export const ROLE_LABELS: Record<Role, string> = {
  [Role.SUPER_ADMIN]: 'Super Admin',
  [Role.ADMIN]: 'Admin',
};

export const DEFAULT_ADMIN_ROLE = Role.ADMIN;