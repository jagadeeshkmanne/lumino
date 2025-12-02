/**
 * Lumino Framework - Salt Container Adapter
 *
 * Maps Lumino container interfaces to Salt DS components.
 * All components use "Lumino" prefix for consistency.
 */

import type { ComponentType } from "react";
import type { ContainerAdapter } from "../../../core/types/ui";

// Import individual components
import { LuminoTabs, LuminoTabPanel } from "./Tabs";
import { LuminoDialog } from "./Dialog";
import { LuminoCard, LuminoCardHeader, LuminoCardContent, LuminoCardFooter } from "./Card";
import { LuminoPanel } from "./Panel";
import { LuminoTable, LuminoTHead, LuminoTBody, LuminoTR, LuminoTH, LuminoTD } from "./Table";

// Import Typography components
import { LuminoH1, LuminoH2, LuminoH3, LuminoH4, LuminoText, LuminoLabel } from "./Typography";

// Import Layout components
import {
  LuminoStackLayout,
  LuminoFlowLayout,
  LuminoDivider,
  LuminoGridLayout,
  LuminoGridItem,
  LuminoSplitLayout,
  LuminoBorderLayout,
  LuminoBorderItem,
} from "./Layout";

// Import Salt's Table components for container mapping
import { Table, THead, TBody, TR, TH, TD } from "@salt-ds/lab";

// Re-export Salt's Table components directly
export { Table, THead, TBody, TR, TH, TD } from "@salt-ds/lab";

// Re-export Lumino Table components
export { LuminoTable, LuminoTHead, LuminoTBody, LuminoTR, LuminoTH, LuminoTD } from "./Table";
export type { LuminoTableProps, LuminoTHeadProps, LuminoTBodyProps, LuminoTRProps, LuminoTHProps, LuminoTDProps } from "./Table";

/**
 * Salt Container Adapter
 */
export const saltContainerAdapter: ContainerAdapter = {
  Tabs: LuminoTabs as any,
  TabPanel: LuminoTabPanel as any,
  Dialog: LuminoDialog as any,
  Panel: LuminoPanel as any,
  Card: LuminoCard as any,
};

/**
 * Lumino container components mapped to Salt implementations.
 */
export const saltContainerComponents: Record<string, ComponentType<any>> = {
  // Table components
  Table: LuminoTable,
  THead: LuminoTHead,
  TBody: LuminoTBody,
  TR: LuminoTR,
  TH: LuminoTH,
  TD: LuminoTD,
  // Card components
  Card: LuminoCard,
  CardHeader: LuminoCardHeader,
  CardBody: LuminoCardContent,
  CardFooter: LuminoCardFooter,
  // Layout components
  Grid: LuminoGridLayout,
  GridLayout: LuminoGridLayout,
  GridItem: LuminoGridItem,
  Stack: LuminoStackLayout,
  StackLayout: LuminoStackLayout,
  Flex: LuminoFlowLayout,
  FlowLayout: LuminoFlowLayout,
  SplitLayout: LuminoSplitLayout,
  BorderLayout: LuminoBorderLayout,
  BorderItem: LuminoBorderItem,
  Box: "div" as unknown as ComponentType<any>,
  Divider: LuminoDivider,
  // List components
  List: "ul" as unknown as ComponentType<any>,
  ListItem: "li" as unknown as ComponentType<any>,
  // Typography components
  H1: LuminoH1,
  H2: LuminoH2,
  H3: LuminoH3,
  H4: LuminoH4,
  Text: LuminoText,
  Label: LuminoLabel,
};

// Re-export individual components
export { LuminoTabs, LuminoTabPanel } from "./Tabs";
export { LuminoDialog } from "./Dialog";
export { LuminoCard, LuminoCardHeader, LuminoCardContent, LuminoCardFooter } from "./Card";
export { LuminoPanel } from "./Panel";

// Re-export Typography components
export { LuminoH1, LuminoH2, LuminoH3, LuminoH4, LuminoText, LuminoLabel } from "./Typography";
export type { LuminoHeadingProps, LuminoTextProps, LuminoLabelProps } from "./Typography";

// Re-export Layout components
export {
  LuminoStackLayout,
  LuminoFlowLayout,
  LuminoDivider,
  LuminoGridLayout,
  LuminoGridItem,
  LuminoSplitLayout,
  LuminoBorderLayout,
  LuminoBorderItem,
} from "./Layout";
export type {
  LuminoStackLayoutProps,
  LuminoFlowLayoutProps,
  LuminoDividerProps,
  LuminoGridLayoutProps,
  LuminoGridItemProps,
  LuminoSplitLayoutProps,
  LuminoBorderLayoutProps,
  LuminoBorderItemProps,
} from "./Layout";

// Legacy aliases for backward compatibility
export { LuminoTabs as SaltTabs, LuminoTabPanel as SaltTabPanel } from "./Tabs";
export { LuminoDialog as SaltDialog } from "./Dialog";
export { LuminoCard as SaltCard, LuminoCardHeader as SaltCardHeader, LuminoCardContent as SaltCardContent, LuminoCardFooter as SaltCardFooter } from "./Card";
export { LuminoPanel as SaltPanel } from "./Panel";
