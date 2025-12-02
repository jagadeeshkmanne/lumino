/**
 * Types & Interfaces API Reference
 */

import { CodeBlock } from "../../components/CodeBlock";

const contextTypesCode = `// FormContext - Available in forms, actions, validators
interface FormContext extends AppContext {
  readonly mode: string;
  readonly formId: string;

  // Entity
  getEntity<T>(): T;
  setEntity(data: any): void;

  // Field access
  getValue<T>(field: string): T;
  setValue(field: string, value: any): void;
  getFormData(): Record<string, any>;

  // Field state
  getFieldError(field: string): string | null;
  setFieldError(field: string, error: string): void;
  clearFieldError(field: string): void;
  isFieldDirty(field: string): boolean;

  // Form state
  isDirty(): boolean;
  isValid(): boolean;
  isSubmitting(): boolean;

  // Form actions
  validate(): Promise<boolean>;
  validateField(field: string): Promise<boolean>;
  reset(): void;

  // Visibility
  hideFieldByCondition(field: string): void;
  hideFieldByAccess(field: string): void;
  isFieldHidden(field: string): boolean;

  // List operations
  list<T>(fieldName: string): ListOperations<T>;

  // Dialog operations
  open<TData, TResult>(dialog: any, options?: DialogOptions<TData, TResult>): void;
  close?(): void;
  readonly dialogData?: any;
  readonly dialogOptions?: DialogOptions<any, any>;
}

// PageContext - Available in pages
interface PageContext extends AppContext {
  readonly mode: string;

  getEntity<T>(): T;
  setEntity(data: any): void;
  setMode?(mode: string): void;
  isDirty(): boolean;
  getForm(formId: string): FormContext;
}

// AppContext - Base context
interface AppContext {
  // User & Auth
  readonly user: UserContext;
  isAuthenticated(): boolean;

  // API
  readonly api: Record<string, Record<string, BuiltApi<any, any>>>;
  call<T>(api: BuiltApi<T, any>, options?: CallOptions): Promise<T>;

  // Navigation
  readonly routeParams: RouteParams;
  readonly queryParams: QueryParams;
  navigate(path: string): void;
  back(): void;

  // UI
  notify(message: string, type?: NotifyType): void;
  confirm(message: string): Promise<boolean>;

  // Config
  readonly config: ConfigContext;
  readonly i18n: I18nContext;
  readonly storage: StorageContext;
}`;

const userContextCode = `interface UserContext {
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
}`;

const listOperationsCode = `interface ListOperations<T = Record<string, any>> {
  // Add operations
  add(values?: Partial<T>): number;
  addAt(index: number, values?: Partial<T>): void;
  addFirst(values?: Partial<T>): void;
  addLast(values?: Partial<T>): number;

  // Remove operations
  remove(index: number): void;
  removeByItem(item: T): boolean;
  removeFirst(): void;
  removeLast(): void;
  clear(): void;

  // Reorder operations
  move(fromIndex: number, toIndex: number): void;
  swap(indexA: number, indexB: number): void;

  // Access operations
  get(index: number): T | undefined;
  set(index: number, values: T): void;
  update(index: number, values: Partial<T>): void;
  getAll(): T[];
  count(): number;
  isEmpty(): boolean;
  find(predicate: (item: T, index: number) => boolean): T | undefined;
  findIndex(predicate: (item: T, index: number) => boolean): number;

  // Tab operations (when display is Tabs)
  getActiveIndex(): number;
  setActiveIndex(index: number): void;

  // Validation
  getErrors(): string[];
  getItemErrors(index: number): Record<string, string[]>;
  isValid(): boolean;
  isItemValid(index: number): boolean;
}`;

const dialogOptionsCode = `interface DialogOptions<TData = any, TResult = any> {
  // Data to pass to dialog
  data?: TData;
  initialValues?: Record<string, any>;
  mode?: string;

  // Lifecycle callbacks
  onOpen?: () => void;
  onSave?: (data: TResult) => void;
  onCancel?: () => void;
  onClose?: () => void;
  onBeforeClose?: () => boolean | void;
}

interface DialogResult<TResult = any> {
  confirmed: boolean;
  data?: TResult;
  action?: string;
}`;

const formTypesCode = `interface FieldConfig {
  name: string;
  component?: ComponentType;
  label?: string;
  placeholder?: string;
  rules: ValidationRule[];
  props: Record<string, any> | PropsFunction;
  visibility?: VisibilityConfig;
  disable: boolean | ((ctx: FormContext) => boolean);
  readOnly: boolean | ((ctx: FormContext) => boolean);
  type?: "hidden" | string;
  colSpan?: number;
  lookup?: LookupFieldConfig;
  dependsOn?: Map<string | string[], DependsOnConfig>;
  margin?: SpacingConfig;
  padding?: SpacingConfig;
  cssClass?: FormCssClass;
  style?: FormStyle;
  wrapper?: ComponentType;
  display?: boolean;
}

interface RowConfig {
  fields: FieldConfig[];
  components?: RowComponentConfig[];
  layout?: number[];
  columns?: number;
  gap?: number;
  visibility?: VisibilityConfig;
  margin?: SpacingConfig;
  padding?: SpacingConfig;
  cssClass?: FormCssClass;
  style?: FormStyle;
  wrapper?: ComponentType;
}

interface SectionConfig {
  id?: string;
  title: string;
  rows: RowConfig[];
  collapsible?: boolean;
  collapsed?: boolean;
  visibility?: VisibilityConfig;
  gap?: number;
  margin?: SpacingConfig;
  padding?: SpacingConfig;
  cssClass?: FormCssClass;
  style?: FormStyle;
  wrapper?: ComponentType;
  actions?: string[];
}`;

const lookupConfigCode = `interface LookupFieldConfig<TEntity = any, TValue = any> {
  // API to call for search/list
  api: ApiRef<TEntity[]> | string | (() => Promise<TEntity[]>) | BuiltApi<TEntity[], any>;

  // Required: how to display and store selections
  labelHandler: (entity: TEntity) => string;
  valueHandler: (entity: TEntity) => TValue;

  // Optional: search configuration
  dialogTitle?: string;
  searchFields?: string[];
  columns?: LookupColumn[];
  filters?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  minSearchLength?: number;
  debounceMs?: number;

  // Optional: callbacks
  onSelect?: (selected: TEntity, ctx: FormContext) => void;
  onClear?: (ctx: FormContext) => void;

  // Optional: behavior
  multiple?: boolean;
  initialData?: TEntity[] | ((ctx: FormContext) => Promise<TEntity[]>);
  emptyMessage?: string;
  pagination?: { enabled: boolean; pageSize?: number };
}

interface LookupColumn {
  field: string;
  header: string;
  width?: number | string;
  render?: (value: any, row: any) => any;
  sortable?: boolean;
}`;

const listConfigCode = `interface ListConfig<T = Record<string, any>> {
  min?: number;
  max?: number;
  as?: ListDisplayComponent;
  displayProps?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  defaults?: ListDefaults<T>;
  actions?: ListActionConfig;
  tabLabel?: string | ((item: T, index: number, ctx: FormContext) => string);
  tableColumns?: TableColumnConfig[];
  rules?: ValidationRule[];
  visibility?: VisibilityConfig;
  cssClass?: FormCssClass;
  style?: FormStyle;
  wrapper?: ComponentType;
}

interface ListActionConfig {
  add?: {
    label?: string;
    position?: ActionPosition;
    icon?: ComponentType;
    enabled?: boolean | ((ctx: FormContext) => boolean);
  };
  remove?: {
    label?: string;
    position?: ActionPosition;
    icon?: ComponentType;
    confirm?: boolean | string;
    enabled?: boolean | ((ctx: FormContext, index: number) => boolean);
  };
  close?: {
    confirm?: boolean | string;
    enabled?: boolean | ((ctx: FormContext, index: number) => boolean);
  };
  reorder?: {
    dragDrop?: boolean;
    moveButtons?: boolean;
    enabled?: boolean | ((ctx: FormContext) => boolean);
  };
}`;

const visibilityConfigCode = `interface VisibilityConfig {
  // Conditional visibility - data CLEARED when hidden
  hide?: boolean | ((ctx: FormContext) => boolean);
  visible?: boolean | ((ctx: FormContext) => boolean);

  // Access-based visibility - data PRESERVED when hidden
  hideByAccess?: boolean | ((ctx: FormContext) => boolean);
  visibleByAccess?: boolean | ((ctx: FormContext) => boolean);

  conditionalOptions?: {
    resetOnShow?: boolean;
  };
}

type VisibilityType = "conditional" | "access";
type VisibilityCondition = boolean | ((ctx: FormContext) => boolean);`;

const dependsOnConfigCode = `interface DependsOnConfig {
  // Clear this field when dependency changes
  clear?: boolean;

  // Reset to initial value
  reset?: boolean;

  // API to reload options from
  reloadApi?: string;
  reloadParams?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);

  // Custom handler
  handler?: (dependencyValue: any, ctx: FormContext) => void | Promise<void>;

  // Debounce delay
  debounceMs?: number;

  // Only trigger if dependency value is truthy
  onlyIfTruthy?: boolean;
}`;

const validationTypesCode = `interface ValidationRule {
  readonly type: string;
  readonly validate: ValidateFn;
  readonly message: string;
  readonly skipOn?: string[];
  readonly validateOn?: string[];
}

type ValidateFn = (value: any, ctx: FormContext) => boolean | Promise<boolean>;

type ValidationErrors = Record<string, string[]>;

interface ValidationResult {
  valid: boolean;
  errors: ValidationErrors;
}`;

const apiTypesCode = `interface BuiltApi<TResponse = any, TRequest = any> {
  id: string;
  call(options?: CallOptions): Promise<TResponse>;
  getData(): TResponse | null;
  isLoading(): boolean;
  getError(): ErrorResponse | null;
  clearCache(): void;
}

interface CallOptions {
  path?: Record<string, any>;
  query?: Record<string, any>;
  body?: any;
  headers?: Record<string, string>;
  skipCache?: boolean;
  silent?: boolean;
}

interface ErrorResponse {
  status: number;
  statusText: string;
  message: string;
  errors?: Record<string, string[]>;
  data?: any;
}`;

const pageTypesCode = `interface PageConfig {
  id: string;
  route: string;
  components: Array<ComponentConfig | PageRowConfig | any>;
}

interface ComponentConfig {
  component: ComponentType;
  props?: Record<string, any> | ((ctx: PageContext) => Record<string, any>);
  children?: ReactNode | string | ((ctx: PageContext) => ReactNode);
  onClick?: (ctx: PageContext) => void | Promise<void>;
  visible?: boolean | ((ctx: PageContext) => boolean);
  margin?: SpacingConfig;
  padding?: SpacingConfig;
  cssClass?: string | ((ctx: PageContext) => string);
  style?: CSSProperties | ((ctx: PageContext) => CSSProperties);
  wrapper?: ComponentType;
  colSpan?: number;
}`;

const utilityTypesCode = `type ComponentType<P = any> = (props: P) => any;

type PropsFunction<T = any> = (ctx: FormContext) => T;

type FormStyle = CSSProperties | ((ctx: FormContext) => CSSProperties);
type FormCssClass = string | ((ctx: FormContext) => string);

interface SpacingConfig {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

type NotifyType = "success" | "error" | "warning" | "info";
type Environment = "development" | "staging" | "production";
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";`;

export function TypesRefPage() {
  return (
    <>
      <h1 className="docs-page-title">Types & Interfaces Reference</h1>
      <p className="docs-page-subtitle">
        Comprehensive reference for TypeScript types and interfaces used throughout Lumino.
      </p>

      {/* Context Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Context Types</h2>
        <CodeBlock code={contextTypesCode} language="typescript" />
      </div>

      {/* User Context */}
      <div className="docs-section">
        <h2 className="docs-section-title">UserContext</h2>
        <CodeBlock code={userContextCode} language="typescript" />
      </div>

      {/* List Operations */}
      <div className="docs-section">
        <h2 className="docs-section-title">ListOperations</h2>
        <p>
          Interface for manipulating list/array fields dynamically. Access via{" "}
          <code>ctx.list(fieldName)</code>.
        </p>
        <CodeBlock code={listOperationsCode} language="typescript" />
      </div>

      {/* Dialog Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Dialog Types</h2>
        <CodeBlock code={dialogOptionsCode} language="typescript" />
      </div>

      {/* Form Configuration Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Form Configuration Types</h2>
        <CodeBlock code={formTypesCode} language="typescript" />
      </div>

      {/* Lookup Configuration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Lookup Field Configuration</h2>
        <CodeBlock code={lookupConfigCode} language="typescript" />
      </div>

      {/* List Configuration */}
      <div className="docs-section">
        <h2 className="docs-section-title">List Field Configuration</h2>
        <CodeBlock code={listConfigCode} language="typescript" />
      </div>

      {/* Visibility Configuration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Visibility Configuration</h2>
        <CodeBlock code={visibilityConfigCode} language="typescript" />
      </div>

      {/* DependsOn Configuration */}
      <div className="docs-section">
        <h2 className="docs-section-title">Field Dependencies Configuration</h2>
        <CodeBlock code={dependsOnConfigCode} language="typescript" />
      </div>

      {/* Validation Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Validation Types</h2>
        <CodeBlock code={validationTypesCode} language="typescript" />
      </div>

      {/* API Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">API Types</h2>
        <CodeBlock code={apiTypesCode} language="typescript" />
      </div>

      {/* Page Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Page Configuration Types</h2>
        <CodeBlock code={pageTypesCode} language="typescript" />
      </div>

      {/* Utility Types */}
      <div className="docs-section">
        <h2 className="docs-section-title">Utility Types</h2>
        <CodeBlock code={utilityTypesCode} language="typescript" />
      </div>

      {/* Quick Reference */}
      <div className="docs-section">
        <h2 className="docs-section-title">Quick Reference</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th>Common Usage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>FormContext</code></td>
              <td>Context available in forms and actions</td>
              <td>Access form data, validation, API calls</td>
            </tr>
            <tr>
              <td><code>PageContext</code></td>
              <td>Context available in pages</td>
              <td>Page mode, entity, navigation</td>
            </tr>
            <tr>
              <td><code>UserContext</code></td>
              <td>Current user info and permissions</td>
              <td>Check roles, permissions, user data</td>
            </tr>
            <tr>
              <td><code>ListOperations</code></td>
              <td>Operations for list fields</td>
              <td>Add/remove/reorder list items</td>
            </tr>
            <tr>
              <td><code>ValidationRule</code></td>
              <td>Validation rule definition</td>
              <td>Field validation</td>
            </tr>
            <tr>
              <td><code>LookupFieldConfig</code></td>
              <td>Lookup field configuration</td>
              <td>Search dialogs, entity selection</td>
            </tr>
            <tr>
              <td><code>ListConfig</code></td>
              <td>List field configuration</td>
              <td>Arrays, dynamic lists</td>
            </tr>
            <tr>
              <td><code>VisibilityConfig</code></td>
              <td>Conditional visibility</td>
              <td>Show/hide based on data or permissions</td>
            </tr>
            <tr>
              <td><code>DependsOnConfig</code></td>
              <td>Field dependency configuration</td>
              <td>Cascading dropdowns, dependent fields</td>
            </tr>
            <tr>
              <td><code>BuiltApi</code></td>
              <td>Built API endpoint</td>
              <td>Call API methods</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Import Paths */}
      <div className="docs-section">
        <h2 className="docs-section-title">Import Paths</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Import From</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Context types</td>
              <td><code>import type {'{'} FormContext, PageContext {'}'} from "lumino/core"</code></td>
            </tr>
            <tr>
              <td>Form types</td>
              <td><code>import type {'{'} FieldConfig, SectionConfig {'}'} from "lumino/core"</code></td>
            </tr>
            <tr>
              <td>Validation types</td>
              <td><code>import type {'{'} ValidationRule, ValidationErrors {'}'} from "lumino/core"</code></td>
            </tr>
            <tr>
              <td>API types</td>
              <td><code>import type {'{'} BuiltApi, CallOptions {'}'} from "lumino/core"</code></td>
            </tr>
            <tr>
              <td>Page types</td>
              <td><code>import type {'{'} PageConfig, ComponentConfig {'}'} from "lumino/core"</code></td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}
