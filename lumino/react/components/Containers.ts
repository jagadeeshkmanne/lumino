/**
 * Lumino Framework - Abstract Container Components
 *
 * These are marker/abstract components that users import from Lumino.
 * At render time, they get resolved to actual adapter components (e.g., Salt).
 *
 * This provides:
 * 1. UI library independence - users don't import from Salt directly
 * 2. Consistent API across different adapters
 * 3. Full customization - users can build any structure
 *
 * @example
 * ```typescript
 * import { Table, THead, TBody, TR, TH, TD } from "lumino/react";
 *
 * class MyTable extends Component<Item> {
 *   configure() {
 *     this.container(Table)
 *       .add(THead)
 *         .add(TR)
 *           .add(TH).text("Name").end()
 *         .end()
 *       .end()
 *       .add(TBody)
 *         .each()
 *           .add(TR)
 *             .add(TD).field("name").display().end()
 *           .end()
 *         .endEach()
 *       .end()
 *     .end();
 *   }
 * }
 * ```
 */

// =============================================================================
// TABLE COMPONENTS
// =============================================================================

/** Abstract Table container - resolved to adapter's Table component */
export function LumTable() { return null; }
LumTable.displayName = "LumTable";
LumTable.__lumino_type__ = "container";
LumTable.__lumino_component__ = "Table";

/** Abstract THead - resolved to adapter's THead component */
export function LumTHead() { return null; }
LumTHead.displayName = "LumTHead";
LumTHead.__lumino_type__ = "container";
LumTHead.__lumino_component__ = "THead";

/** Abstract TBody - resolved to adapter's TBody component */
export function LumTBody() { return null; }
LumTBody.displayName = "LumTBody";
LumTBody.__lumino_type__ = "container";
LumTBody.__lumino_component__ = "TBody";

/** Abstract TFoot - resolved to adapter's TFoot component */
export function LumTFoot() { return null; }
LumTFoot.displayName = "LumTFoot";
LumTFoot.__lumino_type__ = "container";
LumTFoot.__lumino_component__ = "TFoot";

/** Abstract TR (table row) - resolved to adapter's TR component */
export function LumTR() { return null; }
LumTR.displayName = "LumTR";
LumTR.__lumino_type__ = "container";
LumTR.__lumino_component__ = "TR";

/** Abstract TH (table header cell) - resolved to adapter's TH component */
export function LumTH() { return null; }
LumTH.displayName = "LumTH";
LumTH.__lumino_type__ = "container";
LumTH.__lumino_component__ = "TH";

/** Abstract TD (table data cell) - resolved to adapter's TD component */
export function LumTD() { return null; }
LumTD.displayName = "LumTD";
LumTD.__lumino_type__ = "container";
LumTD.__lumino_component__ = "TD";

// =============================================================================
// CARD COMPONENTS
// =============================================================================

/** Abstract Card container */
export function LumCard() { return null; }
LumCard.displayName = "LumCard";
LumCard.__lumino_type__ = "container";
LumCard.__lumino_component__ = "Card";

/** Abstract CardHeader */
export function LumCardHeader() { return null; }
LumCardHeader.displayName = "LumCardHeader";
LumCardHeader.__lumino_type__ = "container";
LumCardHeader.__lumino_component__ = "CardHeader";

/** Abstract CardBody */
export function LumCardBody() { return null; }
LumCardBody.displayName = "LumCardBody";
LumCardBody.__lumino_type__ = "container";
LumCardBody.__lumino_component__ = "CardBody";

/** Abstract CardFooter */
export function LumCardFooter() { return null; }
LumCardFooter.displayName = "LumCardFooter";
LumCardFooter.__lumino_type__ = "container";
LumCardFooter.__lumino_component__ = "CardFooter";

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

/** Abstract Grid container */
export function LumGrid() { return null; }
LumGrid.displayName = "LumGrid";
LumGrid.__lumino_type__ = "container";
LumGrid.__lumino_component__ = "Grid";

/** Abstract Stack (vertical) container */
export function LumStack() { return null; }
LumStack.displayName = "LumStack";
LumStack.__lumino_type__ = "container";
LumStack.__lumino_component__ = "Stack";

/** Abstract Flex container */
export function LumFlex() { return null; }
LumFlex.displayName = "LumFlex";
LumFlex.__lumino_type__ = "container";
LumFlex.__lumino_component__ = "Flex";

/** Abstract Box container */
export function LumBox() { return null; }
LumBox.displayName = "LumBox";
LumBox.__lumino_type__ = "container";
LumBox.__lumino_component__ = "Box";

// =============================================================================
// LIST COMPONENTS
// =============================================================================

/** Abstract List container */
export function LumList() { return null; }
LumList.displayName = "LumList";
LumList.__lumino_type__ = "container";
LumList.__lumino_component__ = "List";

/** Abstract ListItem */
export function LumListItem() { return null; }
LumListItem.displayName = "LumListItem";
LumListItem.__lumino_type__ = "container";
LumListItem.__lumino_component__ = "ListItem";

// =============================================================================
// ACCORDION COMPONENTS
// =============================================================================

/** Abstract Accordion container */
export function LumAccordion() { return null; }
LumAccordion.displayName = "LumAccordion";
LumAccordion.__lumino_type__ = "container";
LumAccordion.__lumino_component__ = "Accordion";

/** Abstract AccordionItem */
export function LumAccordionItem() { return null; }
LumAccordionItem.displayName = "LumAccordionItem";
LumAccordionItem.__lumino_type__ = "container";
LumAccordionItem.__lumino_component__ = "AccordionItem";

/** Abstract AccordionHeader */
export function LumAccordionHeader() { return null; }
LumAccordionHeader.displayName = "LumAccordionHeader";
LumAccordionHeader.__lumino_type__ = "container";
LumAccordionHeader.__lumino_component__ = "AccordionHeader";

/** Abstract AccordionPanel */
export function LumAccordionPanel() { return null; }
LumAccordionPanel.displayName = "LumAccordionPanel";
LumAccordionPanel.__lumino_type__ = "container";
LumAccordionPanel.__lumino_component__ = "AccordionPanel";

// =============================================================================
// TYPOGRAPHY COMPONENTS
// =============================================================================

/** Abstract H1 heading */
export function LumH1() { return null; }
LumH1.displayName = "LumH1";
LumH1.__lumino_type__ = "container";
LumH1.__lumino_component__ = "H1";

/** Abstract H2 heading */
export function LumH2() { return null; }
LumH2.displayName = "LumH2";
LumH2.__lumino_type__ = "container";
LumH2.__lumino_component__ = "H2";

/** Abstract H3 heading */
export function LumH3() { return null; }
LumH3.displayName = "LumH3";
LumH3.__lumino_type__ = "container";
LumH3.__lumino_component__ = "H3";

/** Abstract H4 heading */
export function LumH4() { return null; }
LumH4.displayName = "LumH4";
LumH4.__lumino_type__ = "container";
LumH4.__lumino_component__ = "H4";

/** Abstract Text component */
export function LumText() { return null; }
LumText.displayName = "LumText";
LumText.__lumino_type__ = "container";
LumText.__lumino_component__ = "Text";

/** Abstract Label component */
export function LumLabel() { return null; }
LumLabel.displayName = "LumLabel";
LumLabel.__lumino_type__ = "container";
LumLabel.__lumino_component__ = "Label";

// =============================================================================
// FLOW/LAYOUT COMPONENTS
// =============================================================================

/** Abstract FlowLayout (horizontal wrap) */
export function LumFlowLayout() { return null; }
LumFlowLayout.displayName = "LumFlowLayout";
LumFlowLayout.__lumino_type__ = "container";
LumFlowLayout.__lumino_component__ = "FlowLayout";

/** Abstract StackLayout (vertical) */
export function LumStackLayout() { return null; }
LumStackLayout.displayName = "LumStackLayout";
LumStackLayout.__lumino_type__ = "container";
LumStackLayout.__lumino_component__ = "StackLayout";

/** Abstract Divider */
export function LumDivider() { return null; }
LumDivider.displayName = "LumDivider";
LumDivider.__lumino_type__ = "container";
LumDivider.__lumino_component__ = "Divider";

// =============================================================================
// HELPER TO CHECK IF COMPONENT IS LUMINO ABSTRACT
// =============================================================================

/**
 * Check if a component is a Lumino abstract container
 */
export function isLuminoContainer(component: any): boolean {
  return component?.__lumino_type__ === "container";
}

/**
 * Get the Lumino component name for resolution
 */
export function getLuminoComponentName(component: any): string | null {
  return component?.__lumino_component__ || null;
}
