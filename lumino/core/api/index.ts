/**
 * Lumino Framework - API Module Exports
 */

export { Api, ApiGroup } from "./Api";
export { CrudApi } from "./CrudApi";
export { LookupApi } from "./LookupApi";
export { Mapper } from "./Mapper";
export { Criteria, Sort, Pageable } from "./Criteria";
export { ApiExecutor, buildUrl, createRequestConfig, executeHttpRequest } from "./ApiExecutor";
export type { Interceptor, RequestInterceptor, ResponseInterceptor, ErrorInterceptor } from "./ApiExecutor";
export { CacheManager, cacheManager } from "./CacheManager";

// Built-in interceptors
export {
  createAuthInterceptor,
  createLoggingInterceptor,
  createRetryInterceptor,
  createErrorTransformInterceptor,
  createUnauthorizedInterceptor,
  createTenantInterceptor,
  createCorrelationInterceptor,
} from "./interceptors";

export type {
  CriteriaOperator,
  CriteriaCondition,
  CriteriaGroup,
  BuiltCriteria,
  SortDirection,
  SortField,
  BuiltSort,
  PageableConfig,
  BuiltPageable,
} from "./Criteria";
