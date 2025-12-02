/**
 * Sidebar - Storybook-style navigation sidebar
 *
 * Custom React component for the documentation site navigation.
 * Features a search input and collapsible navigation groups with nested subsections.
 */

import React, { useState, useMemo, useEffect, useCallback } from "react";

interface NavItem {
  id: string;
  label: string;
  path?: string;
  type?: "docs" | "story";
}

interface NavSubsection {
  id: string;
  title: string;
  items: NavItem[];
}

interface NavGroup {
  id: string;
  title: string;
  items?: NavItem[];
  subsections?: NavSubsection[];
  defaultExpanded?: boolean;
}

// Navigation structure - Feature-based organization
const navigation: NavGroup[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 1: DEMOS (First!)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "demos",
    title: "Demos",
    defaultExpanded: true,
    items: [
      { id: "demo-live", label: "Live Demo", path: "/demos/live", type: "story" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 2: GETTING STARTED
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "getting-started",
    title: "Getting Started",
    defaultExpanded: true,
    items: [
      { id: "introduction", label: "Introduction", path: "/", type: "docs" },
      { id: "installation", label: "Installation", path: "/docs/installation", type: "docs" },
      { id: "quick-start", label: "Quick Start", path: "/docs/quick-start", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 3: CORE CONCEPTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "core-concepts",
    title: "Core Concepts",
    defaultExpanded: false,
    items: [
      { id: "concepts-overview", label: "Overview", path: "/docs/concepts/overview", type: "docs" },
      { id: "concepts-lumino", label: "Lumino Namespace", path: "/docs/concepts/lumino", type: "docs" },
      { id: "concepts-providers", label: "LuminoProvider", path: "/docs/concepts/providers", type: "docs" },
      { id: "concepts-adapters", label: "UI Adapters", path: "/docs/concepts/adapters", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 4: LUMINO COMPONENTS (All UI components)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "lumino",
    title: "Lumino",
    defaultExpanded: true,
    subsections: [
      // Fields subsection
      {
        id: "fields",
        title: "Fields",
        items: [
          { id: "field-overview", label: "Overview", path: "/docs/fields/overview", type: "docs" },
          { id: "field-text", label: "TextInput", path: "/docs/fields/text", type: "story" },
          { id: "field-number", label: "NumberInput", path: "/docs/fields/number", type: "story" },
          { id: "field-textarea", label: "TextArea", path: "/docs/fields/textarea", type: "story" },
          { id: "field-select", label: "Select", path: "/docs/fields/select", type: "story" },
          { id: "field-multiselect", label: "MultiSelect", path: "/docs/fields/multiselect", type: "story" },
          { id: "field-autocomplete", label: "Autocomplete", path: "/docs/fields/autocomplete", type: "story" },
          { id: "field-checkbox", label: "Checkbox", path: "/docs/fields/checkbox", type: "story" },
          { id: "field-checkboxgroup", label: "CheckboxGroup", path: "/docs/fields/checkboxgroup", type: "story" },
          { id: "field-switch", label: "Switch", path: "/docs/fields/switch", type: "story" },
          { id: "field-radio", label: "RadioGroup", path: "/docs/fields/radiogroup", type: "story" },
          { id: "field-date", label: "DatePicker", path: "/docs/fields/date", type: "story" },
          { id: "field-time", label: "TimePicker", path: "/docs/fields/time", type: "story" },
          { id: "field-lookup", label: "Lookup Fields", path: "/docs/fields/lookup", type: "docs" },
          { id: "field-custom", label: "Custom Fields", path: "/docs/fields/custom", type: "docs" },
        ],
      },
      // Containers subsection
      {
        id: "containers",
        title: "Containers",
        items: [
          { id: "container-overview", label: "Overview", path: "/docs/containers/overview", type: "docs" },
          { id: "container-card", label: "Card", path: "/docs/containers/card", type: "story" },
          { id: "container-table", label: "Table", path: "/docs/containers/table", type: "story" },
          { id: "container-tabs", label: "Tabs", path: "/docs/containers/tabs", type: "story" },
          { id: "container-dialog", label: "Dialog", path: "/docs/containers/dialog", type: "story" },
          { id: "container-accordion", label: "Accordion", path: "/docs/containers/accordion", type: "story" },
          { id: "container-grid", label: "Grid / Flex", path: "/docs/containers/grid", type: "story" },
        ],
      },
      // Actions subsection
      {
        id: "actions",
        title: "Actions",
        items: [
          { id: "action-overview", label: "Overview", path: "/docs/actions/overview", type: "docs" },
          { id: "action-button", label: "Button", path: "/docs/actions/button", type: "story" },
          { id: "action-iconbutton", label: "IconButton", path: "/docs/actions/iconbutton", type: "story" },
          { id: "action-link", label: "Link", path: "/docs/actions/link", type: "story" },
        ],
      },
      // Feedback subsection
      {
        id: "feedback",
        title: "Feedback",
        items: [
          { id: "feedback-overview", label: "Overview", path: "/docs/feedback/overview", type: "docs" },
          { id: "feedback-toast", label: "Toast", path: "/docs/feedback/toast", type: "story" },
          { id: "feedback-progress", label: "Progress / Spinner", path: "/docs/feedback/progress", type: "story" },
          { id: "feedback-badge", label: "Badge", path: "/docs/feedback/badge", type: "story" },
        ],
      },
      // Navigation subsection
      {
        id: "navigation",
        title: "Navigation",
        items: [
          { id: "nav-overview", label: "Overview", path: "/docs/navigation/overview", type: "docs" },
          { id: "nav-navbar", label: "Navbar", path: "/docs/navigation/navbar", type: "story" },
          { id: "nav-sidebar", label: "Sidebar", path: "/docs/navigation/sidebar", type: "story" },
          { id: "nav-menu", label: "Menu", path: "/docs/navigation/menu", type: "story" },
          { id: "nav-breadcrumbs", label: "Breadcrumbs", path: "/docs/navigation/breadcrumbs", type: "story" },
          { id: "nav-pagination", label: "Pagination", path: "/docs/navigation/pagination", type: "story" },
          { id: "nav-stepper", label: "Stepper", path: "/docs/navigation/stepper", type: "story" },
        ],
      },
      // Typography subsection
      {
        id: "typography",
        title: "Typography",
        items: [
          { id: "typo-overview", label: "Overview", path: "/docs/typography/overview", type: "docs" },
          { id: "typo-heading", label: "Headings", path: "/docs/typography/heading", type: "story" },
          { id: "typo-text", label: "Text", path: "/docs/typography/text", type: "story" },
          { id: "typo-icon", label: "Icon", path: "/docs/typography/icon", type: "story" },
          { id: "typo-avatar", label: "Avatar", path: "/docs/typography/avatar", type: "story" },
        ],
      },
      // Loading subsection
      {
        id: "loading",
        title: "Loading",
        items: [
          { id: "loading-overview", label: "Overview", path: "/docs/loading/overview", type: "docs" },
          { id: "loading-spinner", label: "Spinner", path: "/docs/loading/spinner", type: "story" },
          { id: "loading-skeleton", label: "Skeleton", path: "/docs/loading/skeleton", type: "story" },
        ],
      },
      // Error Pages subsection
      {
        id: "error-pages",
        title: "Errors",
        items: [
          { id: "error-overview", label: "Overview", path: "/docs/errors/overview", type: "docs" },
          { id: "error-boundary", label: "ErrorBoundary", path: "/docs/errors/error-boundary", type: "story" },
          { id: "error-alert", label: "Alert", path: "/docs/errors/alert", type: "story" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 5: LAYOUT SYSTEM
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "layout",
    title: "Layout",
    defaultExpanded: false,
    items: [
      { id: "layout-overview", label: "Overview", path: "/docs/layout/overview", type: "docs" },
      { id: "layout-container", label: "Container", path: "/docs/layout/container", type: "story" },
      { id: "layout-stack", label: "Stack", path: "/docs/layout/stack", type: "story" },
      { id: "layout-flex", label: "Flex", path: "/docs/layout/flex", type: "story" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 6: APP BUILDER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "app-builder",
    title: "App Builder",
    defaultExpanded: false,
    items: [
      { id: "app-overview", label: "Overview", path: "/docs/app-builder/overview", type: "docs" },
      { id: "app-config", label: "Configuration", path: "/docs/app-builder/configuration", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 7: PAGE BUILDER
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "page-builder",
    title: "Page Builder",
    defaultExpanded: false,
    items: [
      { id: "page-overview", label: "Overview", path: "/docs/page-builder/overview", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 8: FORM BUILDER (with subsections for Fields, Objects, Lists)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "form-builder",
    title: "Form Builder",
    defaultExpanded: false,
    subsections: [
      // Basics
      {
        id: "form-basics",
        title: "Basics",
        items: [
          { id: "form-overview", label: "Overview", path: "/docs/form/overview", type: "docs" },
          { id: "form-class", label: "Form Class", path: "/docs/form/class", type: "docs" },
          { id: "form-entity", label: "Entity Binding", path: "/docs/form/entity", type: "docs" },
          { id: "form-sections", label: "Sections", path: "/docs/form/sections", type: "story" },
          { id: "form-rows", label: "Rows", path: "/docs/form/rows", type: "story" },
        ],
      },
      // Fields
      {
        id: "form-fields",
        title: "Fields",
        items: [
          { id: "form-field-types", label: "Field Types", path: "/docs/form/field-types", type: "docs" },
          { id: "form-field-config", label: "Field Configuration", path: "/docs/form/field-config", type: "docs" },
          { id: "form-visibility", label: "Field Visibility", path: "/docs/form/visibility", type: "docs" },
          { id: "form-dependencies", label: "Field Dependencies", path: "/docs/form/dependencies", type: "docs" },
          { id: "form-computed", label: "Computed Values", path: "/docs/form/computed", type: "docs" },
        ],
      },
      // Objects (Nested)
      {
        id: "form-objects",
        title: "Objects",
        items: [
          { id: "form-nested", label: "Nested Objects", path: "/docs/form/nested", type: "docs" },
          { id: "form-object-binding", label: "Object Binding", path: "/docs/form/object-binding", type: "docs" },
        ],
      },
      // Lists (Arrays)
      {
        id: "form-lists",
        title: "Lists",
        items: [
          { id: "form-arrays", label: "Array Fields", path: "/docs/form/arrays", type: "docs" },
          { id: "form-list-operations", label: "List Operations", path: "/docs/form/list-operations", type: "docs" },
          { id: "form-list-display", label: "Display Modes", path: "/docs/form/list-display", type: "docs" },
        ],
      },
      // Validation
      {
        id: "form-validation",
        title: "Validation",
        items: [
          { id: "form-val-overview", label: "Overview", path: "/docs/form/validation", type: "docs" },
          { id: "form-validators", label: "Validators", path: "/docs/form/validators", type: "docs" },
          { id: "form-custom-val", label: "Custom Validation", path: "/docs/form/custom-validation", type: "docs" },
          { id: "form-advanced-val", label: "Advanced Validation", path: "/docs/form/advanced-validation", type: "docs" },
        ],
      },
      // Advanced
      {
        id: "form-advanced",
        title: "Advanced",
        items: [
          { id: "form-lifecycle", label: "Lifecycle Hooks", path: "/docs/form/lifecycle", type: "docs" },
          { id: "form-context", label: "FormContext", path: "/docs/form/context", type: "docs" },
          { id: "form-renderer", label: "FormRenderer", path: "/docs/form/renderer", type: "docs" },
          { id: "form-reusable", label: "Reusable Sections", path: "/docs/form/reusable", type: "docs" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 9: ROUTING
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "routing",
    title: "Routing",
    defaultExpanded: false,
    items: [
      { id: "routing-overview", label: "Overview", path: "/docs/routing/overview", type: "docs" },
      { id: "routing-router", label: "LuminoRouter", path: "/docs/routing/router", type: "docs" },
      { id: "routing-link", label: "Link & Navigate", path: "/docs/routing/link", type: "story" },
      { id: "routing-hooks", label: "useRouter / useParams", path: "/docs/routing/hooks", type: "docs" },
      { id: "routing-guards", label: "Route Guards", path: "/docs/routing/guards", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 10: API & DATA
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "api-data",
    title: "API & Data",
    defaultExpanded: false,
    items: [
      { id: "api-overview", label: "Overview", path: "/docs/api/overview", type: "docs" },
      { id: "api-builder", label: "Api Builder", path: "/docs/api/builder", type: "docs" },
      { id: "api-crud", label: "CrudApi", path: "/docs/api/crud", type: "docs" },
      { id: "api-lookup", label: "LookupApi", path: "/docs/api/lookup", type: "docs" },
      { id: "api-mapper", label: "Mapper (DTO/Entity)", path: "/docs/api/mapper", type: "docs" },
      { id: "api-registry", label: "ApiRegistry", path: "/docs/api/registry", type: "docs" },
      { id: "api-cache", label: "CacheManager", path: "/docs/api/cache", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 11: STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "state",
    title: "State Management",
    defaultExpanded: false,
    items: [
      { id: "state-overview", label: "Overview", path: "/docs/state/overview", type: "docs" },
      { id: "state-manager", label: "StateManager", path: "/docs/state/manager", type: "docs" },
      { id: "state-entity", label: "EntityStore", path: "/docs/state/entity", type: "docs" },
      { id: "state-collection", label: "CollectionStore", path: "/docs/state/collection", type: "docs" },
      { id: "state-hooks", label: "useEntity / useCollection", path: "/docs/state/hooks", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 12: EVENTS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "events",
    title: "Events",
    defaultExpanded: false,
    items: [
      { id: "events-overview", label: "Overview", path: "/docs/events/overview", type: "docs" },
      { id: "events-emitter", label: "EventEmitter", path: "/docs/events/emitter", type: "docs" },
      { id: "events-form", label: "Form Events", path: "/docs/events/form", type: "docs" },
      { id: "events-page", label: "Page Events", path: "/docs/events/page", type: "docs" },
      { id: "events-api", label: "API Events", path: "/docs/events/api", type: "docs" },
      { id: "events-app", label: "App Events", path: "/docs/events/app", type: "docs" },
      { id: "events-custom", label: "Custom Events", path: "/docs/events/custom", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 13: REACT HOOKS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "hooks",
    title: "React Hooks",
    defaultExpanded: false,
    items: [
      { id: "hooks-overview", label: "Overview", path: "/docs/hooks/overview", type: "docs" },
      { id: "hooks-lumino", label: "useLumino()", path: "/docs/hooks/useLumino", type: "docs" },
      { id: "hooks-form", label: "useForm()", path: "/docs/hooks/useForm", type: "docs" },
      { id: "hooks-formdata", label: "useFormData()", path: "/docs/hooks/useFormData", type: "docs" },
      { id: "hooks-page", label: "usePage()", path: "/docs/hooks/usePage", type: "docs" },
      { id: "hooks-api", label: "useApi() / useMutation()", path: "/docs/hooks/useApi", type: "docs" },
      { id: "hooks-dialog", label: "useDialog()", path: "/docs/hooks/useDialog", type: "docs" },
      { id: "hooks-navigation", label: "useNavigation()", path: "/docs/hooks/useNavigation", type: "docs" },
      { id: "hooks-events", label: "useEvents()", path: "/docs/hooks/useEvents", type: "docs" },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 14: ADAPTERS
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "adapters",
    title: "Adapters",
    defaultExpanded: false,
    subsections: [
      {
        id: "salt-adapter",
        title: "Salt Adapter",
        items: [
          { id: "salt-overview", label: "Overview", path: "/docs/adapters/salt", type: "docs" },
          { id: "salt-setup", label: "Setup", path: "/docs/adapters/salt-setup", type: "docs" },
          { id: "salt-components", label: "Components", path: "/docs/adapters/salt-components", type: "story" },
        ],
      },
      {
        id: "custom-adapters",
        title: "Custom Adapters",
        items: [
          { id: "adapter-overview", label: "Overview", path: "/docs/adapters/overview", type: "docs" },
          { id: "adapter-interfaces", label: "Adapter Interfaces", path: "/docs/adapters/interfaces", type: "docs" },
          { id: "adapter-create", label: "Creating an Adapter", path: "/docs/adapters/create", type: "docs" },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SECTION 15: API REFERENCE
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: "api-reference",
    title: "API Reference",
    defaultExpanded: false,
    items: [
      { id: "ref-lumino", label: "Lumino", path: "/docs/api-reference/lumino", type: "docs" },
      { id: "ref-app", label: "App / LuminoApp", path: "/docs/api-reference/app", type: "docs" },
      { id: "ref-page", label: "Page", path: "/docs/api-reference/page", type: "docs" },
      { id: "ref-form", label: "Form", path: "/docs/api-reference/form", type: "docs" },
      { id: "ref-validators", label: "Validators", path: "/docs/api-reference/validators", type: "docs" },
      { id: "ref-types", label: "Types & Interfaces", path: "/docs/api-reference/types", type: "docs" },
    ],
  },
];

interface SidebarProps {
  currentPath?: string;
  onNavigate?: (path: string) => void;
}

export function Sidebar({ currentPath = "/", onNavigate }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Find which group and subsection contains the current path
  const findContainingGroupAndSubsection = (path: string): { groupId: string | null; subsectionId: string | null } => {
    for (const group of navigation) {
      // Check items in the group
      if (group.items?.some(item => item.path === path)) {
        return { groupId: group.id, subsectionId: null };
      }
      // Check subsections
      if (group.subsections) {
        for (const sub of group.subsections) {
          if (sub.items.some(item => item.path === path)) {
            return { groupId: group.id, subsectionId: sub.id };
          }
        }
      }
    }
    return { groupId: null, subsectionId: null };
  };

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    navigation.forEach(group => {
      if (group.defaultExpanded) {
        initial.add(group.id);
      }
    });
    // Also expand the group containing the current path
    const { groupId } = findContainingGroupAndSubsection(currentPath);
    if (groupId) {
      initial.add(groupId);
    }
    return initial;
  });

  const [expandedSubsections, setExpandedSubsections] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    // Expand the subsection containing the current path
    const { subsectionId } = findContainingGroupAndSubsection(currentPath);
    if (subsectionId) {
      initial.add(subsectionId);
    }
    return initial;
  });

  // Auto-expand groups/subsections when currentPath changes
  useEffect(() => {
    const { groupId, subsectionId } = findContainingGroupAndSubsection(currentPath);
    if (groupId) {
      setExpandedGroups(prev => {
        if (prev.has(groupId)) return prev;
        return new Set(prev).add(groupId);
      });
    }
    if (subsectionId) {
      setExpandedSubsections(prev => {
        if (prev.has(subsectionId)) return prev;
        return new Set(prev).add(subsectionId);
      });
    }
  }, [currentPath]);

  // Filter navigation based on search query
  const filteredNavigation = useMemo(() => {
    if (!searchQuery.trim()) return navigation;

    const query = searchQuery.toLowerCase();
    return navigation
      .map(group => {
        // Filter regular items
        const filteredItems = group.items?.filter(item =>
          item.label.toLowerCase().includes(query)
        ) || [];

        // Filter subsections and their items
        const filteredSubsections = group.subsections?.map(sub => ({
          ...sub,
          items: sub.items.filter(item =>
            item.label.toLowerCase().includes(query)
          ),
        })).filter(sub => sub.items.length > 0) || [];

        return {
          ...group,
          items: filteredItems,
          subsections: filteredSubsections,
        };
      })
      .filter(group => (group.items && group.items.length > 0) || (group.subsections && group.subsections.length > 0));
  }, [searchQuery]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  const toggleSubsection = (subsectionId: string) => {
    setExpandedSubsections(prev => {
      const next = new Set(prev);
      if (next.has(subsectionId)) {
        next.delete(subsectionId);
      } else {
        next.add(subsectionId);
      }
      return next;
    });
  };

  const handleClick = (path?: string) => {
    if (path && onNavigate) {
      onNavigate(path);
    }
  };

  // When searching, expand all groups and subsections
  const isSearching = searchQuery.trim().length > 0;

  return (
    <aside className="docs-sidebar">
      {/* Search input */}
      <div className="sidebar-search">
        <input
          type="text"
          className="sidebar-search-input"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {filteredNavigation.map((group) => {
          const isExpanded = isSearching || expandedGroups.has(group.id);
          return (
            <div key={group.id} className={`nav-group ${isExpanded ? "expanded" : ""}`}>
              <div
                className="nav-group-title"
                onClick={() => toggleGroup(group.id)}
              >
                {group.title}
              </div>
              {isExpanded && (
                <>
                  {/* Regular items */}
                  {group.items && group.items.length > 0 && (
                    <ul className="nav-group-items">
                      {group.items.map((item) => (
                        <li key={item.id}>
                          <span
                            className={`nav-item ${currentPath === item.path ? "active" : ""}`}
                            data-type={item.type || "story"}
                            onClick={() => handleClick(item.path)}
                          >
                            {item.label}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Subsections */}
                  {group.subsections && group.subsections.map((subsection) => {
                    const isSubExpanded = isSearching || expandedSubsections.has(subsection.id);
                    return (
                      <div key={subsection.id} className={`nav-subsection ${isSubExpanded ? "expanded" : ""}`}>
                        <div
                          className="nav-subsection-title"
                          onClick={() => toggleSubsection(subsection.id)}
                        >
                          {subsection.title}
                        </div>
                        {isSubExpanded && (
                          <ul className="nav-group-items nav-subsection-items">
                            {subsection.items.map((item) => (
                              <li key={item.id}>
                                <span
                                  className={`nav-item ${currentPath === item.path ? "active" : ""}`}
                                  data-type={item.type || "story"}
                                  onClick={() => handleClick(item.path)}
                                >
                                  {item.label}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
