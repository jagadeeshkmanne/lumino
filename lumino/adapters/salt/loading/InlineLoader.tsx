/**
 * Lumino Framework - Salt Inline Loader Component
 *
 * Small loading indicator for inline use (buttons, fields, etc.)
 */

import React from "react";
import { FlexLayout, Text, Spinner } from "@salt-ds/core";
import { luminoClass } from "../utils";
import type { InlineLoaderProps, LoadingSize } from "../../../core/types/ui";

/**
 * Map Lumino size to Salt spinner size
 */
const getSaltSize = (size: LoadingSize = "small"): "small" | "medium" | "large" => {
  return size;
};

/**
 * LuminoInlineLoader - Small inline loading indicator
 *
 * @example
 * ```tsx
 * <LuminoInlineLoader loading={isSearching} text="Searching..." />
 * ```
 */
export const LuminoInlineLoader: React.FC<InlineLoaderProps> = ({
  loading,
  size = "small",
  text,
  textPosition = "right",
  className,
  style,
}) => {
  if (!loading) {
    return null;
  }

  return (
    <FlexLayout
      className={luminoClass("loading", "inline-loader", className)}
      gap={1}
      style={{
        alignItems: "center",
        display: "inline-flex",
        ...style,
      }}
    >
      {textPosition === "left" && text && (
        <Text color="secondary" styleAs="notation">
          {text}
        </Text>
      )}

      <Spinner size={getSaltSize(size)} />

      {textPosition === "right" && text && (
        <Text color="secondary" styleAs="notation">
          {text}
        </Text>
      )}
    </FlexLayout>
  );
};

// Legacy alias
export { LuminoInlineLoader as SaltInlineLoader };
