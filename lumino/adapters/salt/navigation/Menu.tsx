/**
 * Lumino Framework - Salt Menu Adapter
 *
 * Uses createLuminoComponent to map Lumino MenuProps to Salt Menu.
 */

import React from "react";
import {
  Menu,
  MenuTrigger,
  MenuPanel,
  MenuItem,
  MenuGroup,
  Divider,
} from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { MenuProps, MenuItem as MenuItemType } from "../../../core/types/ui";

/**
 * LuminoMenu - Salt Menu with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - items → MenuItems (rendered recursively)
 * - trigger → MenuTrigger children
 * - open → open (controlled)
 * - onOpenChange → onOpenChange
 * - placement → placement
 *
 * @example
 * ```tsx
 * <LuminoMenu
 *   trigger={<button>Open Menu</button>}
 *   items={[
 *     { key: "edit", label: "Edit", onClick: handleEdit },
 *     { key: "delete", label: "Delete", onClick: handleDelete },
 *   ]}
 * />
 * ```
 */
export const LuminoMenu = createLuminoComponent(Menu, {
  props: {
    open: { to: "open" },
    placement: { to: "placement" },
    className: {
      to: "className",
      transform: (className) => luminoClass("navigation", "menu", className),
    },
  },
  events: {
    onOpenChange: {
      to: "onOpenChange",
      extract: (open: boolean) => open,
    },
  },
  exclude: ["items", "trigger"],
  render: (transformedProps, _Menu, originalProps) => {
    const { items, trigger } = originalProps as MenuProps;

    const renderItems = (menuItems: MenuItemType[]): React.ReactNode => {
      return menuItems.map((item, index) => {
        // Divider
        if (item.divider) {
          return <Divider key={item.key || `divider-${index}`} />;
        }

        // Item with children (submenu)
        if (item.children && item.children.length > 0) {
          return (
            <MenuGroup key={item.key} label={item.label as string}>
              {renderItems(item.children)}
            </MenuGroup>
          );
        }

        // Regular item
        return (
          <MenuItem
            key={item.key}
            onClick={item.onClick}
            disabled={item.disabled}
          >
            {item.icon && <span style={{ marginRight: 8 }}>{item.icon}</span>}
            {item.label}
          </MenuItem>
        );
      });
    };

    return (
      <Menu {...transformedProps}>
        <MenuTrigger>{trigger}</MenuTrigger>
        <MenuPanel>{renderItems(items)}</MenuPanel>
      </Menu>
    );
  },
});

// Legacy alias for backward compatibility
export { LuminoMenu as SaltMenu };
