// User Roles Constants
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
};

// Admin emails list - these users get ADMIN role
export const ADMIN_EMAILS = [
  'admin@safesite.com',
  'admin@site.com',
  'superadmin@safesite.com',
];

// Determine user role based on email
export const getUserRole = (email) => {
  if (!email) return USER_ROLES.MANAGER;

  const normalizedEmail = email.toLowerCase().trim();
  const isAdmin = ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === normalizedEmail
  );

  return isAdmin ? USER_ROLES.ADMIN : USER_ROLES.MANAGER;
};

// Check if user has admin privileges
export const isAdmin = (role) => {
  return role === USER_ROLES.ADMIN;
};

// Check if user has manager privileges
export const isManager = (role) => {
  return role === USER_ROLES.MANAGER;
};

// Get role display name
export const getRoleDisplayName = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return 'Administrator';
    case USER_ROLES.MANAGER:
      return 'Site Manager';
    default:
      return 'User';
  }
};

// Get role badge color
export const getRoleBadgeColor = (role) => {
  switch (role) {
    case USER_ROLES.ADMIN:
      return '#8b5cf6'; // Purple for admin
    case USER_ROLES.MANAGER:
      return '#3b82f6'; // Blue for manager
    default:
      return '#64748b'; // Gray for default
  }
};
