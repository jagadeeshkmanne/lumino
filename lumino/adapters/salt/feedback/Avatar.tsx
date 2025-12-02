/**
 * Lumino Framework - Salt Avatar Adapter
 *
 * Uses createLuminoComponent to map Lumino AvatarProps to Salt Avatar.
 */

import React from "react";
import { Avatar } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { AvatarProps } from "../../../core/types/ui";

/**
 * LuminoAvatar - Salt Avatar with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - name → name (used for initials)
 * - src → src
 * - size → size (maps to Salt size)
 *
 * @example
 * ```tsx
 * <LuminoAvatar name="John Doe" src="/avatar.jpg" size="medium" />
 * ```
 */
export const LuminoAvatar = createLuminoComponent(Avatar, {
  props: {
    name: { to: "name" },
    src: { to: "src" },
    className: {
      to: "className",
      transform: (className) => luminoClass("feedback", "avatar", className),
    },
    size: {
      to: "size",
      transform: (size) => {
        // Map Lumino sizes to Salt sizes (1 = small, 2 = medium, etc.)
        if (typeof size === "number") return size;
        switch (size) {
          case "small": return 1;
          case "medium": return 2;
          case "large": return 3;
          default: return 2;
        }
      },
    },
  },
  // Exclude Lumino-specific props not directly supported by Salt Avatar
  exclude: ["alt", "fallback", "variant"],
});

// Legacy alias for backward compatibility
export { LuminoAvatar as SaltAvatar };
