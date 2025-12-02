/**
 * Lumino Framework - Salt Pagination Adapter
 *
 * Uses createLuminoComponent to map Lumino PaginationProps to Salt Pagination.
 */

import React from "react";
import {
  Pagination,
  Paginator,
  GoToInput,
  CompactPaginator,
} from "@salt-ds/core";
import { createLuminoComponent } from "../../../core/adapters";
import { luminoClass } from "../utils";
import type { PaginationProps } from "../../../core/types/ui";

/**
 * LuminoPagination - Salt Pagination with Lumino interface
 *
 * Lumino Props → Salt Props:
 * - total → count (total pages, not items)
 * - currentPage → page
 * - onPageChange → onPageChange
 * - compact → uses CompactPaginator vs Paginator
 *
 * Note: Salt Pagination works with page count, not item count.
 * The adapter calculates pages from total items and pageSize.
 *
 * @example
 * ```tsx
 * <LuminoPagination
 *   total={100}
 *   pageSize={10}
 *   currentPage={1}
 *   onPageChange={(page) => setPage(page)}
 * />
 * ```
 */
export const LuminoPagination = createLuminoComponent(Pagination, {
  props: {
    className: {
      to: "className",
      transform: (className) => luminoClass("navigation", "pagination", className),
    },
  },
  exclude: ["total", "pageSize", "currentPage", "onPageChange", "showSizeChanger", "pageSizeOptions", "onPageSizeChange", "compact"],
  render: (transformedProps, _Pagination, originalProps) => {
    const {
      total,
      pageSize = 10,
      currentPage = 1,
      onPageChange,
      compact = false,
    } = originalProps as PaginationProps;

    // Calculate total pages
    const totalPages = Math.ceil(total / pageSize);

    const handlePageChange = (_event: React.SyntheticEvent, page: number) => {
      onPageChange?.(page);
    };

    return (
      <Pagination
        {...transformedProps}
        count={totalPages}
        page={currentPage}
        onPageChange={handlePageChange}
      >
        {compact ? (
          <CompactPaginator />
        ) : (
          <>
            <GoToInput />
            <Paginator />
          </>
        )}
      </Pagination>
    );
  },
});

// Legacy alias for backward compatibility
export { LuminoPagination as SaltPagination };
