/**
 * Lumino Framework - Salt Table Adapter
 *
 * Maps Lumino table components to Salt DS Table components.
 */

import React from "react";
import { Table, THead, TBody, TR, TH, TD } from "@salt-ds/lab";
import type { PropsWithChildren, HTMLAttributes, FC, TdHTMLAttributes, ThHTMLAttributes } from "react";

// =============================================================================
// TABLE COMPONENTS
// =============================================================================

export interface LuminoTableProps extends PropsWithChildren<HTMLAttributes<HTMLTableElement>> {}

export const LuminoTable: FC<LuminoTableProps> = ({ children, ...props }) => {
  return <Table {...props}>{children}</Table>;
};

export interface LuminoTHeadProps extends PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>> {}

export const LuminoTHead: FC<LuminoTHeadProps> = ({ children, ...props }) => {
  return <THead {...props}>{children}</THead>;
};

export interface LuminoTBodyProps extends PropsWithChildren<HTMLAttributes<HTMLTableSectionElement>> {}

export const LuminoTBody: FC<LuminoTBodyProps> = ({ children, ...props }) => {
  return <TBody {...props}>{children}</TBody>;
};

export interface LuminoTRProps extends PropsWithChildren<HTMLAttributes<HTMLTableRowElement>> {}

export const LuminoTR: FC<LuminoTRProps> = ({ children, ...props }) => {
  return <TR {...props}>{children}</TR>;
};

export interface LuminoTHProps extends PropsWithChildren<ThHTMLAttributes<HTMLTableCellElement>> {}

export const LuminoTH: FC<LuminoTHProps> = ({ children, ...props }) => {
  return <TH {...props}>{children}</TH>;
};

export interface LuminoTDProps extends PropsWithChildren<TdHTMLAttributes<HTMLTableCellElement>> {}

export const LuminoTD: FC<LuminoTDProps> = ({ children, ...props }) => {
  return <TD {...props}>{children}</TD>;
};
