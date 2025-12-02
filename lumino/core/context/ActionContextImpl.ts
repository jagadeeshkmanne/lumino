/**
 * Lumino Framework - Action Context Implementation
 *
 * Context for action execution with preventDefault support.
 */

import type { ActionContext } from "../types";
import { FormContextImpl } from "./FormContextImpl";

// =============================================================================
// ACTION CONTEXT IMPLEMENTATION
// =============================================================================

/**
 * Action Context extends Form Context with action-specific features.
 */
export class ActionContextImpl extends FormContextImpl implements ActionContext {
  private _actionName: string;
  private _prevented: boolean = false;

  constructor(
    formContext: FormContextImpl,
    actionName: string
  ) {
    // Copy all properties from form context
    super(formContext.formId, {
      apiExecutor: (formContext as any)._apiExecutor,
      apiRegistry: (formContext as any)._apiRegistry,
      routeRegistry: (formContext as any)._routeRegistry,
      config: {},
    });

    // Copy internal state from form context
    this._copyFromFormContext(formContext);
    this._actionName = actionName;
  }

  // ===========================================================================
  // ACTION IDENTITY
  // ===========================================================================

  get action(): string {
    return this._actionName;
  }

  // ===========================================================================
  // PREVENT DEFAULT
  // ===========================================================================

  preventDefault(): void {
    this._prevented = true;
  }

  isDefaultPrevented(): boolean {
    return this._prevented;
  }

  // ===========================================================================
  // INTERNAL
  // ===========================================================================

  private _copyFromFormContext(formContext: FormContextImpl): void {
    // Copy mode
    this.setMode(formContext.mode);

    // Copy entity and values
    this.setEntity(formContext.getEntity());

    // Copy form data
    const formData = formContext.getFormData();
    Object.entries(formData).forEach(([key, value]) => {
      this.setValue(key, value);
    });

    // Copy read-only state
    this.setReadOnly(formContext.isReadOnly());
  }
}

// =============================================================================
// FACTORY FUNCTION
// =============================================================================

/**
 * Create action context from form context
 */
export function createActionContext(
  formContext: FormContextImpl,
  actionName: string
): ActionContextImpl {
  return new ActionContextImpl(formContext, actionName);
}
