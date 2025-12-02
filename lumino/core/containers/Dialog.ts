/**
 * Lumino Framework - Dialog Base Class
 *
 * Abstract base class for defining modal dialogs with fluent builder pattern.
 * UI-independent - renderers are handled by UI adapters.
 *
 * Dialog extends Component, so it can have inline field definitions via addRow().
 *
 * Can be used:
 * - Standalone dialogs with inline fields
 * - Dialogs that wrap existing Form classes
 * - Confirmations with simple content
 * - With custom components
 */

import type { ComponentType, ReactNode } from "react";
import type { FormContext } from "../types/context";
import type { RowConfig } from "../types/form";
import { Component } from "../form/Form";

// =============================================================================
// DIALOG ACTION TYPES
// =============================================================================

/**
 * Configuration for a dialog action button
 */
export interface DialogActionConfig {
  /** Action ID */
  id: string;
  /** Button label */
  label: string | ((ctx: FormContext) => string);
  /** Button variant */
  variant?: "primary" | "secondary" | "danger" | "ghost";
  /** Click handler - return false to prevent close */
  onClick?: (ctx: FormContext) => void | boolean | Promise<void | boolean>;
  /** Is disabled */
  disabled?: boolean | ((ctx: FormContext) => boolean);
  /** Is loading */
  loading?: boolean | ((ctx: FormContext) => boolean);
  /** Close dialog after action */
  closeOnClick?: boolean;
  /** Position in footer */
  position?: "left" | "right";
  /** Icon */
  icon?: ReactNode | string;
}

/**
 * Built dialog configuration
 */
export interface DialogConfig {
  /** Dialog ID */
  id: string;
  /** Dialog title */
  title?: string | ((ctx: FormContext) => string);
  /** Dialog subtitle */
  subtitle?: string | ((ctx: FormContext) => string);
  /** Dialog size */
  size?: "small" | "medium" | "large" | "fullscreen";
  /** Show close button in header */
  showCloseButton?: boolean;
  /** Close on backdrop click */
  closeOnBackdrop?: boolean;
  /** Close on escape key */
  closeOnEscape?: boolean;
  /** Inline row definitions from Dialog.addRow() */
  rows?: RowConfig[];
  /** Form class to render inside */
  form?: any;
  /** Custom component */
  component?: ComponentType<any>;
  /** Props for form/component */
  props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  /** Custom render function */
  render?: (ctx: FormContext) => ReactNode;
  /** Footer actions */
  actions: DialogActionConfig[];
  /** CSS class */
  cssClass?: string;
  /** On open handler */
  onOpen?: (ctx: FormContext) => void;
  /** On close handler */
  onClose?: (ctx: FormContext) => void;
  /** On before close - return false to prevent close */
  onBeforeClose?: (ctx: FormContext) => boolean | Promise<boolean>;
}

// =============================================================================
// ACTION BUILDER IMPLEMENTATION
// =============================================================================

class DialogActionBuilderImpl<TParent> {
  private _config: DialogActionConfig;
  private _parent: TParent;

  constructor(id: string, label: string, parent: TParent) {
    this._parent = parent;
    this._config = {
      id,
      label,
      closeOnClick: true, // Default to closing
    };
  }

  variant(variant: "primary" | "secondary" | "danger" | "ghost"): this {
    this._config.variant = variant;
    return this;
  }

  onClick(handler: (ctx: FormContext) => void | boolean | Promise<void | boolean>): this {
    this._config.onClick = handler;
    return this;
  }

  disabled(condition: boolean | ((ctx: FormContext) => boolean)): this {
    this._config.disabled = condition;
    return this;
  }

  loading(condition: boolean | ((ctx: FormContext) => boolean)): this {
    this._config.loading = condition;
    return this;
  }

  closeOnClick(close: boolean = true): this {
    this._config.closeOnClick = close;
    return this;
  }

  keepOpen(): this {
    this._config.closeOnClick = false;
    return this;
  }

  position(pos: "left" | "right"): this {
    this._config.position = pos;
    return this;
  }

  icon(icon: ReactNode | string): this {
    this._config.icon = icon;
    return this;
  }

  end(): TParent {
    return this._parent;
  }

  _getConfig(): DialogActionConfig {
    return this._config;
  }
}

// =============================================================================
// DIALOG BASE CLASS
// =============================================================================

/**
 * Abstract base class for defining modal dialogs.
 * Extends Component to support inline field definitions via addRow().
 *
 * @example
 * ```typescript
 * // Dialog with inline fields
 * class ExperienceDialog extends Dialog {
 *   configure() {
 *     this.title("Add Experience")
 *       .size("medium");
 *
 *     // Inline field definitions (inherited from Component)
 *     this.addRow()
 *       .addField("company").component(TextInput).label("Company").required().endField()
 *       .addField("title").component(TextInput).label("Job Title").required().endField()
 *       .layout([1, 1])
 *       .endRow();
 *
 *     this.addRow()
 *       .addField("description").component(TextInput).label("Description").endField()
 *       .endRow();
 *
 *     this.action("cancel", "Cancel").variant("secondary");
 *     this.action("save", "Save").variant("primary")
 *       .onClick(async (ctx) => {
 *         if (await ctx.validate()) {
 *           ctx.dialogOptions?.onSave?.(ctx.getFormData());
 *           ctx.close?.();
 *         }
 *       });
 *   }
 * }
 *
 * // Confirmation dialog with simple content
 * class DeleteConfirmDialog extends Dialog {
 *   configure() {
 *     this.title("Delete Item")
 *       .size("small")
 *       .closeOnBackdrop(false);
 *
 *     this.content((ctx) => `Are you sure you want to delete "${ctx.getValue("name")}"?`);
 *
 *     this.action("cancel", "Cancel").variant("secondary");
 *     this.action("delete", "Delete").variant("danger")
 *       .onClick(async (ctx) => {
 *         await ctx.api.items.delete(ctx.getValue("id"));
 *         ctx.notify("Deleted!", "success");
 *       });
 *   }
 * }
 *
 * // Dialog wrapping an existing Form
 * class EditUserDialog extends Dialog {
 *   configure() {
 *     this.title("Edit User")
 *       .size("medium")
 *       .form(UserForm);
 *
 *     this.action("cancel", "Cancel").variant("secondary");
 *     this.action("save", "Save").variant("primary")
 *       .onClick(async (ctx) => {
 *         const valid = await ctx.validateForm();
 *         if (!valid) return false;
 *         await ctx.submitForm("save");
 *       });
 *   }
 * }
 * ```
 */
export abstract class Dialog extends Component<any> {
  protected readonly _id!: string;
  protected _title?: string | ((ctx: FormContext) => string);
  protected _subtitle?: string | ((ctx: FormContext) => string);
  protected _size: "small" | "medium" | "large" | "fullscreen" = "medium";
  protected _showCloseButton: boolean = true;
  protected _closeOnBackdrop: boolean = true;
  protected _closeOnEscape: boolean = true;
  protected _form?: any;
  protected _component?: ComponentType<any>;
  protected _props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  protected _render?: (ctx: FormContext) => ReactNode;
  protected _actions: DialogActionBuilderImpl<Dialog>[] = [];
  protected _cssClass?: string;

  constructor(id: string) {
    super(); // Calls Component constructor which calls configure()
    // Note: _id will be set after super() but configure() can't use it yet
    // Subclasses should avoid using this._id in configure()
    (this as any)._id = id;
  }

  // ===========================================================================
  // BUILDER METHODS
  // ===========================================================================

  /**
   * Set dialog title
   */
  protected title(title: string | ((ctx: FormContext) => string)): this {
    this._title = title;
    return this;
  }

  /**
   * Set dialog subtitle
   */
  protected subtitle(subtitle: string | ((ctx: FormContext) => string)): this {
    this._subtitle = subtitle;
    return this;
  }

  /**
   * Set dialog size
   */
  protected size(size: "small" | "medium" | "large" | "fullscreen"): this {
    this._size = size;
    return this;
  }

  /**
   * Show/hide close button in header
   */
  protected showCloseButton(show: boolean = true): this {
    this._showCloseButton = show;
    return this;
  }

  /**
   * Enable/disable close on backdrop click
   */
  protected closeOnBackdrop(close: boolean = true): this {
    this._closeOnBackdrop = close;
    return this;
  }

  /**
   * Enable/disable close on escape key
   */
  protected closeOnEscape(close: boolean = true): this {
    this._closeOnEscape = close;
    return this;
  }

  /**
   * Set form to render inside dialog
   */
  protected form(formClass: any, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._form = formClass;
    if (props) {
      this._props = props;
    }
    return this;
  }

  /**
   * Set custom component
   */
  protected component(comp: ComponentType<any>, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._component = comp;
    if (props) {
      this._props = props;
    }
    return this;
  }

  /**
   * Set custom render function (for simple content)
   */
  protected content(render: string | ((ctx: FormContext) => ReactNode)): this {
    if (typeof render === "string") {
      this._render = () => render;
    } else {
      this._render = render;
    }
    return this;
  }

  /**
   * Add action button to footer
   */
  protected action(id: string, label: string): DialogActionBuilderImpl<Dialog> {
    // Lazy init - needed because super() calls configure() before _actions is initialized
    if (!this._actions) {
      this._actions = [];
    }
    const actionBuilder = new DialogActionBuilderImpl<Dialog>(id, label, this);
    this._actions.push(actionBuilder);
    return actionBuilder;
  }

  /**
   * Set CSS class
   */
  protected css(className: string): this {
    this._cssClass = className;
    return this;
  }

  // ===========================================================================
  // LIFECYCLE HOOKS (Override in subclass)
  // ===========================================================================

  /**
   * Called when dialog opens
   */
  onOpen?(ctx: FormContext): void;

  /**
   * Called when dialog closes
   */
  onClose?(ctx: FormContext): void;

  /**
   * Called before dialog closes - return false to prevent close
   */
  onBeforeClose?(ctx: FormContext): boolean | Promise<boolean>;

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  /**
   * Get dialog ID
   */
  get id(): string {
    return this._id;
  }

  /**
   * Get action config by ID
   */
  getAction(actionId: string): DialogActionConfig | undefined {
    return (this._actions || []).find((a) => a._getConfig().id === actionId)?._getConfig();
  }

  /**
   * Get all action IDs
   */
  getActionIds(): string[] {
    return (this._actions || []).map((a) => a._getConfig().id);
  }

  /**
   * Build the dialog configuration.
   * Overrides Component.build() to return DialogConfig.
   */
  // @ts-expect-error - Dialog.build() returns DialogConfig instead of Component's { rows }
  build(): DialogConfig {
    // Get rows from Component base class
    const rows = this._getRows();

    return {
      id: this._id,
      title: this._title,
      subtitle: this._subtitle,
      size: this._size,
      showCloseButton: this._showCloseButton,
      closeOnBackdrop: this._closeOnBackdrop,
      closeOnEscape: this._closeOnEscape,
      rows: rows.length > 0 ? rows : undefined,
      form: this._form,
      component: this._component,
      props: this._props,
      render: this._render,
      actions: (this._actions || []).map((a) => a._getConfig()),
      cssClass: this._cssClass,
      onOpen: this.onOpen?.bind(this),
      onClose: this.onClose?.bind(this),
      onBeforeClose: this.onBeforeClose?.bind(this),
    };
  }
}

// =============================================================================
// FACTORY FUNCTIONS
// =============================================================================

/**
 * Create dialog configuration inline without extending Dialog class.
 *
 * @example
 * ```typescript
 * const confirmDialog = createDialog("confirm", (d) => {
 *   d.title("Confirm Action")
 *     .size("small")
 *     .content("Are you sure?");
 *
 *   d.action("cancel", "Cancel").variant("secondary").end();
 *   d.action("confirm", "Confirm").variant("primary").end();
 * });
 * ```
 */
export function createDialog(
  id: string,
  configure: (dialog: DialogConfigBuilder) => void
): DialogConfig {
  const builder = new DialogConfigBuilder(id);
  configure(builder);
  return builder.build();
}

/**
 * Create a simple confirm dialog configuration
 */
export function createConfirmDialog(options: {
  id?: string;
  title?: string;
  message: string | ((ctx: FormContext) => ReactNode);
  confirmLabel?: string;
  cancelLabel?: string;
  confirmVariant?: "primary" | "danger";
  onConfirm: (ctx: FormContext) => void | Promise<void>;
  onCancel?: (ctx: FormContext) => void;
}): DialogConfig {
  const builder = new DialogConfigBuilder(options.id || "confirm-dialog");

  if (options.title) {
    builder.title(options.title);
  }

  builder.size("small").closeOnBackdrop(false);

  if (typeof options.message === "string") {
    builder.content(options.message);
  } else {
    builder.content(options.message);
  }

  builder
    .action("cancel", options.cancelLabel || "Cancel")
    .variant("secondary")
    .onClick(options.onCancel || (() => {}))
    .end();

  builder
    .action("confirm", options.confirmLabel || "Confirm")
    .variant(options.confirmVariant || "primary")
    .onClick(options.onConfirm)
    .end();

  return builder.build();
}

/**
 * Builder for inline dialog creation
 */
class DialogConfigBuilder {
  private _id: string;
  private _title?: string | ((ctx: FormContext) => string);
  private _subtitle?: string | ((ctx: FormContext) => string);
  private _size: "small" | "medium" | "large" | "fullscreen" = "medium";
  private _showCloseButton: boolean = true;
  private _closeOnBackdrop: boolean = true;
  private _closeOnEscape: boolean = true;
  private _form?: any;
  private _component?: ComponentType<any>;
  private _props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>);
  private _render?: (ctx: FormContext) => ReactNode;
  private _actions: DialogActionBuilderImpl<DialogConfigBuilder>[] = [];
  private _cssClass?: string;

  constructor(id: string) {
    this._id = id;
  }

  title(title: string | ((ctx: FormContext) => string)): this {
    this._title = title;
    return this;
  }

  subtitle(subtitle: string | ((ctx: FormContext) => string)): this {
    this._subtitle = subtitle;
    return this;
  }

  size(size: "small" | "medium" | "large" | "fullscreen"): this {
    this._size = size;
    return this;
  }

  showCloseButton(show: boolean = true): this {
    this._showCloseButton = show;
    return this;
  }

  closeOnBackdrop(close: boolean = true): this {
    this._closeOnBackdrop = close;
    return this;
  }

  closeOnEscape(close: boolean = true): this {
    this._closeOnEscape = close;
    return this;
  }

  form(formClass: any, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._form = formClass;
    if (props) {
      this._props = props;
    }
    return this;
  }

  component(comp: ComponentType<any>, props?: Record<string, any> | ((ctx: FormContext) => Record<string, any>)): this {
    this._component = comp;
    if (props) {
      this._props = props;
    }
    return this;
  }

  content(render: string | ((ctx: FormContext) => ReactNode)): this {
    if (typeof render === "string") {
      this._render = () => render;
    } else {
      this._render = render;
    }
    return this;
  }

  action(id: string, label: string): DialogActionBuilderImpl<DialogConfigBuilder> {
    const actionBuilder = new DialogActionBuilderImpl<DialogConfigBuilder>(id, label, this);
    this._actions.push(actionBuilder);
    return actionBuilder;
  }

  css(className: string): this {
    this._cssClass = className;
    return this;
  }

  build(): DialogConfig {
    return {
      id: this._id,
      title: this._title,
      subtitle: this._subtitle,
      size: this._size,
      showCloseButton: this._showCloseButton,
      closeOnBackdrop: this._closeOnBackdrop,
      closeOnEscape: this._closeOnEscape,
      form: this._form,
      component: this._component,
      props: this._props,
      render: this._render,
      actions: this._actions.map((a) => a._getConfig()),
      cssClass: this._cssClass,
    };
  }
}
