/**
 * Lumino Framework - Action Types
 *
 * Types for Action builders and action execution.
 */

import type { ErrorResponse, CallOptions } from "./base";
import type { BuiltApi } from "./api";
import type { ActionContext } from "./context";

// =============================================================================
// ACTION CONFIGURATION
// =============================================================================

export type ActionApiFn = (ctx: ActionContext) => BuiltApi<any, any>;
export type ActionParamsFn = (ctx: ActionContext) => CallOptions;
export type ActionBodyFn<TEntity> = (ctx: ActionContext) => Partial<TEntity> | any;
export type ActionHandlerFn = (ctx: ActionContext) => void | Promise<void>;
export type BeforeExecuteFn<TEntity> = (data: TEntity, ctx: ActionContext) => void | Promise<void>;
export type AfterExecuteFn = (response: any, ctx: ActionContext) => void;
export type OnErrorFn = (error: ErrorResponse, ctx: ActionContext) => void;

export interface ActionConfig<TEntity = any> {
  api: ActionApiFn | null;
  params: ActionParamsFn | null;
  body: ActionBodyFn<TEntity> | null;
  skipValidation: boolean;
  beforeExecute: BeforeExecuteFn<TEntity> | null;
  afterExecute: AfterExecuteFn | null;
  onError: OnErrorFn | null;
  handler: ActionHandlerFn | null;
  label: string | null;
}

// =============================================================================
// BUILT ACTION
// =============================================================================

export interface BuiltAction<TEntity = any> {
  readonly config: ActionConfig<TEntity>;
  execute(ctx: ActionContext): Promise<void>;
}

// =============================================================================
// ACTION EXECUTION RESULT
// =============================================================================

export interface ActionExecutionResult {
  success: boolean;
  data?: any;
  error?: ErrorResponse;
  prevented: boolean;
}
