/**
 * Lumino Framework - Action Builder
 *
 * Fluent builder for defining form actions.
 * Actions can execute APIs, validate forms, and handle navigation.
 */

import type { ErrorResponse } from "../types/base";
import type { ActionContext } from "../types/context";
import type {
  ActionConfig,
  BuiltAction,
  ActionApiFn,
  ActionParamsFn,
  ActionBodyFn,
  ActionHandlerFn,
  BeforeExecuteFn,
  AfterExecuteFn,
  OnErrorFn,
} from "../types/action";

// =============================================================================
// ACTION BUILDER
// =============================================================================

/**
 * Fluent builder for creating form actions.
 *
 * @example
 * ```typescript
 * // Save action with API
 * new Action<UserEntity>()
 *   .api((ctx) => ctx.mode === "new"
 *       ? ctx.api.UsersApi.create
 *       : ctx.api.UsersApi.update)
 *   .params((ctx) => ctx.mode === "edit"
 *       ? { path: { id: ctx.routeParams.id } }
 *       : {})
 *   .afterExecute((response, ctx) => {
 *     ctx.notify("Saved!", "success");
 *     ctx.navigate("/employees");
 *   })
 *   .build()
 *
 * // Cancel action (no API)
 * new Action<UserEntity>()
 *   .skipValidation()
 *   .handler((ctx) => ctx.navigate("/employees"))
 *   .build()
 * ```
 */
export class Action<TEntity = any> {
  private _config: ActionConfig<TEntity> = {
    api: null,
    params: null,
    body: null,
    skipValidation: false,
    beforeExecute: null,
    afterExecute: null,
    onError: null,
    handler: null,
    label: null,
  };

  /**
   * Set display label for the action button
   */
  label(label: string): this {
    this._config.label = label;
    return this;
  }

  /**
   * Set API to execute
   * Can be dynamic based on context (e.g., create vs update based on mode)
   */
  api(apiFn: ActionApiFn): this {
    this._config.api = apiFn;
    return this;
  }

  /**
   * Set API parameters (path params, query params)
   */
  params(paramsFn: ActionParamsFn): this {
    this._config.params = paramsFn;
    return this;
  }

  /**
   * Set request body
   * If not set, form data will be used automatically
   */
  body(bodyFn: ActionBodyFn<TEntity>): this {
    this._config.body = bodyFn;
    return this;
  }

  /**
   * Skip all validation for this action
   * Useful for cancel, reset, or draft actions
   */
  skipValidation(): this {
    this._config.skipValidation = true;
    return this;
  }

  /**
   * Handler to run before API execution
   * Can show loader, transform data, etc.
   */
  beforeExecute(fn: BeforeExecuteFn<TEntity>): this {
    this._config.beforeExecute = fn;
    return this;
  }

  /**
   * Handler to run after successful API execution
   * Can show notification, navigate, update state, etc.
   */
  afterExecute(fn: AfterExecuteFn): this {
    this._config.afterExecute = fn;
    return this;
  }

  /**
   * Handler for API errors
   */
  onError(fn: OnErrorFn): this {
    this._config.onError = fn;
    return this;
  }

  /**
   * Custom handler for actions that don't need API
   * Useful for cancel, reset, custom logic
   */
  handler(fn: ActionHandlerFn): this {
    this._config.handler = fn;
    return this;
  }

  /**
   * Build the action
   */
  build(): BuiltAction<TEntity> {
    const config = { ...this._config };

    return {
      config,

      async execute(ctx: ActionContext): Promise<void> {
        let prevented = false;

        // Create a modified context with preventDefault
        const actionCtx: ActionContext = {
          ...ctx,
          action: ctx.action,
          preventDefault: () => {
            prevented = true;
          },
        };

        try {
          // If custom handler is defined (no API action)
          if (config.handler && !config.api) {
            await config.handler(actionCtx);
            return;
          }

          // Validate form (unless skipped)
          if (!config.skipValidation) {
            const isValid = await ctx.validate();
            if (!isValid) {
              return;
            }
          }

          // Get form data for body
          const formData = ctx.getFormData() as TEntity;

          // Run beforeExecute
          if (config.beforeExecute) {
            await config.beforeExecute(formData, actionCtx);
            if (prevented) return;
          }

          // If no API, just run handler if exists
          if (!config.api) {
            if (config.handler) {
              await config.handler(actionCtx);
            }
            return;
          }

          // Get API config
          const api = config.api(actionCtx);

          // Build call options
          const callOptions: any = {};

          if (config.params) {
            const params = config.params(actionCtx);
            if (params.path) callOptions.path = params.path;
            if (params.query) callOptions.query = params.query;
            if (params.headers) callOptions.headers = params.headers;
          }

          // Set body
          if (config.body) {
            callOptions.body = config.body(actionCtx);
          } else {
            // Default to form data
            callOptions.body = formData;
          }

          // Execute API call
          const response = await ctx.call(api, callOptions);

          // Run afterExecute
          if (config.afterExecute) {
            config.afterExecute(response, actionCtx);
          }
        } catch (error) {
          // Handle error
          if (config.onError) {
            config.onError(error as ErrorResponse, actionCtx);
          } else {
            // Default error handling
            const errorResponse = error as ErrorResponse;
            ctx.notify(errorResponse.message || "An error occurred", "error");

            // If server returns field errors, set them
            if (errorResponse.errors) {
              Object.entries(errorResponse.errors).forEach(([field, messages]) => {
                if (messages && messages.length > 0) {
                  ctx.setFieldError(field, messages[0]);
                }
              });
            }
          }
        }
      },
    };
  }
}
