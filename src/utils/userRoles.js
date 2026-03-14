export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  WORKER: 'WORKER',
};

// Map database role string to app constant
export const mapDbRole = (dbRole) => {
  switch (dbRole?.toLowerCase()) {
    case 'super_admin':
    case 'admin':
      return USER_ROLES.ADMIN;
    case 'manager':
      return USER_ROLES.MANAGER;
    case 'worker':
      return USER_ROLES.WORKER;
    default:
      return null;
  }
};

export const isAdmin = (role) => role === USER_ROLES.ADMIN;

export const isManager = (role) => role === USER_ROLES.MANAGER;

export const isWorker = (role) => role === USER_ROLES.WORKER;

export const getRoleDisplayName = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Administrator';
    case USER_ROLES.MANAGER:
      return 'Site Manager';
    case USER_ROLES.WORKER:
      return 'Worker';
    default:
      return 'User';
  }
};

export const getRoleBadgeColor = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return '#8b5cf6';
    case USER_ROLES.MANAGER:
      return '#3b82f6';
    case USER_ROLES.WORKER:
      return '#10b981';
    default:
      return '#64748b';
  }
};
