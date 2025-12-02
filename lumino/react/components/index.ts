/**
 * Lumino Framework - UI-Agnostic Components
 *
 * Export all Lumino UI components that use the registered adapter.
 */

// Field Components
export {
  LuminoTextInput,
  LuminoNumberInput,
  LuminoTextArea,
  LuminoCheckbox,
  LuminoCheckboxGroup,
  LuminoSwitch,
  LuminoRadioGroup,
  LuminoSelect,
  LuminoMultiSelect,
  LuminoAutocomplete,
  LuminoDatePicker,
  LuminoTimePicker,
} from "./Fields";

// Action Components
export { LuminoButton, LuminoIconButton } from "./Actions";

// List Display Mode Markers
export { LuminoTabs, LuminoRows, LuminoTable, LuminoCards } from "./DisplayModes";

// Table Components (from Salt adapter)
// Use these for custom table layouts in forms
export { Table as DataTable, THead, TBody, TR, TH, TD } from "../../adapters/salt/components";

// =============================================================================
// ABSTRACT CONTAINER COMPONENTS
// =============================================================================

// Abstract container components for use with Component.container() API.
// These are marker components that get resolved to adapter-specific implementations.
export {
  // Table components
  LumTable,
  LumTHead,
  LumTBody,
  LumTFoot,
  LumTR,
  LumTH,
  LumTD,
  // Card components
  LumCard,
  LumCardHeader,
  LumCardBody,
  LumCardFooter,
  // Layout components
  LumGrid,
  LumStack,
  LumFlex,
  LumBox,
  LumFlowLayout,
  LumStackLayout,
  LumDivider,
  // List components
  LumList,
  LumListItem,
  // Accordion components
  LumAccordion,
  LumAccordionItem,
  LumAccordionHeader,
  LumAccordionPanel,
  // Typography components
  LumH1,
  LumH2,
  LumH3,
  LumH4,
  LumText,
  LumLabel,
  // Utility functions
  isLuminoContainer,
  getLuminoComponentName,
} from "./Containers";
