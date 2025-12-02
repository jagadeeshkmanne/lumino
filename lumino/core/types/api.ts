/**
 * Lumino Framework - API Types
 *
 * Types for API builders, mappers, and related functionality.
 */

import type {
  HttpMethod,
  CacheConfig,
  PaginationConfig,
  RequestConfig,
  Response,
} from "./base";
import type { AppContext } from "./context";

// =============================================================================
// MAPPER TYPES
// =============================================================================

export interface FieldMappingConfig<TDto, TEntity> {
  dtoField: keyof TDto;
  entityField: keyof TEntity;
  toDTO?: (value: any, entity: TEntity) => any;
  toEntity?: (value: any, dto: TDto) => any;
}

export interface ComputedFieldConfig<TDto, TEntity> {
  dtoField?: keyof TDto;
  entityField?: keyof TEntity;
  value: (source: any) => any;
}

export interface BuiltMapper<TDto, TEntity> {
  readonly name: string;
  toDTO(entity: TEntity): TDto;
  toEntity(dto: TDto): TEntity;
  toDTOList(entities: TEntity[]): TDto[];
  toEntityList(dtos: TDto[]): TEntity[];
}

// =============================================================================
// API CONFIGURATION TYPES
// =============================================================================

export interface ApiConfig {
  id: string;
  url: string;
  method: HttpMethod;
  headers: Record<string, string>;
  timeout: number;
  cache: CacheConfig | null;
  pagination: PaginationConfig | null;
  mapper: BuiltMapper<any, any> | null;
  beforeRequest: ((config: RequestConfig, ctx: AppContext) => RequestConfig) | null;
  afterResponse: ((response: Response, ctx: AppContext) => any) | null;
}

export interface BuiltApi<TResponse = any, TBody = void> {
  readonly config: ApiConfig;
  readonly _responseType?: TResponse;
  readonly _bodyType?: TBody;
}

// =============================================================================
// CRUD API TYPES
// =============================================================================

export interface CrudApiConfig {
  baseUrl: string;
  mapper: BuiltMapper<any, any> | null;
  pagination: PaginationConfig | null;
}

export interface CrudApis<TEntity, TId = number> {
  list: BuiltApi<TEntity[]>;
  get: BuiltApi<TEntity>;
  create: BuiltApi<TEntity, Partial<TEntity>>;
  update: BuiltApi<TEntity, Partial<TEntity>>;
  patch: BuiltApi<TEntity, Partial<TEntity>>;
  delete: BuiltApi<void>;
  search: BuiltApi<TEntity[]>;
}

// =============================================================================
// LOOKUP API TYPES
// =============================================================================

export interface LookupApiConfig {
  baseUrl: string;
  cache: CacheConfig;
}

// =============================================================================
// HEADERS BUILDER TYPES
// =============================================================================

export interface HeadersBuilder<TParent> {
  set(key: string, value: string): HeadersBuilder<TParent>;
  remove(key: string): HeadersBuilder<TParent>;
  end(): TParent;
}

// =============================================================================
// CACHE BUILDER TYPES
// =============================================================================

export interface CacheBuilder<TParent> {
  storage(storage: "memory" | "localStorage" | "sessionStorage"): CacheBuilder<TParent>;
  duration(ms: number): CacheBuilder<TParent>;
  keyPrefix(prefix: string): CacheBuilder<TParent>;
  end(): TParent;
}

// =============================================================================
// PAGINATION BUILDER TYPES
// =============================================================================

export interface PaginationBuilder<TParent> {
  type(type: "offset" | "cursor"): PaginationBuilder<TParent>;
  defaultLimit(limit: number): PaginationBuilder<TParent>;
  maxLimit(limit: number): PaginationBuilder<TParent>;
  end(): TParent;
}

// =============================================================================
// FIELD MAPPING BUILDER TYPES
// =============================================================================

export interface FieldMappingBuilder<TDto, TEntity, TParent> {
  dto(field: keyof TDto): FieldMappingBuilder<TDto, TEntity, TParent>;
  entity(field: keyof TEntity): FieldMappingBuilder<TDto, TEntity, TParent>;
  toDTO(fn: (value: any, entity: TEntity) => any): FieldMappingBuilder<TDto, TEntity, TParent>;
  toEntity(fn: (value: any, dto: TDto) => any): FieldMappingBuilder<TDto, TEntity, TParent>;
  end(): TParent;
}

// =============================================================================
// COMPUTED FIELD BUILDER TYPES
// =============================================================================

export interface ComputedFieldBuilder<TDto, TEntity, TParent> {
  dto(field: keyof TDto): ComputedFieldBuilder<TDto, TEntity, TParent>;
  entity(field: keyof TEntity): ComputedFieldBuilder<TDto, TEntity, TParent>;
  value(fn: (source: any) => any): ComputedFieldBuilder<TDto, TEntity, TParent>;
  end(): TParent;
}
