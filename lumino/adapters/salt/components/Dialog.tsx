/**
 * Lumino Framework - Salt Dialog Adapter
 *
 * Uses createLuminoComponent with custom render for dialog structure.
 */

import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogActions,
  DialogCloseButton,
} from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";

/**
 * LuminoDialog - Salt Dialog with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - size → size (with fullscreen mapped to large)
 *
 * Lumino Events → Salt Events:
 * - onClose() ← onOpenChange(false)
 *
 * Custom render needed for DialogHeader, DialogContent, DialogActions structure
 */
export const LuminoDialog = createLuminoComponent(Dialog, {
  exclude: ["onClose", "title", "footer", "showCloseButton", "closeOnBackdrop", "closeOnEscape", "size"],
  render: (_transformedProps, _Dialog, originalProps) => {
    const {
      open,
      onClose,
      title,
      footer,
      children,
      size = "medium",
      showCloseButton = true,
      closeOnBackdrop = true,
      closeOnEscape = true,
      className,
      style,
      "data-testid": testId,
    } = originalProps as any;

    // Normalize onOpenChange: Salt uses boolean, Lumino uses onClose()
    const handleOpenChange = (isOpen: boolean) => {
      if (!isOpen) {
        onClose?.();
      }
    };

    // Map Lumino size to Salt size (Salt doesn't have "fullscreen")
    const saltSize = size === "fullscreen" ? "large" : size;

    return (
      <Dialog
        open={open}
        onOpenChange={handleOpenChange}
        size={saltSize}
        disableDismiss={!closeOnBackdrop && !closeOnEscape}
        className={luminoClass("container", "dialog", className)}
        style={style}
        data-testid={testId}
      >
        {title && <DialogHeader header={title} />}
        <DialogContent>{children}</DialogContent>
        {footer && <DialogActions>{footer}</DialogActions>}
        {showCloseButton && <DialogCloseButton onClick={onClose} />}
      </Dialog>
    );
  },
});
