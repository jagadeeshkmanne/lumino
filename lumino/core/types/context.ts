/**
 * Lumino Framework - Context Types
 *
 * Types for AppContext, PageContext, FormContext, ActionContext.
 */

import type {
  RouteParams,
  QueryParams,
  NotifyType,
  UserInfo,
  Environment,
  ErrorResponse,
  CallOptions,
} from "./base";
import type { BuiltApi } from "./api";
import type { ValidationErrors } from "./validation";

// =============================================================================
// USER CONTEXT
// =============================================================================

export interface UserContext {
  readonly id: string | number;
  readonly name: string;
  readonly email: string;
  readonly roles: string[];
  readonly permissions: string[];

  hasRole(role: string): boolean;
  hasPermission(permission: string): boolean;
  hasAnyRole(...roles: string[]): boolean;
  hasAllRoles(...roles: string[]): boolean;
  hasAnyPermission(...permissions: string[]): boolean;
  hasAllPermissions(...permissions: string[]): boolean;
  get<T>(key: string): T;
}

// =============================================================================
// CONFIG CONTEXT
// =============================================================================

export interface ConfigContext {
  get<T>(key: string): T;
  readonly baseUrl: string;
  readonly environment: Environment;
  readonly features: {
    isEnabled(feature: string): boolean;
  };
}

// =============================================================================
// I18N CONTEXT
// =============================================================================

export interface I18nContext {
  t(key: string, params?: Record<string, any>): string;
  readonly locale: string;
  setLocale(locale: string): void;
}

// =============================================================================
// STORAGE CONTEXT
// =============================================================================

export interface StorageContext {
  readonly local: {
    get<T>(key: string): T | null;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
  };
  readonly session: {
    get<T>(key: string): T | null;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
  };
}

// =============================================================================
// MODAL TYPES
// =============================================================================

export interface Modal<TProps = any, TResult = any> {
  component: React.ComponentType<TProps>;
  props?: TProps;
}

// =============================================================================
// DIALOG TYPES
// =============================================================================

/**
 * Options for opening a dialog with callback pattern.
 * Callbacks are called by the dialog when actions are performed.
 *
 * @example
 * ```typescript
 * ctx.open(ExperienceDialog, {
 *   data: existingExperience,
 *   mode: "edit",
 *   onSave: (data) => {
 *     ctx.list("experiences").update(index, data);
 *     ctx.notify("Saved!", "success");
 *   },
 *   onCancel: () => {
 *     console.log("User cancelled");
 *   }
 * });
 * ```
 */
export interface DialogOptions<TData = any, TResult = any> {
  /** Data to pass to the dialog (accessible via ctx.dialogData) */
  data?: TData;
  /** Initial values for form inside dialog */
  initialValues?: Record<string, any>;
  /** Mode (e.g., "add", "edit", "view") */
  mode?: string;

  // =========================================================================
  // LIFECYCLE EVENTS
  // =========================================================================

  /** Called when dialog opens (after mount) */
  onOpen?: () => void;
  /** Called when dialog saves/confirms - receives form data */
  onSave?: (data: TResult) => void;
  /** Called when dialog is cancelled (via cancel button or backdrop) */
  onCancel?: () => void;
  /** Called when dialog closes (any reason - save, cancel, escape, backdrop) */
  onClose?: () => void;
  /** Called before close - return false to prevent closing */
  onBeforeClose?: () => boolean | void;
}

/**
 * @deprecated Use DialogOptions instead
 */
export type OpenDialogOptions<TData = any, TResult = any> = DialogOptions<TData, TResult>;

/**
 * Result returned when dialog closes (for Promise-based usage)
 */
export interface DialogResult<TResult = any> {
  /** Whether dialog was confirmed (true) or cancelled (false) */
  confirmed: boolean;
  /** Data returned by dialog action (from closeWith) */
  data?: TResult;
  /** The action ID that closed the dialog */
  action?: string;
}

// =============================================================================
// APP CONTEXT
// =============================================================================

export interface AppContext {
  // User & Auth
  readonly user: UserContext;
  setUser?(user: UserContext | null): void;
  isAuthenticated(): boolean;
  getAuthToken(): string | null;

  // API
  readonly api: Record<string, Record<string, BuiltApi<any, any>>>;
  call<T>(api: BuiltApi<T, any>, options?: CallOptions): Promise<T>;
  getData<T>(api: BuiltApi<T, any>): T | null;
  isLoading(api: BuiltApi<any, any>): boolean;
  getError(api: BuiltApi<any, any>): ErrorResponse | null;
  clearCache(api?: BuiltApi<any, any>): void;

  // Navigation & Routing
  readonly routeParams: RouteParams;
  readonly queryParams: QueryParams;
  navigate(path: string): void;
  redirect(path: string): void;
  back(): void;
  getCurrentRoute(): string;

  // UI State
  showLoader(): void;
  hideLoader(): void;
  notify(message: string, type?: NotifyType): void;
  confirm(message: string): Promise<boolean>;
  alert(message: string): Promise<void>;
  openModal<TResult>(modal: Modal<any, TResult>): Promise<TResult>;
  closeModal(): void;

  // App Config & Environment
  readonly config: ConfigContext;

  // Localization
  readonly i18n: I18nContext;

  // Storage
  readonly storage: StorageContext;

  // Meta
  setMeta(key: string, value: any): void;
  getMeta<T>(key: string): T;
}

// =============================================================================
// PAGE CONTEXT
// =============================================================================

export interface PageContext extends AppContext {
  readonly mode: string;

  getEntity<T>(): T;
  setEntity(data: any): void;
  setMode?(mode: string): void;
  isDirty(): boolean;
  getForm(formId: string): FormContext;
}

// =============================================================================
// FORM CONTEXT
// =============================================================================

export interface FormContext extends AppContext {
  readonly mode: string;
  readonly formId: string;

  // Entity
  getEntity<T>(): T;
  setEntity(data: any): void;

  // Field access
  getValue<T>(field: string): T;
  setValue(field: string, value: any): void;
  getFormData(): Record<string, any>;
  /**
   * Get the parent form's full data (available when inside a list item context).
   * Use this when a dialog inside a list needs to access data from the main form.
   * @example
   * ```typescript
   * // Inside ExperienceDialog, access main form's department:
   * const department = ctx.getParentFormData?.()?.department;
   * ```
   */
  getParentFormData?(): Record<string, any>;

  // Field state
  getFieldError(field: string): string | null;
  getFieldErrors(field: string): string[];
  setFieldError(field: string, error: string): void;
  clearFieldError(field: string): void;
  isFieldDirty(field: string): boolean;
  isFieldTouched(field: string): boolean;

  // Form state
  isDirty(): boolean;
  isTouched(): boolean;
  isValid(): boolean;
  isSubmitting(): boolean;
  getErrors(): ValidationErrors;

  // Form actions
  validate(): Promise<boolean>;
  validateField(field: string): Promise<boolean>;
  reset(): void;
  resetField(field: string): void;
  setReadOnly(readOnly: boolean): void;
  isReadOnly(): boolean;

  // Field visibility/state
  /**
   * Show a previously hidden field.
   */
  showField(field: string): void;
  /**
   * Conditional hide - hide field, CLEAR data, SKIP validation.
   * Use when hiding based on form data/user selection.
   * @example ctx.hideFieldByCondition("otherReason") // hide and clear "other reason" field
   */
  hideFieldByCondition(field: string): void;
  /**
   * Access-based hide - hide field, PRESERVE data, PERFORM validation.
   * Use when hiding based on permissions/role.
   * @example ctx.hideFieldByAccess("salary") // hide salary from non-HR, but keep data
   */
  hideFieldByAccess(field: string): void;
  /**
   * Check if field is hidden (either conditional or access-based).
   */
  isFieldHidden(field: string): boolean;
  /**
   * Check if field is hidden due to access/permissions (data preserved, validation performed).
   */
  isFieldHiddenByAccess(field: string): boolean;
  enableField(field: string): void;
  disableField(field: string): void;
  isFieldDisabled(field: string): boolean;

  // Section visibility
  /**
   * Show a previously hidden section.
   */
  showSection(sectionId: string): void;
  /**
   * Conditional hide - hide section, CLEAR field data, SKIP validation.
   * Use when hiding based on form data/user selection.
   * @example ctx.hideSectionByCondition("benefits") // hide benefits section when employee type is contractor
   */
  hideSectionByCondition(sectionId: string): void;
  /**
   * Access-based hide - hide section, PRESERVE field data, PERFORM validation.
   * Use when hiding based on permissions/role.
   * @example ctx.hideSectionByAccess("compensation") // hide from non-HR, but keep data
   */
  hideSectionByAccess(sectionId: string): void;
  /**
   * Check if section is hidden (either conditional or access-based).
   */
  isSectionHidden(sectionId: string): boolean;
  /**
   * Check if section is hidden due to access/permissions.
   */
  isSectionHiddenByAccess(sectionId: string): boolean;

  // =========================================================================
  // DYNAMIC LIST/ARRAY OPERATIONS
  // =========================================================================

  /**
   * Get list operations for a list field.
   * Provides add/remove/reorder operations for dynamic arrays.
   *
   * @example
   * ```typescript
   * // Add items with defaults
   * ctx.list("items").add({ product: "Widget", qty: 1 });
   * ctx.list("items").addFirst({ product: "First" });
   * ctx.list("items").addAt(2, { product: "Middle" });
   *
   * // Remove items
   * ctx.list("items").remove(0);           // by index
   * ctx.list("items").removeByItem(item);  // by reference
   * ctx.list("items").removeLast();
   *
   * // Reorder
   * ctx.list("items").move(0, 2);
   * ctx.list("items").swap(1, 3);
   *
   * // For Tabs display
   * ctx.list("documents").setActiveIndex(2);
   * ```
   */
  list<T = Record<string, any>>(fieldName: string): ListOperations<T>;

  // =========================================================================
  // LIST ITEM CONTEXT (when inside a list item)
  // =========================================================================

  /**
   * When inside a list item, the field name of the parent list.
   * Undefined when not inside a list.
   * @example "addresses" when rendering inside addList("addresses")
   */
  readonly listFieldName?: string;

  /**
   * When inside a list item, the index of the current item.
   * Undefined when not inside a list.
   * @example 0, 1, 2, etc.
   */
  readonly listItemIndex?: number;

  /**
   * Remove the current list item. Only available when inside a list item.
   * Shorthand for ctx.list(ctx.listFieldName).remove(ctx.listItemIndex)
   */
  removeCurrentItem?: () => void;

  /**
   * Update the current list item with new data. Only available when inside a list item.
   * Shorthand for ctx.list(ctx.listFieldName).update(ctx.listItemIndex, data)
   */
  updateCurrentItem?: (data: any) => void;

  // =========================================================================
  // DIALOG OPERATIONS
  // =========================================================================

  /**
   * Data passed when this context was opened via open().
   * Contains the data from DialogOptions.data.
   * @example ctx.dialogData.item - the item being edited
   * @example ctx.dialogData.mode - "add" or "edit"
   */
  readonly dialogData?: any;

  /**
   * Open a dialog with callback-based result handling.
   * The dialog renders using the adapter's Dialog component.
   *
   * @param dialog - Dialog class or instance (must extend Dialog)
   * @param options - Data, mode, and lifecycle callbacks for the dialog
   *
   * @example
   * ```typescript
   * // Open dialog with callbacks
   * ctx.open(ExperienceDialog, {
   *   data: existingExp,
   *   mode: "edit",
   *   onOpen: () => console.log("Dialog opened"),
   *   onSave: (data) => {
   *     ctx.list("experiences").update(index, data);
   *     ctx.notify("Saved!", "success");
   *   },
   *   onCancel: () => {
   *     console.log("Cancelled");
   *   },
   *   onClose: () => console.log("Dialog closed"),
   *   onBeforeClose: () => {
   *     // Return false to prevent closing
   *     return ctx.isValid();
   *   }
   * });
   *
   * // Open dialog for adding new item
   * ctx.open(ExperienceDialog, {
   *   data: new Experience(),
   *   mode: "add",
   *   onSave: (data) => ctx.list("experiences").add(data)
   * });
   * ```
   */
  open<TData = any, TResult = any>(
    dialog: any, // Dialog class or instance
    options?: DialogOptions<TData, TResult>
  ): void;

  /**
   * Close the current dialog.
   * Only available inside a dialog context.
   * Calls the appropriate lifecycle callbacks (onBeforeClose, onClose).
   *
   * @example
   * ```typescript
   * // In dialog action - save and close
   * this.action("save", "Save")
   *   .onClick((ctx) => {
   *     const data = ctx.getFormData();
   *     ctx.dialogOptions.onSave?.(data);
   *     ctx.close();
   *   });
   *
   * // In dialog action - cancel
   * this.action("cancel", "Cancel")
   *   .onClick((ctx) => {
   *     ctx.dialogOptions.onCancel?.();
   *     ctx.close();
   *   });
   * ```
   */
  close?(): void;

  /**
   * The options passed when opening this dialog.
   * Only available inside a dialog context.
   * Contains data, mode, and lifecycle callbacks.
   */
  readonly dialogOptions?: DialogOptions<any, any>;
}

// =============================================================================
// ACTION CONTEXT
// =============================================================================

export interface ActionContext extends FormContext {
  readonly action: string;
  preventDefault(): void;
}

// =============================================================================
// LIST OPERATIONS - Dynamic array manipulation
// =============================================================================

/**
 * Operations for manipulating list/array fields dynamically.
 *
 * Accessed via `ctx.list("fieldName")` in FormContext.
 *
 * @example
 * ```typescript
 * // Add items
 * ctx.list("items").add({ product: "Widget", qty: 1 });
 * ctx.list("items").addFirst({ product: "First" });
 * ctx.list("items").addAt(2, { product: "Middle" });
 *
 * // Remove items
 * ctx.list("items").remove(0);
 * ctx.list("items").removeByItem(itemToRemove);
 * ctx.list("items").removeLast();
 *
 * // Reorder
 * ctx.list("items").move(0, 2);
 * ctx.list("items").swap(1, 3);
 *
 * // Access
 * const item = ctx.list("items").get(0);
 * const all = ctx.list("items").getAll();
 * const count = ctx.list("items").count();
 *
 * // For Tabs display
 * ctx.list("documents").setActiveIndex(2);
 * ```
 */
export interface ListOperations<T = Record<string, any>> {
  // =========================================================================
  // ADD OPERATIONS
  // =========================================================================

  /**
   * Add item at the end of the list.
   * @param values - Optional values to merge with defaults
   * @returns The index of the newly added item
   */
  add(values?: Partial<T>): number;

  /**
   * Add item at a specific index.
   * @param index - Position to insert at (0-based)
   * @param values - Optional values to merge with defaults
   */
  addAt(index: number, values?: Partial<T>): void;

  /**
   * Add item at the beginning of the list.
   * @param values - Optional values to merge with defaults
   */
  addFirst(values?: Partial<T>): void;

  /**
   * Add item at the end (alias for add()).
   * @param values - Optional values to merge with defaults
   * @returns The index of the newly added item
   */
  addLast(values?: Partial<T>): number;

  // =========================================================================
  // REMOVE OPERATIONS
  // =========================================================================

  /**
   * Remove item at a specific index.
   * @param index - Position to remove (0-based)
   */
  remove(index: number): void;

  /**
   * Remove item by reference (object equality).
   * @param item - The item object to remove
   * @returns true if item was found and removed
   */
  removeByItem(item: T): boolean;

  /**
   * Remove the first item.
   */
  removeFirst(): void;

  /**
   * Remove the last item.
   */
  removeLast(): void;

  /**
   * Remove all items.
   */
  clear(): void;

  // =========================================================================
  // REORDER OPERATIONS
  // =========================================================================

  /**
   * Move item from one position to another.
   * @param fromIndex - Current position
   * @param toIndex - New position
   */
  move(fromIndex: number, toIndex: number): void;

  /**
   * Swap two items.
   * @param indexA - First item position
   * @param indexB - Second item position
   */
  swap(indexA: number, indexB: number): void;

  // =========================================================================
  // ACCESS OPERATIONS
  // =========================================================================

  /**
   * Get item at a specific index.
   * @param index - Position (0-based)
   * @returns The item or undefined if out of bounds
   */
  get(index: number): T | undefined;

  /**
   * Set/update item at a specific index.
   * @param index - Position (0-based)
   * @param values - Values to set (replaces entire item)
   */
  set(index: number, values: T): void;

  /**
   * Update specific fields of an item at index.
   * @param index - Position (0-based)
   * @param values - Partial values to merge
   */
  update(index: number, values: Partial<T>): void;

  /**
   * Get all items.
   * @returns Array of all items
   */
  getAll(): T[];

  /**
   * Get the number of items.
   * @returns Item count
   */
  count(): number;

  /**
   * Check if the list is empty.
   * @returns true if no items
   */
  isEmpty(): boolean;

  /**
   * Find item index by predicate.
   * @param predicate - Function to test each item
   * @returns Index of first matching item, or -1 if not found
   */
  findIndex(predicate: (item: T, index: number) => boolean): number;

  /**
   * Find item by predicate.
   * @param predicate - Function to test each item
   * @returns First matching item, or undefined if not found
   */
  find(predicate: (item: T, index: number) => boolean): T | undefined;

  // =========================================================================
  // TAB-SPECIFIC OPERATIONS (when display is Tabs)
  // =========================================================================

  /**
   * Get the currently active tab index.
   * @returns Active index (0-based)
   */
  getActiveIndex(): number;

  /**
   * Set the active tab index.
   * @param index - Tab index to activate
   */
  setActiveIndex(index: number): void;

  // =========================================================================
  // VALIDATION
  // =========================================================================

  /**
   * Get validation errors for the list.
   * @returns Array of error messages
   */
  getErrors(): string[];

  /**
   * Get validation errors for a specific item.
   * @param index - Item index
   * @returns Object with field names as keys and error arrays as values
   */
  getItemErrors(index: number): Record<string, string[]>;

  /**
   * Check if the list is valid.
   * @returns true if no validation errors
   */
  isValid(): boolean;

  /**
   * Check if a specific item is valid.
   * @param index - Item index
   * @returns true if item has no validation errors
   */
  isItemValid(index: number): boolean;
}
