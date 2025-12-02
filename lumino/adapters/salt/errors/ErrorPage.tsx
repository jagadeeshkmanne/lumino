/**
 * Lumino Framework - Salt Error Page Component
 *
 * Generic error page that displays error information with Salt DS styling.
 */

import React from "react";
import { Button, FlexLayout, StackLayout, Text, H1, H2 } from "@salt-ds/core";
import { luminoClass } from "../utils";
import type { ErrorPageProps, ErrorStatusCode } from "../../../core/types/ui";
import { DEFAULT_ERROR_MESSAGES } from "../../../core/types/ui";

/**
 * Get error icon based on status code
 */
const getErrorIcon = (statusCode: ErrorStatusCode): string => {
  if (statusCode >= 500) return "🔧"; // Server errors
  if (statusCode === 404) return "🔍"; // Not found
  if (statusCode === 401) return "🔐"; // Unauthorized
  if (statusCode === 403) return "🚫"; // Forbidden
  if (statusCode === 429) return "⏳"; // Rate limited
  return "⚠️"; // Generic error
};

/**
 * LuminoErrorPage - Generic error page component
 *
 * @example
 * ```tsx
 * <LuminoErrorPage
 *   statusCode={404}
 *   onHome={() => navigate("/")}
 *   showRetry
 *   onRetry={() => window.location.reload()}
 * />
 * ```
 */
export const LuminoErrorPage: React.FC<ErrorPageProps> = ({
  statusCode,
  title,
  message,
  details,
  stack,
  showRetry = false,
  onRetry,
  showHome = true,
  onHome,
  action,
  illustration,
  children,
  className,
  style,
}) => {
  const defaultMessages = DEFAULT_ERROR_MESSAGES[statusCode] || {
    title: "Error",
    message: "An unexpected error occurred.",
  };

  const displayTitle = title || defaultMessages.title;
  const displayMessage = message || defaultMessages.message;
  const isDevMode = process.env.NODE_ENV === "development";

  return (
    <FlexLayout
      className={luminoClass("error", "page", className)}
      style={{
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        padding: "var(--salt-spacing-400)",
        ...style,
      }}
    >
      <StackLayout
        gap={3}
        style={{
          textAlign: "center",
          maxWidth: 600,
        }}
      >
        {/* Error Icon/Illustration */}
        <div style={{ fontSize: "4rem", marginBottom: "var(--salt-spacing-200)" }}>
          {illustration || getErrorIcon(statusCode)}
        </div>

        {/* Status Code */}
        <Text
          styleAs="display3"
          style={{
            color: "var(--salt-status-error-foreground)",
            fontWeight: 700,
          }}
        >
          {statusCode}
        </Text>

        {/* Title */}
        <H1 styleAs="h2">{displayTitle}</H1>

        {/* Message */}
        <Text
          color="secondary"
          style={{ fontSize: "var(--salt-text-fontSize-base)" }}
        >
          {displayMessage}
        </Text>

        {/* Details (dev mode only) */}
        {isDevMode && details && (
          <StackLayout gap={1}>
            <H2 styleAs="h4">Details</H2>
            <Text
              as="pre"
              style={{
                textAlign: "left",
                padding: "var(--salt-spacing-200)",
                backgroundColor: "var(--salt-container-secondary-background)",
                borderRadius: "var(--salt-palette-corner-default)",
                overflow: "auto",
                maxHeight: 200,
                fontSize: "var(--salt-text-fontSize-small)",
              }}
            >
              {details}
            </Text>
          </StackLayout>
        )}

        {/* Stack trace (dev mode only) */}
        {isDevMode && stack && (
          <StackLayout gap={1}>
            <H2 styleAs="h4">Stack Trace</H2>
            <Text
              as="pre"
              style={{
                textAlign: "left",
                padding: "var(--salt-spacing-200)",
                backgroundColor: "var(--salt-container-secondary-background)",
                borderRadius: "var(--salt-palette-corner-default)",
                overflow: "auto",
                maxHeight: 300,
                fontSize: "var(--salt-text-fontSize-small)",
                color: "var(--salt-status-error-foreground)",
              }}
            >
              {stack}
            </Text>
          </StackLayout>
        )}

        {/* Custom children */}
        {children}

        {/* Action Buttons */}
        <FlexLayout
          gap={2}
          style={{
            justifyContent: "center",
            marginTop: "var(--salt-spacing-300)",
          }}
        >
          {showRetry && onRetry && (
            <Button onClick={onRetry} appearance="bordered">
              Try Again
            </Button>
          )}
          {showHome && onHome && (
            <Button onClick={onHome} sentiment="accented">
              Go Home
            </Button>
          )}
          {action && (
            <Button onClick={action.onClick} appearance="bordered">
              {action.label}
            </Button>
          )}
        </FlexLayout>
      </StackLayout>
    </FlexLayout>
  );
};

// Legacy alias
export { LuminoErrorPage as SaltErrorPage };
