/**
 * Lumino Framework - Dialog Renderer
 *
 * Renders standalone Dialog container configurations.
 * UI-library independent - uses UI adapter for actual rendering.
 */

import React, { useState, useMemo, useCallback, ReactNode, useEffect } from "react";
import type { DialogConfig, DialogActionConfig } from "../../core/containers/Dialog";
import type { FormContext } from "../../core/types/context";
import type { RowConfig } from "../../core/types/form";
import { Lumino } from "../../core/Lumino";
import { FormRenderer, resolveComponent, RowRenderer } from "./FormRenderer";
import { useForm } from "../hooks/useForm";
import { Form } from "../../core/form/Form";

// =============================================================================
// DIALOG RENDERER PROPS
// =============================================================================

export interface DialogRendererProps {
  /** Dialog configuration (from Dialog.build() or createDialog()) */
  config: DialogConfig;
  /** Form context */
  context: FormContext;
  /** Is dialog open (controlled) */
  open: boolean;
  /** Called when dialog should close */
  onClose: () => void;
  /** Custom class name */
  className?: string;
  /** Render prop for custom content */
  children?: (context: FormContext) => ReactNode;
}

// =============================================================================
// DEFAULT DIALOG COMPONENT (fallback)
// =============================================================================

interface DefaultDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  size?: "small" | "medium" | "large" | "fullscreen";
  showCloseButton?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
  className?: string;
  children: ReactNode;
  footer?: ReactNode;
}

function DefaultDialog({
  open,
  onClose,
  title,
  subtitle,
  size = "medium",
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  children,
  footer,
}: DefaultDialogProps) {
  // Handle escape key
  useEffect(() => {
    if (!open || !closeOnEscape) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEscape, onClose]);

  if (!open) return null;

  const sizeStyles: Record<string, React.CSSProperties> = {
    small: { maxWidth: 400 },
    medium: { maxWidth: 600 },
    large: { maxWidth: 900 },
    fullscreen: { width: "100vw", height: "100vh", maxWidth: "100vw", margin: 0 },
  };

  const backdropStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const dialogStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: size === "fullscreen" ? 0 : 8,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    width: "100%",
    maxHeight: size === "fullscreen" ? "100vh" : "90vh",
    display: "flex",
    flexDirection: "column",
    ...sizeStyles[size],
  };

  const headerStyle: React.CSSProperties = {
    padding: "16px 24px",
    borderBottom: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  };

  const contentStyle: React.CSSProperties = {
    padding: "24px",
    flex: 1,
    overflow: "auto",
  };

  const footerStyle: React.CSSProperties = {
    padding: "16px 24px",
    borderTop: "1px solid #e0e0e0",
    display: "flex",
    justifyContent: "flex-end",
    gap: 8,
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`lum-dialog-backdrop ${className || ""}`}
      style={backdropStyle}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="lum-dialog" style={dialogStyle}>
        {(title || showCloseButton) && (
          <div className="lum-dialog__header" style={headerStyle}>
            <div>
              {title && <h2 style={{ margin: 0, fontSize: 18 }}>{title}</h2>}
              {subtitle && <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>{subtitle}</p>}
            </div>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                style={{
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  padding: 4,
                }}
                aria-label="Close"
              >
                ×
              </button>
            )}
          </div>
        )}
        <div className="lum-dialog__content" style={contentStyle}>
          {children}
        </div>
        {footer && (
          <div className="lum-dialog__footer" style={footerStyle}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// DIALOG INLINE FORM CONTENT
// =============================================================================

interface DialogFormContentProps {
  rows: RowConfig[];
  config: DialogConfig;
  context: FormContext;
}

/**
 * Creates a temporary Form class for Dialog inline rows.
 * This allows Dialog to use useForm hook properly.
 */
function createDialogForm(config: DialogConfig): Form<any> {
  class DialogInlineForm extends Form<any> {
    constructor() {
      super(config.id);
    }
    configure() {
      // Add rows from dialog config
      // Note: rows are already built, we just need to return them
    }
  }
  const form = new DialogInlineForm();
  // Inject the pre-built rows directly
  (form as any)._rows = config.rows || [];

  // Extract field rules from rows for validation
  // This mimics what Form._extractFieldRules() does
  const fieldRulesMap = (form as any)._fieldRulesMap as Map<string, any[]>;
  for (const row of config.rows || []) {
    for (const field of row.fields || []) {
      if (field.rules && field.rules.length > 0) {
        fieldRulesMap.set(field.name, field.rules);
      }
    }
  }

  return form;
}

/**
 * Renders inline dialog rows with Lumino useForm integration.
 * Used when Dialog has addRow() definitions.
 */
function DialogFormContent({ rows, config, context }: DialogFormContentProps) {
  // Create a stable key from dialog data to force re-render when data changes
  const dialogDataKey = useMemo(() => {
    return JSON.stringify(context.dialogData || {});
  }, [context.dialogData]);

  // Create a temporary form for the dialog's inline fields
  // Include dialogDataKey to recreate form when data changes
  const dialogForm = useMemo(() => createDialogForm(config), [config, dialogDataKey]);

  // Use Lumino's useForm hook with the dialog data
  const formState = useForm(dialogForm, {
    initialValues: context.dialogData || {},
  });

  // Merge parent dialog context with form context
  // This ensures onClick handlers have access to close(), dialogOptions, etc.
  const mergedContext = useMemo<FormContext>(() => ({
    ...formState.formContext,
    // Dialog-specific context from parent
    close: context.close,
    dialogOptions: context.dialogOptions,
    dialogData: context.dialogData,
    // Keep validate and getFormData from formState (they work with the dialog's form)
    validate: formState.formContext.validate,
    getFormData: formState.formContext.getFormData,
    // Pass through other dialog context methods
    notify: context.notify,
    open: context.open,
  }), [formState.formContext, context]);

  return (
    <div className="lum-dialog__form" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {rows.map((row, index) => (
        <RowRenderer
          key={`dialog-row-${index}`}
          row={row}
          form={formState}
          context={mergedContext}
          rowIndex={index}
        />
      ))}
    </div>
  );
}

// =============================================================================
// DEFAULT BUTTON COMPONENT (fallback)
// =============================================================================

interface DefaultButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children?: ReactNode;
}

function DefaultButton({ label, onClick, variant = "secondary", disabled, loading, icon }: DefaultButtonProps) {
  const baseStyle: React.CSSProperties = {
    padding: "8px 16px",
    borderRadius: 4,
    border: "1px solid",
    cursor: disabled || loading ? "not-allowed" : "pointer",
    opacity: disabled || loading ? 0.6 : 1,
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 500,
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: "#1976d2",
      borderColor: "#1976d2",
      color: "white",
    },
    secondary: {
      backgroundColor: "white",
      borderColor: "#ccc",
      color: "#333",
    },
    danger: {
      backgroundColor: "#d32f2f",
      borderColor: "#d32f2f",
      color: "white",
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
      color: "#1976d2",
    },
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      style={{ ...baseStyle, ...variantStyles[variant] }}
      className={`lum-dialog__btn lum-dialog__btn--${variant}`}
    >
      {loading && <span>...</span>}
      {icon}
      {label}
    </button>
  );
}

// =============================================================================
// DIALOG RENDERER COMPONENT
// =============================================================================

/**
 * Renders a standalone Dialog container.
 *
 * @example
 * ```typescript
 * // With Dialog class
 * const confirmDialog = new ConfirmDialog("confirm");
 * const [open, setOpen] = useState(false);
 *
 * <DialogRenderer
 *   config={confirmDialog.build()}
 *   context={formContext}
 *   open={open}
 *   onClose={() => setOpen(false)}
 * />
 *
 * // With createDialog
 * const dialog = createDialog("myDialog", (d) => {
 *   d.title("Confirm").content("Are you sure?");
 *   d.action("cancel", "Cancel").variant("secondary").end();
 *   d.action("confirm", "Confirm").variant("primary").end();
 * });
 *
 * <DialogRenderer config={dialog} context={context} open={open} onClose={onClose} />
 * ```
 */
export function DialogRenderer({
  config,
  context,
  open,
  onClose,
  className,
  children,
}: DialogRendererProps) {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Call onOpen when dialog opens
  useEffect(() => {
    if (open) {
      config.onOpen?.(context);
    }
  }, [open, config, context]);

  // Handle close with onBeforeClose check
  const handleClose = useCallback(async () => {
    if (config.onBeforeClose) {
      const canClose = await config.onBeforeClose(context);
      if (!canClose) return;
    }
    config.onClose?.(context);
    onClose();
  }, [config, context, onClose]);

  // Process title and subtitle
  const title = useMemo(() => {
    if (typeof config.title === "function") {
      return config.title(context);
    }
    return config.title;
  }, [config.title, context]);

  const subtitle = useMemo(() => {
    if (typeof config.subtitle === "function") {
      return config.subtitle(context);
    }
    return config.subtitle;
  }, [config.subtitle, context]);

  // Handle action click
  const handleActionClick = useCallback(
    async (action: DialogActionConfig) => {
      if (action.onClick) {
        setActionLoading(action.id);
        try {
          const result = await action.onClick(context);
          if (result === false) {
            // Action returned false, don't close
            setActionLoading(null);
            return;
          }
        } catch (error) {
          console.error("Dialog action error:", error);
          setActionLoading(null);
          return;
        }
        setActionLoading(null);
      }

      if (action.closeOnClick !== false) {
        handleClose();
      }
    },
    [context, handleClose]
  );

  // Render dialog content
  const renderContent = useCallback(() => {
    // Custom render via children prop
    if (children) {
      return children(context);
    }

    // Custom render function on config
    if (config.render) {
      return config.render(context);
    }

    // Inline rows from Dialog.addRow() (Dialog extends Component)
    if (config.rows && config.rows.length > 0) {
      return <DialogFormContent rows={config.rows} config={config} context={context} />;
    }

    // Form class
    if (config.form) {
      const FormClass = config.form;
      const formInstance = new FormClass(config.id);
      const formProps =
        typeof config.props === "function"
          ? config.props(context)
          : config.props || {};

      return <FormRenderer form={formInstance} {...formProps} />;
    }

    // Custom component
    if (config.component) {
      const Component = resolveComponent(config.component);
      if (Component) {
        const componentProps =
          typeof config.props === "function"
            ? config.props(context)
            : config.props || {};
        return <Component {...componentProps} context={context} />;
      }
    }

    return null;
  }, [children, config, context]);

  // Render actions
  const renderActions = useCallback(() => {
    if (!config.actions || config.actions.length === 0) return null;

    const adapter = Lumino.ui.get();
    const ButtonComponent = adapter?.actions?.Button || DefaultButton;

    return (
      <>
        {config.actions.map((action) => {
          const disabled =
            typeof action.disabled === "function"
              ? action.disabled(context)
              : action.disabled;
          const loading =
            actionLoading === action.id ||
            (typeof action.loading === "function"
              ? action.loading(context)
              : action.loading);
          const label =
            typeof action.label === "function"
              ? action.label(context)
              : action.label;

          return (
            <ButtonComponent
              key={action.id}
              label={label}
              onClick={() => handleActionClick(action)}
              variant={action.variant}
              disabled={disabled}
              loading={loading}
              icon={action.icon}
            >
              {label}
            </ButtonComponent>
          );
        })}
      </>
    );
  }, [config.actions, context, actionLoading, handleActionClick]);

  // Get dialog component from adapter
  const adapter = Lumino.ui.get();
  const DialogComponent = adapter?.containers?.Dialog || DefaultDialog;

  return (
    <DialogComponent
      open={open}
      onClose={handleClose}
      title={title}
      subtitle={subtitle}
      size={config.size}
      showCloseButton={config.showCloseButton}
      closeOnBackdrop={config.closeOnBackdrop}
      closeOnEscape={config.closeOnEscape}
      className={`${config.cssClass || ""} ${className || ""}`.trim() || undefined}
      footer={renderActions()}
    >
      {renderContent()}
    </DialogComponent>
  );
}

// =============================================================================
// DIALOG HOOK
// =============================================================================

export interface UseDialogReturn {
  /** Is dialog open */
  isOpen: boolean;
  /** Open the dialog */
  open: () => void;
  /** Close the dialog */
  close: () => void;
  /** Toggle dialog */
  toggle: () => void;
  /** Dialog renderer props */
  dialogProps: {
    open: boolean;
    onClose: () => void;
  };
}

/**
 * Hook for managing dialog state.
 *
 * @example
 * ```typescript
 * const deleteDialog = useDialog();
 *
 * <button onClick={deleteDialog.open}>Delete</button>
 *
 * <DialogRenderer
 *   config={confirmDeleteConfig}
 *   context={context}
 *   {...deleteDialog.dialogProps}
 * />
 * ```
 */
export function useDialog(initialOpen = false): UseDialogReturn {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    dialogProps: {
      open: isOpen,
      onClose: close,
    },
  };
}

// Components are already exported inline with export function
