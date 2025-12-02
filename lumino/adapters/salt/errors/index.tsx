/**
 * Lumino Framework - Salt Error Pages Adapter
 *
 * Maps Lumino error page interfaces to Salt DS components.
 */

import React from "react";
import type { IErrorPagesAdapter, ErrorPageProps } from "../../../core/types/ui";

// Import components
import { LuminoErrorPage } from "./ErrorPage";
import { LuminoErrorBoundary } from "./ErrorBoundary";

/**
 * Pre-configured error pages for common HTTP status codes
 */
export const LuminoNotFoundPage: React.FC<Omit<ErrorPageProps, "statusCode">> = (props) => (
  <LuminoErrorPage statusCode={404} {...props} />
);

export const LuminoUnauthorizedPage: React.FC<Omit<ErrorPageProps, "statusCode">> = (props) => (
  <LuminoErrorPage statusCode={401} {...props} />
);

export const LuminoForbiddenPage: React.FC<Omit<ErrorPageProps, "statusCode">> = (props) => (
  <LuminoErrorPage statusCode={403} {...props} />
);

export const LuminoServerErrorPage: React.FC<Omit<ErrorPageProps, "statusCode">> = (props) => (
  <LuminoErrorPage statusCode={500} {...props} />
);

/**
 * Salt Error Pages Adapter
 */
export const saltErrorPagesAdapter: IErrorPagesAdapter = {
  ErrorPage: LuminoErrorPage as any,
  NotFoundPage: LuminoNotFoundPage as any,
  UnauthorizedPage: LuminoUnauthorizedPage as any,
  ForbiddenPage: LuminoForbiddenPage as any,
  ServerErrorPage: LuminoServerErrorPage as any,
  ErrorBoundary: LuminoErrorBoundary as any,
};

// Re-export components
export { LuminoErrorPage } from "./ErrorPage";
export { LuminoErrorBoundary } from "./ErrorBoundary";

// Legacy aliases
export { LuminoErrorPage as SaltErrorPage } from "./ErrorPage";
export { LuminoErrorBoundary as SaltErrorBoundary } from "./ErrorBoundary";
export { LuminoNotFoundPage as SaltNotFoundPage };
export { LuminoUnauthorizedPage as SaltUnauthorizedPage };
export { LuminoForbiddenPage as SaltForbiddenPage };
export { LuminoServerErrorPage as SaltServerErrorPage };
