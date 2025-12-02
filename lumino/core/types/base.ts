/**
 * Lumino Framework - Base Types
 *
 * Common types used across the framework.
 */

// =============================================================================
// HTTP TYPES
// =============================================================================

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestConfig {
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  params: Record<string, any>;
  body: any;
  timeout: number;
}

export interface Response<T = any> {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: T;
}

export interface ErrorResponse {
  status: number;
  statusText: string;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
}

// =============================================================================
// CACHE TYPES
// =============================================================================

export type CacheStorage = "memory" | "localStorage" | "sessionStorage";

export interface CacheConfig {
  enabled: boolean;
  storage: CacheStorage;
  duration: number;
  keyPrefix?: string;
}

// =============================================================================
// PAGINATION TYPES
// =============================================================================

export type PaginationType = "offset" | "cursor";

export interface PaginationConfig {
  type: PaginationType;
  defaultLimit: number;
  maxLimit: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  limit: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// =============================================================================
// FILTER TYPES
// =============================================================================

export interface FilterOperators {
  eq?: any;
  ne?: any;
  gt?: any;
  gte?: any;
  lt?: any;
  lte?: any;
  in?: any[];
  notIn?: any[];
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  isNull?: boolean;
}

export type FilterValue = FilterOperators | any;

export interface SearchParams {
  filters?: Record<string, FilterValue>;
  sort?: string[];
  page?: number;
  limit?: number;
}

// =============================================================================
// CALL OPTIONS
// =============================================================================

export interface CallOptions {
  path?: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  skipCache?: boolean;
  silent?: boolean;
}

// =============================================================================
// ROUTE TYPES
// =============================================================================

export type RouteParams = Record<string, string>;
export type QueryParams = Record<string, string>;

export interface NavigationError {
  type: "not_found" | "unauthorized" | "error";
  path: string;
  message: string;
}

// =============================================================================
// NOTIFICATION TYPES
// =============================================================================

export type NotifyType = "success" | "error" | "warning" | "info";

// =============================================================================
// LOADING TYPES
// =============================================================================

export type LoadingType = "global" | "local" | "none";

export interface LoadingConfig {
  type: LoadingType;
  minDuration?: number;
  delay?: number;
}

// =============================================================================
// USER TYPES
// =============================================================================

export interface UserInfo {
  id: string | number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  [key: string]: any;
}

// =============================================================================
// ENVIRONMENT TYPES
// =============================================================================

export type Environment = "development" | "staging" | "production";

export interface AppConfig {
  baseUrl: string;
  environment: Environment;
  [key: string]: any;
}

export interface FeatureFlags {
  isEnabled(feature: string): boolean;
}

// =============================================================================
// COMPONENT TYPES
// =============================================================================

/**
 * A more flexible component type that works with React 18 and 19.
 * React 19 changed FC return type which causes compatibility issues.
 * Using `any` for return type to be maximally permissive.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ComponentType<P = any> = (props: P) => any;

export interface ComponentProps {
  [key: string]: any;
}
