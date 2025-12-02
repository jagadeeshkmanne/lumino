/**
 * Tabs Container Page
 *
 * Documents the Tabs container using Lumino's Tabs class.
 * Shows tabs usage in Pages, Forms, and standalone scenarios.
 */

import React from "react";
import { LiveDemo } from "../../components/LiveDemo";
import { LuminoLiveDemo } from "../../components/LuminoLiveDemo";
import {
  TabsRenderer,
  LuminoStackLayout,
  LuminoText,
  LuminoH4,
  LuminoTextInput,
  LuminoSelect,
  LuminoCheckbox,
  LuminoSwitch,
} from "lumino/react";
import { Tabs, createTabs, Form, Validators } from "lumino/core";

// =============================================================================
// TABS CLASS DEFINITIONS
// =============================================================================

/**
 * Basic tabs with static content
 */
class BasicTabs extends Tabs {
  configure() {
    this.tab("profile")
      .label("Profile")
      .render(() => (
        <LuminoStackLayout gap={2}>
          <LuminoH4>Profile Content</LuminoH4>
          <LuminoText variant="secondary">User profile information goes here.</LuminoText>
        </LuminoStackLayout>
      ))
      .end();

    this.tab("settings")
      .label("Settings")
      .render(() => (
        <LuminoStackLayout gap={2}>
          <LuminoH4>Settings Content</LuminoH4>
          <LuminoText variant="secondary">Application settings go here.</LuminoText>
        </LuminoStackLayout>
      ))
      .end();

    this.tab("notifications")
      .label("Notifications")
      .render(() => (
        <LuminoStackLayout gap={2}>
          <LuminoH4>Notifications Content</LuminoH4>
          <LuminoText variant="secondary">Notification preferences go here.</LuminoText>
        </LuminoStackLayout>
      ))
      .end();
  }
}

/**
 * Tabs with icons and badges
 */
class IconTabs extends Tabs {
  configure() {
    this.tab("inbox")
      .label("Inbox")
      .icon("mail")
      .badge(3)
      .render(() => <LuminoText>Inbox with 3 unread messages</LuminoText>)
      .end();

    this.tab("sent")
      .label("Sent")
      .icon("send")
      .render(() => <LuminoText>Sent messages</LuminoText>)
      .end();

    this.tab("drafts")
      .label("Drafts")
      .icon("edit")
      .badge(1)
      .render(() => <LuminoText>Draft messages</LuminoText>)
      .end();
  }
}

/**
 * Vertical tabs with left position
 */
class VerticalTabs extends Tabs {
  configure() {
    this.position("left");

    this.tab("general")
      .label("General")
      .render(() => (
        <LuminoStackLayout gap={2}>
          <LuminoH4>General Settings</LuminoH4>
          <LuminoText>Configure general application settings here.</LuminoText>
        </LuminoStackLayout>
      ))
      .end();

    this.tab("appearance")
      .label("Appearance")
      .render(() => (
        <LuminoStackLayout gap={2}>
          <LuminoH4>Appearance Settings</LuminoH4>
          <LuminoText>Theme and display options.</LuminoText>
        </LuminoStackLayout>
      ))
      .end();

    this.tab("privacy")
      .label("Privacy")
      .render(() => (
        <LuminoStackLayout gap={2}>
          <LuminoH4>Privacy Settings</LuminoH4>
          <LuminoText>Privacy and security options.</LuminoText>
        </LuminoStackLayout>
      ))
      .end();
  }
}

/**
 * Tabs with disabled tab
 */
class DisabledTabsTabs extends Tabs {
  configure() {
    this.tab("active")
      .label("Active")
      .render(() => <LuminoText>This tab is active and clickable</LuminoText>)
      .end();

    this.tab("disabled")
      .label("Disabled")
      .disabled(true)
      .render(() => <LuminoText>This tab is disabled</LuminoText>)
      .end();

    this.tab("another")
      .label("Another")
      .render(() => <LuminoText>Another active tab</LuminoText>)
      .end();
  }
}

/**
 * Closable tabs
 */
class ClosableTabs extends Tabs {
  configure() {
    this.tab("tab1")
      .label("Document 1")
      .closable()
      .render(() => <LuminoText>Content of Document 1</LuminoText>)
      .end();

    this.tab("tab2")
      .label("Document 2")
      .closable()
      .render(() => <LuminoText>Content of Document 2</LuminoText>)
      .end();

    this.tab("tab3")
      .label("Document 3")
      .closable()
      .render(() => <LuminoText>Content of Document 3</LuminoText>)
      .end();
  }

  onClose(tabId: string, ctx: any) {
    ctx.notify?.(`Closed tab: ${tabId}`, "info");
  }
}

// =============================================================================
// FORM CLASSES FOR TABS WITH FORMS DEMO
// =============================================================================

/**
 * Profile form for the first tab
 */
class ProfileForm extends Form<{ firstName: string; lastName: string; email: string }> {
  constructor(id?: string) {
    super(id ?? "profile-form");
  }

  configure() {
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .rules(Validators.required({ message: "First name is required" }))
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .rules(Validators.required({ message: "Last name is required" }))
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .props({ type: "email" })
          .rules(Validators.required({ message: "Email is required" }))
        .endField()
      .endRow()
    .endSection();
  }
}

/**
 * Preferences form for the second tab
 */
class PreferencesForm extends Form<{ theme: string; language: string; notifications: boolean }> {
  constructor(id?: string) {
    super(id ?? "preferences-form");
  }

  configure() {
    this.addSection("Display Settings")
      .addRow()
        .addField("theme")
          .component(LuminoSelect)
          .label("Theme")
          .props({
            options: [
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ],
          })
        .endField()
        .addField("language")
          .component(LuminoSelect)
          .label("Language")
          .props({
            options: [
              { value: "en", label: "English" },
              { value: "es", label: "Spanish" },
              { value: "fr", label: "French" },
              { value: "de", label: "German" },
            ],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("notifications")
          .component(LuminoSwitch)
          .label("Enable Notifications")
        .endField()
      .endRow()
    .endSection();
  }
}

/**
 * Security form for the third tab
 */
class SecurityForm extends Form<{ twoFactor: boolean; sessionTimeout: string }> {
  constructor(id?: string) {
    super(id ?? "security-form");
  }

  configure() {
    this.addSection("Security Settings")
      .addRow()
        .addField("twoFactor")
          .component(LuminoCheckbox)
          .label("Enable Two-Factor Authentication")
        .endField()
      .endRow()
      .addRow()
        .addField("sessionTimeout")
          .component(LuminoSelect)
          .label("Session Timeout")
          .props({
            options: [
              { value: "15", label: "15 minutes" },
              { value: "30", label: "30 minutes" },
              { value: "60", label: "1 hour" },
              { value: "120", label: "2 hours" },
            ],
          })
        .endField()
      .endRow()
    .endSection();
  }
}

// Form instances not needed for Forms in Tabs - TabsRenderer creates them automatically

/**
 * Forms in Tabs - Each tab renders a separate Form class using .form(FormClass)
 * The TabsRenderer handles instantiation and rendering automatically!
 */
class TabbedFormTabs extends Tabs {
  configure() {
    this.tab("profile")
      .label("Profile")
      .form(ProfileForm)  // Just pass the Form class - no manual rendering needed!
      .end();

    this.tab("preferences")
      .label("Preferences")
      .form(PreferencesForm)
      .end();

    this.tab("security")
      .label("Security")
      .form(SecurityForm)
      .end();
  }
}

// =============================================================================
// FORM WITH TABS INSIDE (Tabs in Form pattern)
// =============================================================================

// =============================================================================
// SEPARATE FORM CLASSES FOR EACH TAB (Component-based approach)
// =============================================================================

/**
 * Contact Form - Reusable form for contact info tab
 */
class ContactInfoForm extends Form<{ email: string; phone: string }> {
  constructor(id?: string) {
    super(id ?? "contact-info");
  }

  configure() {
    this.addSection("Contact Details")
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .props({ type: "email" })
          .rules(Validators.required({ message: "Email is required" }))
        .endField()
        .addField("phone")
          .component(LuminoTextInput)
          .label("Phone")
        .endField()
      .endRow()
    .endSection();
  }
}

/**
 * Address Form - Reusable form for address tab
 */
class AddressInfoForm extends Form<{ street: string; city: string; state: string; zip: string }> {
  constructor(id?: string) {
    super(id ?? "address-info");
  }

  configure() {
    this.addSection("Home Address")
      .addRow()
        .addField("street")
          .component(LuminoTextInput)
          .label("Street Address")
        .endField()
      .endRow()
      .addRow()
        .addField("city")
          .component(LuminoTextInput)
          .label("City")
        .endField()
        .addField("state")
          .component(LuminoTextInput)
          .label("State")
        .endField()
        .addField("zip")
          .component(LuminoTextInput)
          .label("ZIP Code")
        .endField()
      .endRow()
    .endSection();
  }
}

/**
 * Employment Form - Reusable form for employment tab
 */
class EmploymentInfoForm extends Form<{ department: string; position: string; startDate: string }> {
  constructor(id?: string) {
    super(id ?? "employment-info");
  }

  configure() {
    this.addSection("Job Details")
      .addRow()
        .addField("department")
          .component(LuminoSelect)
          .label("Department")
          .props({
            options: [
              { value: "engineering", label: "Engineering" },
              { value: "sales", label: "Sales" },
              { value: "marketing", label: "Marketing" },
              { value: "hr", label: "Human Resources" },
            ],
          })
        .endField()
        .addField("position")
          .component(LuminoTextInput)
          .label("Position")
        .endField()
      .endRow()
      .addRow()
        .addField("startDate")
          .component(LuminoTextInput)
          .label("Start Date")
          .props({ type: "date" })
        .endField()
      .endRow()
    .endSection();
  }
}

/**
 * Employee form with tabbed sections using .form(FormClass) pattern.
 * Each tab content is defined as a separate, reusable Form class.
 */
class EmployeeForm extends Form<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  department: string;
  position: string;
  startDate: string;
}> {
  constructor(id?: string) {
    super(id ?? "employee-form");
  }

  configure() {
    // Regular section before tabs
    this.addSection("Employee Registration")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
          .rules(Validators.required({ message: "First name is required" }))
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
          .rules(Validators.required({ message: "Last name is required" }))
        .endField()
      .endRow()
    .endSection();

    // Tabs inside the form - use .form(FormClass) to reference Form components!
    this.addTabs("employee-details")
      .position("top")
      .tab("contact")
        .label("Contact Info")
        .form(ContactInfoForm)  // Use Form class instead of inline definition!
      .endTab()
      .tab("address")
        .label("Address")
        .form(AddressInfoForm)  // Reusable Form component
      .endTab()
      .tab("employment")
        .label("Employment")
        .form(EmploymentInfoForm)  // Each tab is a separate Form
      .endTab()
    .endTabs();
  }
}

const employeeForm = new EmployeeForm();

// =============================================================================
// DEMO COMPONENTS - Create instances once
// =============================================================================

const basicTabs = new BasicTabs("basic-tabs");
const tabbedFormTabs = new TabbedFormTabs("tabbed-form-tabs");
const iconTabs = new IconTabs("icon-tabs");
const verticalTabs = new VerticalTabs("vertical-tabs");
const disabledTabs = new DisabledTabsTabs("disabled-tabs");
const closableTabs = new ClosableTabs("closable-tabs");

// createTabs inline example
const inlineTabs = createTabs("inline-tabs", (t) => {
  t.tab("first")
    .label("First Tab")
    .render(() => <LuminoText>Content from createTabs</LuminoText>)
    .end();
  t.tab("second")
    .label("Second Tab")
    .render(() => <LuminoText>Second tab content</LuminoText>)
    .end();
});

function BasicTabsDemo() {
  return (
    <TabsRenderer
      config={basicTabs.build()}
      context={{} as any}
    />
  );
}

function IconTabsDemo() {
  return (
    <TabsRenderer
      config={iconTabs.build()}
      context={{} as any}
    />
  );
}

function VerticalTabsDemo() {
  return (
    <TabsRenderer
      config={verticalTabs.build()}
      context={{} as any}
    />
  );
}

function DisabledTabsDemo() {
  return (
    <TabsRenderer
      config={disabledTabs.build()}
      context={{} as any}
    />
  );
}

function ClosableTabsDemo() {
  return (
    <TabsRenderer
      config={closableTabs.build()}
      context={{} as any}
    />
  );
}

function InlineTabsDemo() {
  return (
    <TabsRenderer
      config={inlineTabs}
      context={{} as any}
    />
  );
}

function TabbedFormDemo() {
  return (
    <TabsRenderer
      config={tabbedFormTabs.build()}
      context={{} as any}
    />
  );
}

// TabsInFormDemo removed - using LuminoLiveDemo directly with EmployeeForm

// =============================================================================
// CODE EXAMPLES
// =============================================================================

const basicCode = `import { Tabs, TabsRenderer } from "lumino";

class BasicTabs extends Tabs {
  configure() {
    this.tab("profile")
      .label("Profile")
      .render(() => <ProfileContent />)
      .end();

    this.tab("settings")
      .label("Settings")
      .render(() => <SettingsContent />)
      .end();

    this.tab("notifications")
      .label("Notifications")
      .render(() => <NotificationsContent />)
      .end();
  }
}

const tabs = new BasicTabs("my-tabs");

// In component:
<TabsRenderer config={tabs.build()} context={context} />`;

const iconCode = `import { Tabs, TabsRenderer } from "lumino";

class IconTabs extends Tabs {
  configure() {
    this.tab("inbox")
      .label("Inbox")
      .icon("mail")
      .badge(3)  // Show unread count
      .render(() => <InboxContent />)
      .end();

    this.tab("sent")
      .label("Sent")
      .icon("send")
      .render(() => <SentContent />)
      .end();
  }
}`;

const verticalCode = `import { Tabs, TabsRenderer } from "lumino";

class VerticalTabs extends Tabs {
  configure() {
    this.position("left");  // "top" | "bottom" | "left" | "right"

    this.tab("general")
      .label("General")
      .render(() => <GeneralSettings />)
      .end();

    this.tab("appearance")
      .label("Appearance")
      .render(() => <AppearanceSettings />)
      .end();
  }
}`;

const disabledCode = `import { Tabs, TabsRenderer } from "lumino";

class DisabledTabs extends Tabs {
  configure() {
    this.tab("active")
      .label("Active")
      .render(() => <ActiveContent />)
      .end();

    this.tab("disabled")
      .label("Disabled")
      .disabled(true)  // Static disabled
      // Or dynamic: .disabled((ctx) => !ctx.getValue("isAdmin"))
      .render(() => <DisabledContent />)
      .end();
  }
}`;

const closableCode = `import { Tabs, TabsRenderer } from "lumino";

class ClosableTabs extends Tabs {
  configure() {
    this.tab("doc1")
      .label("Document 1")
      .closable()  // Allow closing this tab
      .render(() => <DocContent />)
      .end();

    this.tab("doc2")
      .label("Document 2")
      .closable()
      .render(() => <DocContent />)
      .end();
  }

  // Handle tab close
  onClose(tabId: string, ctx: FormContext) {
    ctx.notify(\`Closed: \${tabId}\`, "info");
    // Update state to remove tab
  }
}`;

const inlineCode = `import { createTabs, TabsRenderer } from "lumino";

// Quick inline definition without extending Tabs class
const myTabs = createTabs("settings", (t) => {
  t.tab("general")
    .label("General")
    .render(() => <GeneralSettings />)
    .end();

  t.tab("advanced")
    .label("Advanced")
    .render(() => <AdvancedSettings />)
    .end();
});

// In component:
<TabsRenderer config={myTabs} context={context} />`;

const tabbedFormCode = `import { Tabs, TabsRenderer, Form } from "lumino/core";
import { LuminoTextInput, LuminoSelect, LuminoSwitch } from "lumino/react";

// Define Form classes for each tab
class ProfileForm extends Form<{ firstName: string; lastName: string; email: string }> {
  configure() {
    this.addSection("Personal Information")
      .addRow()
        .addField("firstName")
          .component(LuminoTextInput)
          .label("First Name")
        .endField()
        .addField("lastName")
          .component(LuminoTextInput)
          .label("Last Name")
        .endField()
      .endRow()
      .addRow()
        .addField("email")
          .component(LuminoTextInput)
          .label("Email")
          .props({ type: "email" })
        .endField()
      .endRow()
    .endSection();
  }
}

class PreferencesForm extends Form<{ theme: string; notifications: boolean }> {
  configure() {
    this.addSection("Display Settings")
      .addRow()
        .addField("theme")
          .component(LuminoSelect)
          .label("Theme")
          .props({
            options: [
              { value: "light", label: "Light" },
              { value: "dark", label: "Dark" },
              { value: "system", label: "System" },
            ],
          })
        .endField()
      .endRow()
      .addRow()
        .addField("notifications")
          .component(LuminoSwitch)
          .label("Enable Notifications")
        .endField()
      .endRow()
    .endSection();
  }
}

// Define Tabs that reference Form classes directly with .form()
// NO manual FormRenderer needed - TabsRenderer handles it!
class SettingsTabs extends Tabs {
  configure() {
    this.tab("profile")
      .label("Profile")
      .form(ProfileForm)  // Just pass the Form class!
      .end();

    this.tab("preferences")
      .label("Preferences")
      .form(PreferencesForm)
      .end();
  }
}

// Usage
const settingsTabs = new SettingsTabs("settings-tabs");
<TabsRenderer config={settingsTabs.build()} context={context} />`;

const tabsInFormCode = `import { Form, Validators } from "lumino/core";
import { LuminoTextInput, LuminoSelect, LuminoLiveDemo } from "lumino/react";

// Define reusable Form classes for each tab content
class ContactInfoForm extends Form<{ email: string; phone: string }> {
  configure() {
    this.addSection("Contact Details")
      .addRow()
        .addField("email").component(LuminoTextInput).label("Email")
          .rules(Validators.required()).endField()
        .addField("phone").component(LuminoTextInput).label("Phone").endField()
      .endRow()
    .endSection();
  }
}

class AddressInfoForm extends Form<{ street: string; city: string; state: string }> {
  configure() {
    this.addSection("Home Address")
      .addRow()
        .addField("street").component(LuminoTextInput).label("Street").endField()
        .addField("city").component(LuminoTextInput).label("City").endField()
        .addField("state").component(LuminoTextInput).label("State").endField()
      .endRow()
    .endSection();
  }
}

class EmploymentInfoForm extends Form<{ department: string; position: string }> {
  configure() {
    this.addSection("Job Details")
      .addRow()
        .addField("department").component(LuminoSelect).label("Department")
          .props({ options: [{ value: "eng", label: "Engineering" }] }).endField()
        .addField("position").component(LuminoTextInput).label("Position").endField()
      .endRow()
    .endSection();
  }
}

// Main form with tabs - use .form(FormClass) for each tab!
class EmployeeForm extends Form<{...}> {
  configure() {
    // Regular section before tabs
    this.addSection("Employee Registration")
      .addRow()
        .addField("firstName").component(LuminoTextInput).label("First Name").endField()
        .addField("lastName").component(LuminoTextInput).label("Last Name").endField()
      .endRow()
    .endSection();

    // Tabs with Form classes - clean component-based approach!
    this.addTabs("employee-details")
      .tab("contact").label("Contact Info").form(ContactInfoForm).endTab()
      .tab("address").label("Address").form(AddressInfoForm).endTab()
      .tab("employment").label("Employment").form(EmploymentInfoForm).endTab()
    .endTabs();
  }
}

// Usage - LuminoLiveDemo handles the FormRenderer automatically
<LuminoLiveDemo form={new EmployeeForm()} initialValues={{...}} />`;

// =============================================================================
// PAGE COMPONENT
// =============================================================================

export function TabsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Tabs</h1>
      <p className="docs-page-subtitle">
        A tabbed interface component for organizing content into switchable panels.
        Use in Pages with <code>addTabs()</code> or in Forms with <code>.addTabs()</code>.
      </p>

      <div className="docs-section">
        <h2>Import</h2>
        <pre className="docs-code">{`// For Pages and Forms (most common)
import { Page, Form, Tabs, createTabs } from "lumino/core";

// Only for manual rendering (rare)
import { TabsRenderer } from "lumino/react";`}</pre>
      </div>

      <div className="docs-section">
        <h2>Quick Start</h2>
        <p>
          Tabs can be used in <strong>Pages</strong> or <strong>Forms</strong>.
          Define a Tabs class once, then add it where needed:
        </p>
        <pre className="docs-code">{`// 1. Define tabs
class MyTabs extends Tabs {
  configure() {
    this.tab("first").label("First").form(FirstForm).end();
    this.tab("second").label("Second").form(SecondForm).end();
  }
}

// 2. Use in a Page (most common)
class MyPage extends Page {
  configure() {
    this.route("/my-page");
    this.addTabs(new MyTabs("my-tabs"));
  }
}

// 3. Or use in a Form
class MyForm extends Form<{...}> {
  configure() {
    this.addTabs("details")
      .tab("info").label("Info").form(InfoForm).endTab()
      .tab("settings").label("Settings").form(SettingsForm).endTab()
    .endTabs();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Basic Tabs</h2>
        <p>Define tabs by extending the Tabs class:</p>
        <LiveDemo
          title="Basic Tabs"
          description="Simple tabbed interface"
          code={basicCode}
        >
          <BasicTabsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Tabs with Icons & Badges</h2>
        <p>Add icons and badge counts to tabs:</p>
        <LiveDemo
          title="Icons & Badges"
          description="Tabs with visual indicators"
          code={iconCode}
        >
          <IconTabsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Vertical Tabs</h2>
        <p>Position tabs on the left for settings-style layouts:</p>
        <LiveDemo
          title="Vertical"
          description="Left-positioned tabs"
          code={verticalCode}
        >
          <VerticalTabsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Disabled Tabs</h2>
        <p>Disable tabs based on conditions:</p>
        <LiveDemo
          title="Disabled"
          description="Some tabs disabled"
          code={disabledCode}
        >
          <DisabledTabsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Closable Tabs</h2>
        <p>Allow users to close tabs:</p>
        <LiveDemo
          title="Closable"
          description="Tabs with close buttons"
          code={closableCode}
        >
          <ClosableTabsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Inline Definition</h2>
        <p>Use createTabs for quick inline definitions:</p>
        <LiveDemo
          title="createTabs"
          description="Inline tab definition"
          code={inlineCode}
        >
          <InlineTabsDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Forms in Tabs</h2>
        <p>
          Each tab can render a separate Form class using <code>.form(FormClass)</code>.
          Perfect for settings pages where each tab has its own form:
        </p>
        <LiveDemo
          title="Forms in Tabs"
          description="Each tab contains a separate form"
          code={tabbedFormCode}
        >
          <TabbedFormDemo />
        </LiveDemo>
      </div>

      <div className="docs-section">
        <h2>Tabs in Form</h2>
        <p>
          A single Form can have tabs inside it using <code>.addTabs()</code>.
          All fields across tabs belong to ONE form - useful for organizing complex forms:
        </p>
        <LuminoLiveDemo
          title="Tabs in Form"
          description="One form with tabbed sections"
          form={employeeForm}
          code={tabsInFormCode}
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            street: "",
            city: "",
            state: "",
            zip: "",
            department: "",
            position: "",
            startDate: "",
          }}
        />
      </div>

      <div className="docs-section">
        <h2>Dynamic Tabs from List</h2>
        <p>
          Use <code>addList().as(Tabs)</code> to create tabs from a data array.
          Each item in the list becomes a tab - great for dynamic content:
        </p>
        <pre className="docs-code">{`import { Form, Component } from "lumino/core";

// Define fields for each address tab
class AddressFields extends Component<Address> {
  configure() {
    this.addRow()
      .addField("type").component(LuminoSelect).label("Type")
        .props({ options: [{value: "home", label: "Home"}, {value: "work", label: "Work"}] })
      .endField()
      .addField("street").component(LuminoTextInput).label("Street").endField()
      .addField("city").component(LuminoTextInput).label("City").endField()
    .endRow();
  }
}

// Form with dynamic tabs from list
class PersonForm extends Form<{ name: string; addresses: Address[] }> {
  configure() {
    this.addSection("Person Info")
      .addRow()
        .addField("name").component(LuminoTextInput).label("Name").endField()
      .endRow()
    .endSection();

    // Each address in the list becomes a tab!
    this.addList<Address>("addresses")
      .as(Tabs)                              // Render as tabs
      .include(AddressFields)                // Use AddressFields for each tab
      .tabLabel((addr) => addr.type)         // Tab label from data
      .addable()                             // Allow adding new tabs
      .removable()                           // Allow removing tabs
    .end();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Tab Usage Patterns Summary</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Description</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Page.addTabs(tabs)</code></td>
              <td>Tabs inside a Page</td>
              <td>Dashboard pages, settings pages</td>
            </tr>
            <tr>
              <td><code>Form.addTabs().tab().form()</code></td>
              <td>Static tabs inside a form</td>
              <td>Complex forms with tabbed sections</td>
            </tr>
            <tr>
              <td><code>.tab().form(FormClass)</code></td>
              <td>Each tab renders a Form</td>
              <td>Multi-step wizards, settings</td>
            </tr>
            <tr>
              <td><code>addList().as(Tabs)</code></td>
              <td>Dynamic tabs from data</td>
              <td>Multiple addresses, variants</td>
            </tr>
            <tr>
              <td><code>TabsRenderer</code></td>
              <td>Manual rendering (rare)</td>
              <td>Custom component embedding</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Tabs in Page</h2>
        <p>
          The most common pattern - add tabs to a <code>Page</code> using <code>addTabs()</code>.
          The PageRenderer handles all rendering automatically:
        </p>
        <pre className="docs-code">{`import { Page, Tabs } from "lumino/core";

// Define your tabs with Forms
class SettingsTabs extends Tabs {
  configure() {
    this.tab("profile").label("Profile").form(ProfileForm).end();
    this.tab("preferences").label("Preferences").form(PreferencesForm).end();
    this.tab("security").label("Security").form(SecurityForm).end();
  }
}

// Instantiate tabs
const settingsTabs = new SettingsTabs("settings-tabs");

// Add to Page - no TabsRenderer needed!
class SettingsPage extends Page {
  configure() {
    this.route("/settings");

    // Just add the tabs instance - PageRenderer handles the rest
    this.addTabs(settingsTabs);
  }
}

// Usage: <PageRenderer page={settingsPage} />`}</pre>
      </div>

      <div className="docs-section">
        <h2>Standalone TabsRenderer (Rare)</h2>
        <p>
          For advanced cases where you need tabs outside of a Page/Form,
          use <code>TabsRenderer</code> directly. This is uncommon:
        </p>
        <pre className="docs-code">{`import { TabsRenderer } from "lumino/react";
import { Tabs } from "lumino/core";

// Only needed when embedding tabs in custom React components
// that don't use Page or Form
const myTabs = new MyTabs("my-tabs");

// Manual usage - provides full control but more boilerplate
<TabsRenderer
  config={myTabs.build()}
  context={formContext}
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Form Communication Patterns</h2>
        <p>
          Forms in tabs can be independent or share data with parent forms.
          Here are the different communication patterns:
        </p>

        <h3>1. Independent Forms (No Shared State)</h3>
        <p>Each tab has its own form that submits independently:</p>
        <pre className="docs-code">{`// Each form is completely independent
class SettingsTabs extends Tabs {
  configure() {
    this.tab("profile").form(ProfileForm).end();     // Independent form
    this.tab("billing").form(BillingForm).end();     // Separate submit
    this.tab("security").form(SecurityForm).end();   // No shared data
  }
}`}</pre>

        <h3>2. Unified Form (Shared State via addTabs)</h3>
        <p>All fields belong to ONE form - changes in any tab update the same form state:</p>
        <pre className="docs-code">{`// All tabs share ONE form context
class EmployeeForm extends Form<Employee> {
  configure() {
    this.addSection("Header").addRow()...endSection();

    // All tab fields belong to EmployeeForm!
    this.addTabs("details")
      .tab("personal").form(PersonalForm).endTab()   // Same form state
      .tab("address").form(AddressForm).endTab()     // Shared validation
      .tab("work").form(WorkForm).endTab()           // Single submit
    .endTabs();
  }
}`}</pre>

        <h3>3. Child Form Dialog (Parent-Child Communication)</h3>
        <p>Open a form in a dialog, pass data, and receive results:</p>
        <pre className="docs-code">{`// Parent form opens child dialog
class SearchForm extends Form<SearchParams> {
  configure() {
    this.addAction("advanced")
      .label("Advanced Search")
      .onClick((ctx) => {
        // Open dialog and pass current filters
        ctx.open(AdvancedSearchDialog, {
          data: ctx.getFormData(),           // Pass current data to child
          onSave: (filters) => {             // Receive results from child
            ctx.setValues(filters);          // Apply to parent form
            ctx.notify("Filters applied!");
          }
        });
      });
  }
}

// Child dialog form
class AdvancedSearchDialog extends Dialog {
  configure() {
    this.title("Advanced Search");
    this.form(AdvancedFiltersForm);          // Form inside dialog

    this.action("apply")
      .label("Apply Filters")
      .variant("primary")
      .onClick((ctx) => {
        ctx.closeWith(ctx.getFormData());    // Send data back to parent
      });
  }
}

// Inside AdvancedFiltersForm, access parent data:
// const parentFilters = ctx.dialogData;  // Data passed from parent`}</pre>
      </div>

      <div className="docs-section">
        <h2>Tabs Class API</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>tab(id)</code></td>
              <td>Add a new tab with the given ID</td>
            </tr>
            <tr>
              <td><code>position(pos)</code></td>
              <td>"top" | "bottom" | "left" | "right"</td>
            </tr>
            <tr>
              <td><code>initialTab(id)</code></td>
              <td>Set initially active tab (ID or index)</td>
            </tr>
            <tr>
              <td><code>addable(bool)</code></td>
              <td>Enable adding new tabs dynamically</td>
            </tr>
            <tr>
              <td><code>addLabel(text)</code></td>
              <td>Label for add tab button</td>
            </tr>
            <tr>
              <td><code>css(className)</code></td>
              <td>Add CSS class to tabs container</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Tab Builder API</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>.label(text)</code></td>
              <td>Tab label (string or function)</td>
            </tr>
            <tr>
              <td><code>.icon(icon)</code></td>
              <td>Tab icon</td>
            </tr>
            <tr>
              <td><code>.badge(content)</code></td>
              <td>Badge content (string, number, or function)</td>
            </tr>
            <tr>
              <td><code>.form(FormClass)</code></td>
              <td>Render a Form class in this tab</td>
            </tr>
            <tr>
              <td><code>.component(Comp)</code></td>
              <td>Render a custom component</td>
            </tr>
            <tr>
              <td><code>.render(fn)</code></td>
              <td>Custom render function</td>
            </tr>
            <tr>
              <td><code>.disabled(cond)</code></td>
              <td>Disable tab (boolean or function)</td>
            </tr>
            <tr>
              <td><code>.closable()</code></td>
              <td>Allow closing this tab</td>
            </tr>
            <tr>
              <td><code>.end()</code></td>
              <td>End tab definition</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Lifecycle Hooks</h2>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Method</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>onAdd(ctx)</code></td>
              <td>Called when add button clicked (if addable)</td>
            </tr>
            <tr>
              <td><code>onClose(tabId, ctx)</code></td>
              <td>Called when tab is closed</td>
            </tr>
            <tr>
              <td><code>onChange(tabId, ctx)</code></td>
              <td>Called when active tab changes</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="docs-section">
        <h2>Best Practices</h2>
        <ul className="docs-list">
          <li>
            <strong>Use Tabs class</strong> - Extend Tabs for reusable tab definitions
          </li>
          <li>
            <strong>Use createTabs for one-offs</strong> - Quick inline definitions
          </li>
          <li>
            <strong>Use Form in tabs</strong> - Use .form(FormClass) to render forms in tabs
          </li>
          <li>
            <strong>Limit tab count</strong> - More than 5-6 tabs can overwhelm users
          </li>
          <li>
            <strong>Use vertical tabs for many options</strong> - Settings pages work well with left-positioned tabs
          </li>
        </ul>
      </div>
    </div>
  );
}
