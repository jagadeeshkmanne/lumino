/**
 * Lumino Framework - User Context
 *
 * Provides user information and permission checking.
 */

import type { UserContext as IUserContext, UserInfo } from "../types";

// =============================================================================
// USER CONTEXT IMPLEMENTATION
// =============================================================================

/**
 * User context implementation with role and permission checking.
 */
export class UserContextImpl implements IUserContext {
  private _user: UserInfo;

  constructor(user: UserInfo) {
    this._user = user;
  }

  // ===========================================================================
  // PROPERTIES
  // ===========================================================================

  get id(): string | number {
    return this._user.id;
  }

  get name(): string {
    return this._user.name;
  }

  get email(): string {
    return this._user.email;
  }

  get roles(): string[] {
    return [...this._user.roles];
  }

  get permissions(): string[] {
    return [...this._user.permissions];
  }

  // ===========================================================================
  // ROLE CHECKS
  // ===========================================================================

  /**
   * Check if user has a specific role
   */
  hasRole(role: string): boolean {
    return this._user.roles.includes(role);
  }

  /**
   * Check if user has any of the specified roles
   */
  hasAnyRole(...roles: string[]): boolean {
    return roles.some((role) => this._user.roles.includes(role));
  }

  /**
   * Check if user has all of the specified roles
   */
  hasAllRoles(...roles: string[]): boolean {
    return roles.every((role) => this._user.roles.includes(role));
  }

  // ===========================================================================
  // PERMISSION CHECKS
  // ===========================================================================

  /**
   * Check if user has a specific permission
   */
  hasPermission(permission: string): boolean {
    return this._user.permissions.includes(permission);
  }

  /**
   * Check if user has any of the specified permissions
   */
  hasAnyPermission(...permissions: string[]): boolean {
    return permissions.some((perm) => this._user.permissions.includes(perm));
  }

  /**
   * Check if user has all of the specified permissions
   */
  hasAllPermissions(...permissions: string[]): boolean {
    return permissions.every((perm) => this._user.permissions.includes(perm));
  }

  // ===========================================================================
  // CUSTOM PROPERTIES
  // ===========================================================================

  /**
   * Get custom user property
   */
  get<T>(key: string): T {
    return this._user[key] as T;
  }

  /**
   * Update user data
   */
  update(user: Partial<UserInfo>): void {
    this._user = { ...this._user, ...user };
  }

  /**
   * Get raw user info
   */
  getRawUser(): UserInfo {
    return { ...this._user };
  }
}

// =============================================================================
// ANONYMOUS USER
// =============================================================================

/**
 * Default anonymous user
 */
export const ANONYMOUS_USER: UserInfo = {
  id: "",
  name: "Anonymous",
  email: "",
  roles: [],
  permissions: [],
};

/**
 * Create anonymous user context
 */
export function createAnonymousUserContext(): UserContextImpl {
  return new UserContextImpl(ANONYMOUS_USER);
}
