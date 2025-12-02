/**
 * Lumino Framework - Form Context Implementation
 *
 * Context for form-level operations including field access and validation.
 */

import type { FormContext, ValidationErrors, ValidationRule, ListOperations } from "../types";
import { AppContextImpl } from "./AppContextImpl";
import { runValidation } from "../validation/Validators";

// =============================================================================
// LIST OPERATIONS IMPLEMENTATION
// =============================================================================

/**
 * Implementation of ListOperations for manipulating array fields.
 */
class ListOperationsImpl<T = Record<string, any>> implements ListOperations<T> {
  private _ctx: FormContextImpl;
  private _fieldName: string;
  private _defaults: Partial<T> | ((ctx: FormContext, index: number) => Partial<T>);
  private _activeIndex: number = 0;

  constructor(
    ctx: FormContextImpl,
    fieldName: string,
    defaults?: Partial<T> | ((ctx: FormContext, index: number) => Partial<T>)
  ) {
    this._ctx = ctx;
    this._fieldName = fieldName;
    this._defaults = defaults ?? ({} as Partial<T>);
  }

  // =========================================================================
  // PRIVATE HELPERS
  // =========================================================================

  private getArray(): T[] {
    const value = this._ctx.getValue<T[]>(this._fieldName);
    return Array.isArray(value) ? value : [];
  }

  private setArray(arr: T[]): void {
    this._ctx.setValue(this._fieldName, [...arr]);
  }

  private getDefaultValues(index: number): Partial<T> {
    if (typeof this._defaults === "function") {
      return this._defaults(this._ctx, index);
    }
    return this._defaults;
  }

  // =========================================================================
  // ADD OPERATIONS
  // =========================================================================

  add(values?: Partial<T>): number {
    const arr = this.getArray();
    const newIndex = arr.length;
    const newItem = { ...this.getDefaultValues(newIndex), ...values } as T;
    arr.push(newItem);
    this.setArray(arr);
    return newIndex;
  }

  addAt(index: number, values?: Partial<T>): void {
    const arr = this.getArray();
    const clampedIndex = Math.max(0, Math.min(index, arr.length));
    const newItem = { ...this.getDefaultValues(clampedIndex), ...values } as T;
    arr.splice(clampedIndex, 0, newItem);
    this.setArray(arr);
  }

  addFirst(values?: Partial<T>): void {
    this.addAt(0, values);
  }

  addLast(values?: Partial<T>): number {
    return this.add(values);
  }

  // =========================================================================
  // REMOVE OPERATIONS
  // =========================================================================

  remove(index: number): void {
    const arr = this.getArray();
    if (index >= 0 && index < arr.length) {
      arr.splice(index, 1);
      this.setArray(arr);
      // Adjust active index if needed
      if (this._activeIndex >= arr.length && arr.length > 0) {
        this._activeIndex = arr.length - 1;
      }
    }
  }

  removeByItem(item: T): boolean {
    const arr = this.getArray();
    const index = arr.indexOf(item);
    if (index !== -1) {
      this.remove(index);
      return true;
    }
    return false;
  }

  removeFirst(): void {
    this.remove(0);
  }

  removeLast(): void {
    const arr = this.getArray();
    if (arr.length > 0) {
      this.remove(arr.length - 1);
    }
  }

  clear(): void {
    this.setArray([]);
    this._activeIndex = 0;
  }

  // =========================================================================
  // REORDER OPERATIONS
  // =========================================================================

  move(fromIndex: number, toIndex: number): void {
    const arr = this.getArray();
    if (fromIndex < 0 || fromIndex >= arr.length) return;
    if (toIndex < 0 || toIndex >= arr.length) return;
    if (fromIndex === toIndex) return;

    const [item] = arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, item);
    this.setArray(arr);
  }

  swap(indexA: number, indexB: number): void {
    const arr = this.getArray();
    if (indexA < 0 || indexA >= arr.length) return;
    if (indexB < 0 || indexB >= arr.length) return;
    if (indexA === indexB) return;

    [arr[indexA], arr[indexB]] = [arr[indexB], arr[indexA]];
    this.setArray(arr);
  }

  // =========================================================================
  // ACCESS OPERATIONS
  // =========================================================================

  get(index: number): T | undefined {
    const arr = this.getArray();
    return arr[index];
  }

  set(index: number, values: T): void {
    const arr = this.getArray();
    if (index >= 0 && index < arr.length) {
      arr[index] = values;
      this.setArray(arr);
    }
  }

  update(index: number, values: Partial<T>): void {
    const arr = this.getArray();
    if (index >= 0 && index < arr.length) {
      arr[index] = { ...arr[index], ...values };
      this.setArray(arr);
    }
  }

  getAll(): T[] {
    return [...this.getArray()];
  }

  count(): number {
    return this.getArray().length;
  }

  isEmpty(): boolean {
    return this.count() === 0;
  }

  findIndex(predicate: (item: T, index: number) => boolean): number {
    return this.getArray().findIndex(predicate);
  }

  find(predicate: (item: T, index: number) => boolean): T | undefined {
    return this.getArray().find(predicate);
  }

  // =========================================================================
  // TAB-SPECIFIC OPERATIONS
  // =========================================================================

  getActiveIndex(): number {
    return this._activeIndex;
  }

  setActiveIndex(index: number): void {
    const arr = this.getArray();
    if (index >= 0 && index < arr.length) {
      this._activeIndex = index;
    }
  }

  // =========================================================================
  // VALIDATION
  // =========================================================================

  getErrors(): string[] {
    const errors = this._ctx.getFieldErrors(this._fieldName);
    return errors;
  }

  getItemErrors(index: number): Record<string, string[]> {
    // Get errors for fields like "items[0].name", "items[0].qty", etc.
    const allErrors = this._ctx.getErrors();
    const itemErrors: Record<string, string[]> = {};
    const prefix = `${this._fieldName}[${index}].`;

    for (const [key, errors] of Object.entries(allErrors)) {
      if (key.startsWith(prefix)) {
        const fieldName = key.substring(prefix.length);
        itemErrors[fieldName] = errors;
      }
    }

    return itemErrors;
  }

  isValid(): boolean {
    return this.getErrors().length === 0;
  }

  isItemValid(index: number): boolean {
    return Object.keys(this.getItemErrors(index)).length === 0;
  }
}

// =============================================================================
// FORM CONTEXT IMPLEMENTATION
// =============================================================================

/**
 * Form Context extends App Context with form-specific features.
 */
export class FormContextImpl extends AppContextImpl implements FormContext {
  private _formId: string;
  private _mode: string = "new";
  private _entity: any = {};
  private _values: Record<string, any> = {};
  private _initialValues: Record<string, any> = {};
  private _errors: ValidationErrors = {};
  private _touched: Record<string, boolean> = {};
  private _fieldVisibility: Record<string, boolean> = {};
  /** Tracks which fields are hidden by access (data preserved, validation performed) */
  private _fieldAccessHidden: Record<string, boolean> = {};
  private _fieldDisabled: Record<string, boolean> = {};
  private _sectionVisibility: Record<string, boolean> = {};
  /** Tracks which sections are hidden by access (data preserved, validation performed) */
  private _sectionAccessHidden: Record<string, boolean> = {};
  private _readOnly: boolean = false;
  private _submitting: boolean = false;
  private _fieldRules: Map<string, ValidationRule[]> = new Map();
  /** Cache for list operations to maintain state (e.g., active tab index) */
  private _listOperationsCache: Map<string, ListOperationsImpl<any>> = new Map();
  /** Default values for lists configured via Form.list() */
  private _listDefaults: Map<string, any> = new Map();

  constructor(
    formId: string,
    options: ConstructorParameters<typeof AppContextImpl>[0]
  ) {
    super(options);
    this._formId = formId;
  }

  // ===========================================================================
  // FORM IDENTITY
  // ===========================================================================

  get formId(): string {
    return this._formId;
  }

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
    this._values = data ? { ...data } : {};
    this._initialValues = data ? { ...data } : {};
    this._errors = {};
    this._touched = {};
  }

  // ===========================================================================
  // FIELD ACCESS
  // ===========================================================================

  getValue<T>(field: string): T {
    return this._values[field] as T;
  }

  setValue(field: string, value: any): void {
    this._values[field] = value;
    this._touched[field] = true;
  }

  getFormData(): Record<string, any> {
    return { ...this._values };
  }

  // ===========================================================================
  // FIELD STATE
  // ===========================================================================

  getFieldError(field: string): string | null {
    const errors = this._errors[field];
    return errors && errors.length > 0 ? errors[0] : null;
  }

  getFieldErrors(field: string): string[] {
    return this._errors[field] || [];
  }

  setFieldError(field: string, error: string): void {
    if (!this._errors[field]) {
      this._errors[field] = [];
    }
    if (!this._errors[field].includes(error)) {
      this._errors[field].push(error);
    }
  }

  clearFieldError(field: string): void {
    delete this._errors[field];
  }

  isFieldDirty(field: string): boolean {
    return this._values[field] !== this._initialValues[field];
  }

  isFieldTouched(field: string): boolean {
    return !!this._touched[field];
  }

  // ===========================================================================
  // FORM STATE
  // ===========================================================================

  isDirty(): boolean {
    return Object.keys(this._values).some(
      (key) => this._values[key] !== this._initialValues[key]
    );
  }

  isTouched(): boolean {
    return Object.values(this._touched).some(Boolean);
  }

  isValid(): boolean {
    return Object.keys(this._errors).length === 0;
  }

  isSubmitting(): boolean {
    return this._submitting;
  }

  setSubmitting(submitting: boolean): void {
    this._submitting = submitting;
  }

  getErrors(): ValidationErrors {
    return { ...this._errors };
  }

  // ===========================================================================
  // VALIDATION
  // ===========================================================================

  registerFieldRules(field: string, rules: ValidationRule[]): void {
    this._fieldRules.set(field, rules);
  }

  /**
   * Check if validation should be skipped for a field.
   * Skip only for conditional hide (not access-based hide).
   */
  private shouldSkipValidation(field: string): boolean {
    // If field is hidden AND it's not access-based, skip validation
    return this.isFieldHidden(field) && !this.isFieldHiddenByAccess(field);
  }

  async validate(): Promise<boolean> {
    this._errors = {};
    let isValid = true;

    // Validate all fields (skip only conditionally hidden fields)
    for (const [field, rules] of this._fieldRules) {
      // Skip validation only for conditional hide (not access-based)
      if (this.shouldSkipValidation(field)) {
        continue;
      }

      const value = this._values[field];
      const errors = await runValidation(rules, value, this, this._mode);

      if (errors.length > 0) {
        this._errors[field] = errors;
        isValid = false;
      }
    }

    return isValid;
  }

  async validateField(field: string): Promise<boolean> {
    // Skip validation only for conditional hide (not access-based)
    if (this.shouldSkipValidation(field)) {
      delete this._errors[field]; // Clear any existing errors
      return true;
    }

    const rules = this._fieldRules.get(field);
    if (!rules) return true;

    const value = this._values[field];
    const errors = await runValidation(rules, value, this, this._mode);

    if (errors.length > 0) {
      this._errors[field] = errors;
      return false;
    } else {
      delete this._errors[field];
      return true;
    }
  }

  async validateAction(actionName: string): Promise<boolean> {
    this._errors = {};
    let isValid = true;

    // Validate all fields with action name as mode (skip only conditionally hidden)
    for (const [field, rules] of this._fieldRules) {
      // Skip validation only for conditional hide (not access-based)
      if (this.shouldSkipValidation(field)) {
        continue;
      }

      const value = this._values[field];
      const errors = await runValidation(rules, value, this, actionName);

      if (errors.length > 0) {
        this._errors[field] = errors;
        isValid = false;
      }
    }

    return isValid;
  }

  // ===========================================================================
  // FORM ACTIONS
  // ===========================================================================

  reset(): void {
    this._values = { ...this._initialValues };
    this._errors = {};
    this._touched = {};
  }

  resetField(field: string): void {
    this._values[field] = this._initialValues[field];
    delete this._errors[field];
    delete this._touched[field];
  }

  setReadOnly(readOnly: boolean): void {
    this._readOnly = readOnly;
  }

  isReadOnly(): boolean {
    return this._readOnly;
  }

  // ===========================================================================
  // FIELD VISIBILITY (hide/show)
  // ===========================================================================

  /**
   * Show a field (remove hide condition).
   */
  showField(field: string): void {
    this._fieldVisibility[field] = true;
    // Clear access-hidden flag as well
    delete this._fieldAccessHidden[field];
  }

  /**
   * Conditional hide - hide field, CLEAR data, SKIP validation.
   * Use when hiding based on form data/user selection.
   */
  hideFieldByCondition(field: string): void {
    const wasConditionallyHidden = this._fieldVisibility[field] === false && !this._fieldAccessHidden[field];
    this._fieldVisibility[field] = false;
    // Ensure it's NOT marked as access-hidden (conditional hide)
    delete this._fieldAccessHidden[field];

    // Clear data unless already conditionally hidden (idempotent)
    if (!wasConditionallyHidden) {
      this._values[field] = undefined;
      delete this._errors[field];
      delete this._touched[field];
    }
  }

  /**
   * Access-based hide - hide field, PRESERVE data, PERFORM validation.
   * Use when hiding based on permissions/role.
   */
  hideFieldByAccess(field: string): void {
    this._fieldVisibility[field] = false;
    this._fieldAccessHidden[field] = true;
    // Data is preserved - don't clear anything
  }

  /**
   * Check if field is hidden (either conditional or access-based).
   */
  isFieldHidden(field: string): boolean {
    return this._fieldVisibility[field] === false;
  }

  /**
   * Check if field is hidden due to access/permissions.
   * Returns true only if hidden AND hidden by access (not conditional).
   */
  isFieldHiddenByAccess(field: string): boolean {
    return this._fieldVisibility[field] === false && this._fieldAccessHidden[field] === true;
  }

  // ===========================================================================
  // FIELD ENABLED/DISABLED
  // ===========================================================================

  enableField(field: string): void {
    this._fieldDisabled[field] = false;
  }

  disableField(field: string): void {
    this._fieldDisabled[field] = true;
  }

  isFieldDisabled(field: string): boolean {
    return this._fieldDisabled[field] === true;
  }

  // ===========================================================================
  // SECTION VISIBILITY
  // ===========================================================================

  /**
   * Show a previously hidden section.
   */
  showSection(sectionId: string): void {
    this._sectionVisibility[sectionId] = true;
    delete this._sectionAccessHidden[sectionId];
  }

  /**
   * Conditional hide - hide section, CLEAR field data, SKIP validation.
   * Use when hiding based on form data/user selection.
   */
  hideSectionByCondition(sectionId: string): void {
    this._sectionVisibility[sectionId] = false;
    delete this._sectionAccessHidden[sectionId];
    // Note: Field data clearing for sections is handled by the UI layer
    // which knows which fields belong to which section
  }

  /**
   * Access-based hide - hide section, PRESERVE field data, PERFORM validation.
   * Use when hiding based on permissions/role.
   */
  hideSectionByAccess(sectionId: string): void {
    this._sectionVisibility[sectionId] = false;
    this._sectionAccessHidden[sectionId] = true;
  }

  /**
   * Check if section is hidden (either conditional or access-based).
   */
  isSectionHidden(sectionId: string): boolean {
    return this._sectionVisibility[sectionId] === false;
  }

  /**
   * Check if section is hidden due to access/permissions.
   */
  isSectionHiddenByAccess(sectionId: string): boolean {
    return this._sectionVisibility[sectionId] === false && this._sectionAccessHidden[sectionId] === true;
  }

  // ===========================================================================
  // LIST OPERATIONS
  // ===========================================================================

  /**
   * Register default values for a list field.
   * Called by FormRenderer when initializing form with list configurations.
   */
  registerListDefaults<T>(
    fieldName: string,
    defaults: Partial<T> | ((ctx: FormContext, index: number) => Partial<T>)
  ): void {
    this._listDefaults.set(fieldName, defaults);
  }

  /**
   * Get list operations for a list field.
   * Provides add/remove/reorder operations for dynamic arrays.
   */
  list<T = Record<string, any>>(fieldName: string): ListOperations<T> {
    // Return cached instance to preserve state (e.g., active tab index)
    let ops = this._listOperationsCache.get(fieldName);
    if (!ops) {
      const defaults = this._listDefaults.get(fieldName);
      ops = new ListOperationsImpl<T>(this, fieldName, defaults);
      this._listOperationsCache.set(fieldName, ops);
    }
    return ops as ListOperations<T>;
  }

  // ===========================================================================
  // DIALOG OPERATIONS
  // ===========================================================================

  /**
   * Open a dialog. This is a stub implementation.
   * The actual implementation is provided by the React DialogProvider.
   * In non-React contexts, this will log a warning.
   */
  open<TData = any, TResult = any>(
    _dialog: any,
    _options?: import("../types").DialogOptions<TData, TResult>
  ): void {
    console.warn(
      "FormContextImpl.open: Dialog support requires DialogProvider. " +
      "Wrap your app with <DialogProvider> from lumino/react."
    );
  }
}
