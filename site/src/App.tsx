/**
 * Lumino Documentation Site - Main App
 *
 * Uses custom Storybook-style layout with Lumino's router.
 */

import { useEffect } from "react";
import { LuminoRouter, useRouter } from "lumino/react";
import { Sidebar } from "./layout/Sidebar";
import { DemoPanel } from "./layout/DemoPanel";
import { IntroductionPage } from "./pages/IntroductionPage";
import { InstallationPage } from "./pages/InstallationPage";
import { QuickStartPage } from "./pages/QuickStartPage";
import { LiveDemoPage } from "./pages/LiveDemoPage";

// Form Builder Pages
import {
  FormOverviewPage,
  FormClassPage,
  FormEntityPage,
  FormSectionsPage,
  FormRowsPage,
  FormFieldTypesPage,
  FormFieldConfigPage,
  FormVisibilityPage,
  FormDependenciesPage,
  FormComputedPage,
  FormNestedPage,
  FormValidatorsPage,
  FormCustomValidationPage,
  FormAdvancedValidationPage,
  FormListsPage,
  FormLifecyclePage,
  FormContextPage,
  FormRendererPage,
  FormReusablePage,
} from "./pages/form";

// Core Concepts Pages
import {
  ConceptsOverviewPage,
  LuminoProviderPage,
  LuminoNamespacePage,
  UIAdaptersPage,
} from "./pages/concepts";

// Field Components Pages
import {
  FieldsOverviewPage,
  TextInputPage,
  NumberInputPage,
  TextAreaPage,
  SelectPage,
  MultiSelectPage,
  AutocompletePage,
  CheckboxPage,
  CheckboxGroupPage,
  SwitchPage,
  RadioGroupPage,
  DatePickerPage,
  TimePickerPage,
  LookupFieldPage,
  CustomFieldPage,
} from "./pages/fields";

// Routing Pages
import {
  RoutingOverviewPage,
  LuminoRouterPage,
  LinkNavigatePage,
  RouterHooksPage,
  RouteGuardsPage,
} from "./pages/routing";

// API & Data Pages
import {
  ApiOverviewPage,
  ApiBuilderPage,
  CrudApiPage,
  LookupApiPage,
  MapperPage,
  ApiRegistryPage,
  CacheManagerPage,
} from "./pages/api";

// State Management Pages
import {
  StateOverviewPage,
  StateManagerPage,
  EntityStorePage,
  CollectionStorePage,
  StateHooksPage,
} from "./pages/state";

// Events Pages
import {
  EventsOverviewPage,
  EventEmitterPage,
  FormEventsPage,
  PageEventsPage,
  ApiEventsPage,
  AppEventsPage,
  CustomEventsPage,
} from "./pages/events";

// React Hooks Pages
import {
  HooksOverviewPage,
  UseLuminoPage,
  UseFormPage,
  UseFormDataPage,
  UsePagePage,
  UseApiPage,
  UseDialogPage,
  UseNavigationPage,
  UseEventsPage,
} from "./pages/hooks";

// Adapters Pages
import {
  AdaptersOverviewPage,
  SaltOverviewPage,
  SaltSetupPage,
  SaltComponentsPage,
  AdapterInterfacesPage,
  CreateAdapterPage,
} from "./pages/adapters";

// API Reference Pages
import {
  LuminoRefPage,
  AppRefPage,
  PageRefPage,
  FormRefPage,
  ValidatorsRefPage,
  TypesRefPage,
} from "./pages/api-reference";

// Container Components Pages
import {
  ContainersOverviewPage,
  CardPage,
  TablePage,
  TabsPage,
  DialogPage,
  AccordionPage,
  GridPage,
} from "./pages/containers";

// Action Components Pages
import {
  ActionsOverviewPage,
  ButtonPage,
  IconButtonPage,
  LinkPage,
} from "./pages/actions";

// Feedback Components Pages
import {
  FeedbackOverviewPage,
  ToastPage,
  BadgePage,
  ProgressPage,
} from "./pages/feedback";

// Navigation Components Pages
import {
  NavigationOverviewPage,
  NavbarPage,
  SidebarPage,
  MenuPage,
  BreadcrumbsPage,
  PaginationPage,
  StepperPage,
} from "./pages/navigation";

// Typography Components Pages
import {
  TypographyOverviewPage,
  HeadingPage,
  TextPage,
  IconPage,
  AvatarPage,
} from "./pages/typography";

// Loading Components Pages
import {
  LoadingOverviewPage,
  SpinnerPage,
  SkeletonPage,
} from "./pages/loading";

// Error Handling Components Pages
import {
  ErrorsOverviewPage,
  ErrorBoundaryPage,
  AlertPage,
} from "./pages/errors";

// Layout Components Pages
import {
  LayoutOverviewPage,
  ContainerPage as LayoutContainerPage,
  StackPage,
  FlexPage,
} from "./pages/layout";

// App Builder Pages
import {
  AppBuilderOverviewPage,
  AppConfigurationPage,
} from "./pages/app-builder";

// Page Builder Pages
import { PageBuilderOverviewPage } from "./pages/page-builder";

/**
 * App component with custom Storybook-style layout
 */
export function App() {
  const router = useRouter();
  const currentRoute = router.currentRoute || "/";

  // Scroll to top on route change
  useEffect(() => {
    const contentEl = document.querySelector(".docs-content");
    if (contentEl) {
      contentEl.scrollTop = 0;
    }
    window.scrollTo(0, 0);
  }, [currentRoute]);

  // Check if current path is a demo page
  const isDemo = currentRoute.startsWith("/demos/form-builder");

  // Page content based on route
  const renderPage = () => {
    // Demo pages - render via LuminoRouter wrapped in DemoPanel
    if (isDemo) {
      return (
        <DemoPanel
          title="Form Builder Demo"
          description="Interactive form builder with live preview"
        >
          <LuminoRouter />
        </DemoPanel>
      );
    }

    // Docs pages
    switch (currentRoute) {
      case "/":
        return <IntroductionPage />;
      case "/docs/installation":
        return <InstallationPage />;
      case "/docs/quick-start":
        return <QuickStartPage />;
      case "/demos/live":
        return <LiveDemoPage />;

      // Core Concepts Pages
      case "/docs/concepts/overview":
        return <ConceptsOverviewPage />;
      case "/docs/concepts/provider":
      case "/docs/concepts/providers":
        return <LuminoProviderPage />;
      case "/docs/concepts/lumino":
        return <LuminoNamespacePage />;
      case "/docs/concepts/adapters":
        return <UIAdaptersPage />;

      // Field Components Pages
      case "/docs/fields/overview":
        return <FieldsOverviewPage />;
      case "/docs/fields/text":
        return <TextInputPage />;
      case "/docs/fields/number":
        return <NumberInputPage />;
      case "/docs/fields/textarea":
        return <TextAreaPage />;
      case "/docs/fields/select":
        return <SelectPage />;
      case "/docs/fields/multiselect":
        return <MultiSelectPage />;
      case "/docs/fields/autocomplete":
        return <AutocompletePage />;
      case "/docs/fields/checkbox":
        return <CheckboxPage />;
      case "/docs/fields/checkboxgroup":
        return <CheckboxGroupPage />;
      case "/docs/fields/switch":
        return <SwitchPage />;
      case "/docs/fields/radiogroup":
        return <RadioGroupPage />;
      case "/docs/fields/date":
        return <DatePickerPage />;
      case "/docs/fields/time":
        return <TimePickerPage />;
      case "/docs/fields/lookup":
        return <LookupFieldPage />;
      case "/docs/fields/custom":
        return <CustomFieldPage />;

      // Container Components Pages
      case "/docs/containers/overview":
        return <ContainersOverviewPage />;
      case "/docs/containers/card":
        return <CardPage />;
      case "/docs/containers/table":
        return <TablePage />;
      case "/docs/containers/tabs":
        return <TabsPage />;
      case "/docs/containers/dialog":
      case "/docs/containers/modal":
        return <DialogPage />;
      case "/docs/containers/accordion":
        return <AccordionPage />;
      case "/docs/containers/grid":
        return <GridPage />;

      // Action Components Pages
      case "/docs/actions/overview":
        return <ActionsOverviewPage />;
      case "/docs/actions/button":
        return <ButtonPage />;
      case "/docs/actions/icon-button":
      case "/docs/actions/iconbutton":
        return <IconButtonPage />;
      case "/docs/actions/link":
        return <LinkPage />;

      // Feedback Components Pages
      case "/docs/feedback/overview":
        return <FeedbackOverviewPage />;
      case "/docs/feedback/toast":
        return <ToastPage />;
      case "/docs/feedback/badge":
        return <BadgePage />;
      case "/docs/feedback/progress":
      case "/docs/feedback/spinner":
        return <ProgressPage />;

      // Navigation Components Pages
      case "/docs/navigation/overview":
        return <NavigationOverviewPage />;
      case "/docs/navigation/navbar":
        return <NavbarPage />;
      case "/docs/navigation/sidebar":
        return <SidebarPage />;
      case "/docs/navigation/menu":
        return <MenuPage />;
      case "/docs/navigation/breadcrumbs":
        return <BreadcrumbsPage />;
      case "/docs/navigation/pagination":
        return <PaginationPage />;
      case "/docs/navigation/stepper":
        return <StepperPage />;

      // Typography Components Pages
      case "/docs/typography/overview":
        return <TypographyOverviewPage />;
      case "/docs/typography/heading":
        return <HeadingPage />;
      case "/docs/typography/text":
        return <TextPage />;
      case "/docs/typography/icon":
        return <IconPage />;
      case "/docs/typography/avatar":
        return <AvatarPage />;

      // Loading Components Pages
      case "/docs/loading/overview":
        return <LoadingOverviewPage />;
      case "/docs/loading/spinner":
        return <SpinnerPage />;
      case "/docs/loading/skeleton":
        return <SkeletonPage />;

      // Error Handling Components Pages
      case "/docs/errors/overview":
        return <ErrorsOverviewPage />;
      case "/docs/errors/error-boundary":
        return <ErrorBoundaryPage />;
      case "/docs/errors/alert":
        return <AlertPage />;

      // Layout Components Pages
      case "/docs/layout/overview":
        return <LayoutOverviewPage />;
      case "/docs/layout/container":
        return <LayoutContainerPage />;
      case "/docs/layout/stack":
        return <StackPage />;
      case "/docs/layout/flex":
        return <FlexPage />;

      // App Builder Pages
      case "/docs/app-builder/overview":
        return <AppBuilderOverviewPage />;
      case "/docs/app-builder/configuration":
        return <AppConfigurationPage />;

      // Page Builder Pages
      case "/docs/page-builder/overview":
        return <PageBuilderOverviewPage />;

      // Routing Pages
      case "/docs/routing/overview":
        return <RoutingOverviewPage />;
      case "/docs/routing/router":
        return <LuminoRouterPage />;
      case "/docs/routing/link":
      case "/docs/routing/navigate":
        return <LinkNavigatePage />;
      case "/docs/routing/hooks":
        return <RouterHooksPage />;
      case "/docs/routing/guards":
        return <RouteGuardsPage />;

      // API & Data Pages
      case "/docs/api/overview":
        return <ApiOverviewPage />;
      case "/docs/api/builder":
        return <ApiBuilderPage />;
      case "/docs/api/crud":
        return <CrudApiPage />;
      case "/docs/api/lookup":
        return <LookupApiPage />;
      case "/docs/api/mapper":
        return <MapperPage />;
      case "/docs/api/registry":
        return <ApiRegistryPage />;
      case "/docs/api/cache":
        return <CacheManagerPage />;

      // State Management Pages
      case "/docs/state/overview":
        return <StateOverviewPage />;
      case "/docs/state/manager":
        return <StateManagerPage />;
      case "/docs/state/entity":
        return <EntityStorePage />;
      case "/docs/state/collection":
        return <CollectionStorePage />;
      case "/docs/state/hooks":
        return <StateHooksPage />;

      // Events Pages
      case "/docs/events/overview":
        return <EventsOverviewPage />;
      case "/docs/events/emitter":
        return <EventEmitterPage />;
      case "/docs/events/form":
        return <FormEventsPage />;
      case "/docs/events/page":
        return <PageEventsPage />;
      case "/docs/events/api":
        return <ApiEventsPage />;
      case "/docs/events/app":
        return <AppEventsPage />;
      case "/docs/events/custom":
        return <CustomEventsPage />;

      // React Hooks Pages
      case "/docs/hooks/overview":
        return <HooksOverviewPage />;
      case "/docs/hooks/useLumino":
        return <UseLuminoPage />;
      case "/docs/hooks/useForm":
        return <UseFormPage />;
      case "/docs/hooks/useFormData":
        return <UseFormDataPage />;
      case "/docs/hooks/usePage":
        return <UsePagePage />;
      case "/docs/hooks/useApi":
        return <UseApiPage />;
      case "/docs/hooks/useDialog":
        return <UseDialogPage />;
      case "/docs/hooks/useNavigation":
        return <UseNavigationPage />;
      case "/docs/hooks/useEvents":
        return <UseEventsPage />;

      // Adapters Pages
      case "/docs/adapters/overview":
        return <AdaptersOverviewPage />;
      case "/docs/adapters/salt":
        return <SaltOverviewPage />;
      case "/docs/adapters/salt-setup":
        return <SaltSetupPage />;
      case "/docs/adapters/salt-components":
        return <SaltComponentsPage />;
      case "/docs/adapters/interfaces":
        return <AdapterInterfacesPage />;
      case "/docs/adapters/create":
        return <CreateAdapterPage />;

      // API Reference Pages
      case "/docs/api-reference/lumino":
        return <LuminoRefPage />;
      case "/docs/api-reference/app":
        return <AppRefPage />;
      case "/docs/api-reference/page":
        return <PageRefPage />;
      case "/docs/api-reference/form":
        return <FormRefPage />;
      case "/docs/api-reference/validators":
        return <ValidatorsRefPage />;
      case "/docs/api-reference/types":
        return <TypesRefPage />;

      // Form Builder Pages - Basics
      case "/docs/form/overview":
        return <FormOverviewPage />;
      case "/docs/form/class":
        return <FormClassPage />;
      case "/docs/form/entity":
        return <FormEntityPage />;
      case "/docs/form/sections":
        return <FormSectionsPage />;
      case "/docs/form/rows":
        return <FormRowsPage />;

      // Form Builder Pages - Fields
      case "/docs/form/field-types":
        return <FormFieldTypesPage />;
      case "/docs/form/field-config":
        return <FormFieldConfigPage />;
      case "/docs/form/visibility":
        return <FormVisibilityPage />;
      case "/docs/form/dependencies":
        return <FormDependenciesPage />;
      case "/docs/form/computed":
        return <FormComputedPage />;

      // Form Builder Pages - Objects
      case "/docs/form/nested":
      case "/docs/form/object-binding":
        return <FormNestedPage />;

      // Form Builder Pages - Validation
      case "/docs/form/validation":
      case "/docs/form/validators":
        return <FormValidatorsPage />;
      case "/docs/form/custom-validation":
        return <FormCustomValidationPage />;
      case "/docs/form/advanced-validation":
        return <FormAdvancedValidationPage />;

      // Form Builder Pages - Lists
      case "/docs/form/arrays":
      case "/docs/form/list-operations":
      case "/docs/form/list-display":
        return <FormListsPage />;

      // Form Builder Pages - Advanced
      case "/docs/form/lifecycle":
        return <FormLifecyclePage />;
      case "/docs/form/context":
        return <FormContextPage />;
      case "/docs/form/renderer":
        return <FormRendererPage />;
      case "/docs/form/reusable":
        return <FormReusablePage />;

      default:
        return (
          <div>
            <h1 className="docs-page-title">Coming Soon</h1>
            <p className="docs-page-subtitle">
              This page is under construction: {currentRoute}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="docs-layout">
      {/* Header */}
      <header className="docs-header">
        <div className="docs-header-left">
          <div className="docs-logo">
            <div className="docs-logo-icon">L</div>
            <span>Lumino</span>
          </div>
          <div className="docs-version">v1.0.0</div>
        </div>
        <div className="docs-header-right">
          <span className="docs-header-author">by Jagadeesh Manne</span>
        </div>
      </header>

      {/* Main - sidebar + content */}
      <div className="docs-main">
        <Sidebar
          currentPath={currentRoute}
          onNavigate={(path) => router.navigate(path)}
        />
        <main className="docs-content">
          <div className={isDemo ? "demo-content-inner" : "docs-content-inner"}>
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
