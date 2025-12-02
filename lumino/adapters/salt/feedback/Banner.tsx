/**
 * Lumino Framework - Salt Banner (Alert) Adapter
 *
 * Uses createLuminoComponent to map Lumino BannerProps to Salt Banner.
 */

import React from "react";
import { Banner, BannerContent, BannerActions, Button } from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { BannerProps } from "../../../core/types/ui";

/**
 * LuminoBanner - Salt Banner with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - status → status (info, success, warning, error)
 * - children → BannerContent children
 * - closable → Shows close button in BannerActions
 * - onClose → Close button onClick
 *
 * @example
 * ```tsx
 * <LuminoBanner status="success" closable onClose={() => setShow(false)}>
 *   Operation completed successfully!
 * </LuminoBanner>
 * ```
 */
export const LuminoBanner = createLuminoComponent(Banner, {
  props: {
    status: { to: "status" },
    className: {
      to: "className",
      transform: (className) => luminoClass("feedback", "banner", className),
    },
  },
  exclude: ["closable", "onClose", "children"],
  render: (transformedProps, _Banner, originalProps) => {
    const { children, closable, onClose } = originalProps as BannerProps;

    return (
      <Banner {...transformedProps}>
        <BannerContent>{children}</BannerContent>
        {closable && onClose && (
          <BannerActions>
            <Button onClick={onClose} aria-label="Close">
              Close
            </Button>
          </BannerActions>
        )}
      </Banner>
    );
  },
});

// Also export as Alert for semantic clarity (some frameworks use Alert)
export { LuminoBanner as LuminoAlert };

// Legacy aliases for backward compatibility
export { LuminoBanner as SaltBanner };
export { LuminoBanner as SaltAlert };
