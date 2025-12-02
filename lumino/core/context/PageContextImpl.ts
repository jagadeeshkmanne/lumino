/**
 * Lumino Framework - Page Context Implementation
 *
 * Context for page-level operations including mode and entity management.
 */

import type { PageContext, FormContext } from "../types";
import { AppContextImpl } from "./AppContextImpl";

// =============================================================================
// PAGE CONTEXT IMPLEMENTATION
// =============================================================================

/**
 * Page Context extends App Context with page-specific features.
 */
export class PageContextImpl extends AppContextImpl implements PageContext {
  private _mode: string = "new";
  private _entity: any = {};
  private _initialEntity: any = {};
  private _forms: Map<string, FormContext> = new Map();

  // ===========================================================================
  // MODE
  // ===========================================================================

  get mode(): string {
    return this._mode;
  }

  setMode(mode: string): void {
    this._mode = mode;
  }

  // ===========================================================================
  // ENTITY
  // ===========================================================================

  getEntity<T>(): T {
    return this._entity as T;
  }

  setEntity(data: any): void {
    this._entity = data ? { ...data } : {};
    this._initialEntity = data ? { ...data } : {};

    // Update all forms with new entity
    this._forms.forEach((form) => {
      if ("setEntity" in form && typeof form.setEntity === "function") {
        form.setEntity(data);
      }
    });
  }

  // ===========================================================================
  // DIRTY CHECK
  // ===========================================================================

  isDirty(): boolean {
    // Check if any form is dirty
    for (const form of this._forms.values()) {
      if (form.isDirty()) {
        return true;
      }
    }
    return false;
  }

  // ===========================================================================
  // FORM ACCESS
  // ===========================================================================

  getForm(formId: string): FormContext {
    const form = this._forms.get(formId);
    if (!form) {
      throw new Error(`Form "${formId}" not found in page context`);
    }
    return form;
  }

  registerForm(formId: string, formContext: FormContext): void {
    this._forms.set(formId, formContext);
  }

  unregisterForm(formId: string): void {
    this._forms.delete(formId);
  }

  getRegisteredFormIds(): string[] {
    return Array.from(this._forms.keys());
  }
}
