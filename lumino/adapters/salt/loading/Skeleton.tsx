/**
 * Lumino Framework - Salt Skeleton Component
 *
 * Content placeholder for loading states.
 */

import React from "react";
import { StackLayout } from "@salt-ds/core";
import { luminoClass } from "../utils";
import type { SkeletonProps } from "../../../core/types/ui";

/**
 * LuminoSkeleton - Skeleton placeholder for loading content
 *
 * @example
 * ```tsx
 * <LuminoSkeleton variant="text" lines={3} />
 * <LuminoSkeleton variant="rectangular" width={200} height={100} />
 * <LuminoSkeleton variant="circular" width={48} height={48} />
 * ```
 */
export const LuminoSkeleton: React.FC<SkeletonProps> = ({
  variant = "text",
  width,
  height = 20,
  animation = "pulse",
  lines = 1,
  className,
  style,
}) => {
  const getAnimationStyle = () => {
    if (animation === false) return {};
    if (animation === "wave") {
      return {
        background: `linear-gradient(
          90deg,
          var(--salt-palette-neutral-secondary-background) 25%,
          var(--salt-palette-neutral-primary-background) 50%,
          var(--salt-palette-neutral-secondary-background) 75%
        )`,
        backgroundSize: "200% 100%",
        animation: "lumino-skeleton-wave 1.5s ease-in-out infinite",
      };
    }
    return {
      animation: "lumino-skeleton-pulse 1.5s ease-in-out infinite",
    };
  };

  const getBaseStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      backgroundColor: "var(--salt-palette-neutral-secondary-background)",
      ...getAnimationStyle(),
      ...style,
    };

    switch (variant) {
      case "circular":
        return {
          ...baseStyle,
          width: width || 48,
          height: height || 48,
          borderRadius: "50%",
        };
      case "rounded":
        return {
          ...baseStyle,
          width: width || "100%",
          height,
          borderRadius: "var(--salt-palette-corner-default)",
        };
      case "rectangular":
        return {
          ...baseStyle,
          width: width || "100%",
          height,
          borderRadius: 0,
        };
      case "text":
      default:
        return {
          ...baseStyle,
          width: width || "100%",
          height,
          borderRadius: "var(--salt-palette-corner-default)",
        };
    }
  };

  // Render multiple lines for text variant
  if (variant === "text" && lines > 1) {
    return (
      <>
        <style>{`
          @keyframes lumino-skeleton-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.3; }
          }
          @keyframes lumino-skeleton-wave {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <StackLayout
          className={luminoClass("loading", "skeleton", className)}
          gap={1}
        >
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              style={{
                ...getBaseStyle(),
                width: i === lines - 1 ? "60%" : width || "100%",
              }}
            />
          ))}
        </StackLayout>
      </>
    );
  }

  return (
    <>
      <style>{`
        @keyframes lumino-skeleton-pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
        @keyframes lumino-skeleton-wave {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div
        className={luminoClass("loading", `skeleton-${variant} ${className || ""}`.trim())}
        style={getBaseStyle()}
      />
    </>
  );
};

// Legacy alias
export { LuminoSkeleton as SaltSkeleton };
