/**
 * Lumino Framework - React Module Exports
 *
 * React adapter for Lumino framework.
 * Provides context, router, and renderers.
 *
 * DEVELOPER API:
 * - Define Form/Page classes (OOP style)
 * - Register with app
 * - Use <LuminoRouter> and <PageByIdRenderer>
 *
 * Most hooks are internal - use useLumino() for app-level access.
 */

// Context
export {
  LuminoProvider,
  useLuminoContext,
  useApp,
  useAppContext,
} from "./context";

export type {
  LuminoContextValue,
  LuminoProviderProps,
  NavigationAdapter,
  UIAdapter,
} from "./context";

// Providers
export {
  DialogProvider,
  useDialogContext,
  useOpenDialog,
} from "./providers";

export type {
  DialogState,
  DialogContextValue,
} from "./providers";

// =============================================================================
// PUBLIC HOOKS (Developer-facing)
// =============================================================================

export {
  // Main hook for app-level access
  useLumino,
  useNavigation,
  useNotify,
  useI18n,
  useEvents,
  // State hooks
  useLoading,
  useLocale,
  useTheme,
  useUser,
  useMeta,
} from "./hooks";

export type { UseLuminoReturn } from "./hooks";

// =============================================================================
// INTERNAL HOOKS (Used by renderers, rarely needed by developers)
// =============================================================================

export {
  // Form (internal - used by FormRenderer)
  useForm,
  // Page (internal - used by PageRenderer)
  usePage,
  useNavigationGuard,
  // API (can be used for custom API calls outside of actions)
  useApi,
  useLazyApi,
  useMutation,
  useQueries,
  // Store (can be used for custom state management)
  useEntity,
  useCollection,
  useStateSelector,
  useApiLoading,
  useFormLoading,
  useFormData,
  usePageLoading,
} from "./hooks";

export type {
  UseFormOptions,
  UseFormReturn,
  UsePageOptions,
  UsePageReturn,
  UseApiOptions,
  UseApiReturn,
  UseMutationOptions,
  UseMutationReturn,
  UseQueriesResult,
  UseEntityOptions,
  UseEntityReturn,
  UseCollectionOptions,
  UseCollectionReturn,
} from "./hooks";

// Router
export {
  LuminoRouter,
  Link,
  Navigate,
  RouteGuard,
  useRouter,
  useParams,
  useQuery,
} from "./router";

export type {
  RouteMatch,
  RouterContextValue,
  LuminoRouterProps,
  LinkProps,
  RouteGuardProps,
  NavigateProps,
} from "./router";

// Renderer
export {
  // Form Renderer
  FormRenderer,
  FieldRenderer,
  RowRenderer,
  SectionRenderer,
  resolveComponent,
  // Page Renderer
  PageRenderer,
  PageByIdRenderer,
  ComponentRenderer,
  PageRowRenderer,
  PageContentRenderer,
  setPageLayout,
  setPageRowLayout,
  // Container Renderers
  TabsRenderer,
  DialogRenderer,
  useDialog,
  TableRenderer,
  useTable,
  // Stateful Component Renderer
  StatefulComponentRenderer,
  createLuminoComponent,
  PageContextProvider,
  usePageContext,
} from "./renderer";

export type {
  ComponentResolver,
  LayoutProps,
  RowLayoutProps,
  SectionLayoutProps,
  FormLayoutProps,
  FieldRendererProps,
  RowRendererProps,
  SectionRendererProps,
  FormRendererProps,
  PageLayoutProps,
  PageRowLayoutProps,
  ComponentRendererProps,
  PageRowRendererProps,
  PageContentRendererProps,
  PageRendererProps,
  PageByIdRendererProps,
  // Container Renderer Types
  TabsRendererProps,
  DialogRendererProps,
  UseDialogReturn,
  TableRendererProps,
  TableState,
  UseTableReturn,
  // Stateful Component Renderer Types
  StatefulComponentRendererProps,
} from "./renderer";

// =============================================================================
// UI COMPONENTS (UI-Agnostic)
// =============================================================================

// These components use the registered adapter automatically
// Use these in form/page configurations instead of Salt/MUI-specific imports
export {
  // Field components
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
  // Action components
  LuminoButton,
  LuminoIconButton,
  // List display mode markers
  LuminoTabs,
  LuminoRows,
  LuminoTable,
  LuminoCards,
  // Abstract container components (for Component.container() API)
  LumTable,
  LumTHead,
  LumTBody,
  LumTFoot,
  LumTR,
  LumTH,
  LumTD,
  LumCard,
  LumCardHeader,
  LumCardBody,
  LumCardFooter,
  LumGrid,
  LumStack,
  LumFlex,
  LumBox,
  LumFlowLayout,
  LumStackLayout,
  LumDivider,
  LumList,
  LumListItem,
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
  isLuminoContainer,
  getLuminoComponentName,
} from "./components";

// =============================================================================
// SALT ADAPTER COMPONENTS (Re-exported for convenience)
// =============================================================================

// Feedback components
export {
  LuminoBadge,
  LuminoAvatar,
  LuminoSpinner,
  LuminoProgress,
  LuminoLinearProgress,
  LuminoCircularProgress,
  LuminoBanner,
  LuminoAlert,
  LuminoToast,
  LuminoToastContainer,
  LuminoTooltip,
} from "../adapters/salt/feedback";

// Layout components
export {
  LuminoStackLayout,
  LuminoFlowLayout,
  LuminoDivider,
  LuminoGridLayout,
  LuminoGridItem,
  LuminoSplitLayout,
  LuminoBorderLayout,
  LuminoBorderItem,
} from "../adapters/salt/components";

// Typography components
export {
  LuminoH1,
  LuminoH2,
  LuminoH3,
  LuminoH4,
  LuminoText,
  LuminoLabel,
} from "../adapters/salt/components";

// Container components
export {
  SaltTabs,
  LuminoTabPanel,
  SaltTabPanel,
  LuminoDialog,
  LuminoCard,
  LuminoCardHeader,
  LuminoCardContent,
  LuminoCardFooter,
  LuminoPanel,
} from "../adapters/salt/components";

// Table components (Salt adapter - actual components)
// Note: LuminoTable from ./components is a display mode marker
// These are actual React components for rendering tables
export {
  LuminoTHead,
  LuminoTBody,
  LuminoTR,
  LuminoTH,
  LuminoTD,
} from "../adapters/salt/components";

// Re-export the Salt table wrapper with a distinct name to avoid conflict with display mode marker
export { LuminoTable as LuminoDataTable } from "../adapters/salt/components";

// Navigation components
export {
  LuminoMenu,
  LuminoPagination,
  LuminoStepper,
  LuminoAccordion,
} from "../adapters/salt/navigation";

// Loading components
export {
  LuminoPageLoader,
  LuminoComponentLoader,
  LuminoInlineLoader,
  LuminoGlobalLoadingOverlay,
  LuminoSkeleton,
} from "../adapters/salt/loading";

// Error components
export {
  LuminoErrorPage,
  LuminoErrorBoundary,
  LuminoNotFoundPage,
  LuminoUnauthorizedPage,
  LuminoForbiddenPage,
  LuminoServerErrorPage,
} from "../adapters/salt/errors";

// =============================================================================
// UI ADAPTERS
// =============================================================================

// Salt adapter is in lumino/adapters/salt
// Users should import: import { saltAdapter } from "lumino/adapters/salt"

export {
  // CSS Grid adapter (fallback, no dependencies)
  defaultAdapter,
  defaultLayoutAdapter,
  createAdapter,
} from "./adapters/DefaultAdapter";

// =============================================================================
// BASE ADAPTERS (for creating custom UI adapters)
// =============================================================================

export {
  // Base layout components
  BaseRow,
  BaseColumn,
  BaseSection,
  BaseForm,
  BaseFieldWrapper,
  defaultLayoutStyles,
  createLayoutAdapter,
  // Base container components
  BaseTabs,
  BaseTabPanel,
  BaseDialog,
  BasePanel,
  BaseCard,
  defaultContainerStyles,
  createContainerAdapter,
  // Base list components
  BaseListRows,
  BaseListTable,
  BaseListCards,
  defaultListStyles,
  createListAdapter,
  // Base action components
  BaseButton,
  BaseIconButton,
  BaseToolbar,
  BaseButtonGroup,
  defaultActionStyles,
  createActionAdapter,
} from "./adapters/base";

export type {
  // Style providers
  LayoutStyleProvider,
  ContainerStyleProvider,
  ListStyleProvider,
  ActionStyleProvider,
  // Base component props
  BaseRowProps,
  BaseColumnProps,
  BaseSectionProps,
  BaseFormProps,
  BaseFieldWrapperProps,
  BaseTabsProps,
  BaseTabPanelProps,
  BaseDialogProps,
  BasePanelProps,
  BaseCardProps,
  BaseListRowsProps,
  BaseListTableProps,
  BaseListCardsProps,
  BaseButtonProps,
  BaseIconButtonProps,
  BaseToolbarProps,
  BaseButtonGroupProps,
} from "./adapters/base";

// =============================================================================
// NORMALIZATION HELPERS (for creating custom field adapters)
// =============================================================================

export {
  normalizeOnChange,
  normalizeCheckboxChange,
  normalizeNumberChange,
  normalizeSelectChange,
  toValidationStatus,
} from "../core/adapters";
