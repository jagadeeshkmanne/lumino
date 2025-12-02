/**
 * Salt Components Mapping Page
 *
 * Complete reference of all Salt adapter component mappings.
 */

import React from "react";

export function SaltComponentsPage() {
  return (
    <div className="docs-page">
      <h1 className="docs-page-title">Salt Components Mapping</h1>
      <p className="docs-page-subtitle">
        Complete reference of Lumino to Salt component mappings.
      </p>

      <div className="docs-section">
        <h2>Field Components (IFieldAdapter)</h2>
        <p>
          Form input fields for data entry and selection:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Lumino Component</th>
              <th>Salt Component</th>
              <th>Package</th>
              <th>Key Features</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>TextInput</code></td>
              <td>Input</td>
              <td>@salt-ds/core</td>
              <td>Single-line text, password, email</td>
            </tr>
            <tr>
              <td><code>NumberInput</code></td>
              <td>Input (type="number")</td>
              <td>@salt-ds/core</td>
              <td>Numeric input with steppers</td>
            </tr>
            <tr>
              <td><code>TextArea</code></td>
              <td>TextArea</td>
              <td>@salt-ds/lab</td>
              <td>Multi-line text input</td>
            </tr>
            <tr>
              <td><code>Checkbox</code></td>
              <td>Checkbox</td>
              <td>@salt-ds/core</td>
              <td>Binary selection</td>
            </tr>
            <tr>
              <td><code>CheckboxGroup</code></td>
              <td>CheckboxGroup</td>
              <td>@salt-ds/core</td>
              <td>Multiple checkboxes</td>
            </tr>
            <tr>
              <td><code>Switch</code></td>
              <td>Switch</td>
              <td>@salt-ds/core</td>
              <td>Toggle on/off</td>
            </tr>
            <tr>
              <td><code>RadioGroup</code></td>
              <td>RadioButtonGroup</td>
              <td>@salt-ds/core</td>
              <td>Single selection from options</td>
            </tr>
            <tr>
              <td><code>Select</code></td>
              <td>Dropdown</td>
              <td>@salt-ds/core</td>
              <td>Single-select dropdown</td>
            </tr>
            <tr>
              <td><code>MultiSelect</code></td>
              <td>Dropdown (multiselect)</td>
              <td>@salt-ds/core</td>
              <td>Multi-select dropdown</td>
            </tr>
            <tr>
              <td><code>Autocomplete</code></td>
              <td>ComboBox</td>
              <td>@salt-ds/core</td>
              <td>Searchable select</td>
            </tr>
            <tr>
              <td><code>DatePicker</code></td>
              <td>DatePicker</td>
              <td>@salt-ds/lab</td>
              <td>Date selection</td>
            </tr>
            <tr>
              <td><code>TimePicker</code></td>
              <td>Input (custom)</td>
              <td>@salt-ds/core</td>
              <td>Time selection</td>
            </tr>
          </tbody>
        </table>

        <h3>Usage Example</h3>
        <pre className="docs-code">
{`import { Form } from "lumino/core";

class UserForm extends Form<UserEntity> {
  configure() {
    this.addSection("User Details")
      .addRow()
        .addField("name")
          .component("TextInput")      // → Salt Input
          .label("Name")
          .endField()
        .addField("age")
          .component("NumberInput")    // → Salt Input (type="number")
          .label("Age")
          .endField()
      .endRow()
      .addRow()
        .addField("country")
          .component("Select")         // → Salt Dropdown
          .label("Country")
          .options(countries)
          .endField()
      .endRow()
    .endSection();
  }
}`}</pre>
      </div>

      <div className="docs-section">
        <h2>Layout Components (ILayoutAdapter)</h2>
        <p>
          Structural components for organizing forms and content:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Lumino Component</th>
              <th>Implementation</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Row</code></td>
              <td>Custom div + CSS Grid</td>
              <td>Horizontal field layout</td>
            </tr>
            <tr>
              <td><code>Column</code></td>
              <td>Custom div + flexbox</td>
              <td>Vertical stacking</td>
            </tr>
            <tr>
              <td><code>Section</code></td>
              <td>Custom section + heading</td>
              <td>Form sections with titles</td>
            </tr>
            <tr>
              <td><code>Form</code></td>
              <td>HTML form element</td>
              <td>Form container</td>
            </tr>
            <tr>
              <td><code>FieldWrapper</code></td>
              <td>FormField</td>
              <td>Label + input + validation wrapper</td>
            </tr>
            <tr>
              <td><code>ErrorMessage</code></td>
              <td>FormFieldHelperText</td>
              <td>Error message display</td>
            </tr>
          </tbody>
        </table>

        <h3>Usage Example</h3>
        <pre className="docs-code">
{`// Row - horizontal layout
this.addRow()
  .addField("firstName")...endField()
  .addField("lastName")...endField()
.endRow()

// Section - grouped content
this.addSection("Contact Information")
  .addRow()...endRow()
.endSection()

// Custom layout with StackLayout
import { LuminoStackLayout } from "lumino/adapters/salt";

<LuminoStackLayout direction="column" gap={2}>
  <TextInput />
  <Select />
</LuminoStackLayout>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Container Components (IContainerAdapter)</h2>
        <p>
          UI containers for dialogs, panels, and content organization:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Lumino Component</th>
              <th>Salt Component</th>
              <th>Package</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Dialog</code></td>
              <td>Dialog</td>
              <td>@salt-ds/core</td>
              <td>Modal dialogs, forms</td>
            </tr>
            <tr>
              <td><code>Card</code></td>
              <td>Card</td>
              <td>@salt-ds/core</td>
              <td>Content cards</td>
            </tr>
            <tr>
              <td><code>Panel</code></td>
              <td>Panel</td>
              <td>@salt-ds/core</td>
              <td>Side panels, drawers</td>
            </tr>
            <tr>
              <td><code>Tabs</code></td>
              <td>TabNext</td>
              <td>@salt-ds/lab</td>
              <td>Tabbed navigation</td>
            </tr>
          </tbody>
        </table>

        <h3>Usage Example</h3>
        <pre className="docs-code">
{`import { LuminoDialog, LuminoCard, LuminoTabs } from "lumino/adapters/salt";

// Dialog
<LuminoDialog
  open={isOpen}
  onClose={handleClose}
  title="Edit User"
  footer={<Button>Save</Button>}
>
  <FormRenderer form={form} entity={entity} />
</LuminoDialog>

// Card
<LuminoCard>
  <LuminoCardHeader>User Profile</LuminoCardHeader>
  <LuminoCardContent>
    {/* Content */}
  </LuminoCardContent>
  <LuminoCardFooter>
    <Button>Edit</Button>
  </LuminoCardFooter>
</LuminoCard>

// Tabs
<LuminoTabs
  items={tabs}
  activeIndex={activeTab}
  onTabChange={setActiveTab}
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Action Components (IActionAdapter)</h2>
        <p>
          User action triggers like buttons:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Lumino Component</th>
              <th>Salt Component</th>
              <th>Variants</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Button</code></td>
              <td>Button</td>
              <td>primary (cta), secondary (primary), tertiary (secondary)</td>
            </tr>
            <tr>
              <td><code>IconButton</code></td>
              <td>Button (icon-only)</td>
              <td>primary, default</td>
            </tr>
          </tbody>
        </table>

        <h3>Variant Mapping</h3>
        <pre className="docs-code">
{`// Lumino → Salt variant mapping
variant="primary"   → Salt variant="cta"
variant="secondary" → Salt variant="primary"
variant="tertiary"  → Salt variant="secondary"

// Usage
import { LuminoButton } from "lumino/adapters/salt";

<LuminoButton variant="primary" onClick={handleSave}>
  Save
</LuminoButton>
<LuminoButton variant="secondary" onClick={handleCancel}>
  Cancel
</LuminoButton>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Feedback Components (IFeedbackAdapter)</h2>
        <p>
          Components for displaying status, notifications, and loading states:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Lumino Component</th>
              <th>Salt Component</th>
              <th>Package</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Alert</code></td>
              <td>Banner</td>
              <td>@salt-ds/core</td>
              <td>Info, warning, error messages</td>
            </tr>
            <tr>
              <td><code>Badge</code></td>
              <td>Badge</td>
              <td>@salt-ds/core</td>
              <td>Status indicators, counts</td>
            </tr>
            <tr>
              <td><code>Spinner</code></td>
              <td>Spinner</td>
              <td>@salt-ds/core</td>
              <td>Loading indicator</td>
            </tr>
            <tr>
              <td><code>Progress</code></td>
              <td>LinearProgress / CircularProgress</td>
              <td>@salt-ds/lab</td>
              <td>Progress bars</td>
            </tr>
            <tr>
              <td><code>Toast</code></td>
              <td>Toast (custom)</td>
              <td>Custom implementation</td>
              <td>Temporary notifications</td>
            </tr>
            <tr>
              <td><code>Tooltip</code></td>
              <td>Tooltip</td>
              <td>@salt-ds/core</td>
              <td>Hover information</td>
            </tr>
            <tr>
              <td><code>Avatar</code></td>
              <td>Custom component</td>
              <td>Custom implementation</td>
              <td>User avatars</td>
            </tr>
          </tbody>
        </table>

        <h3>Usage Example</h3>
        <pre className="docs-code">
{`import {
  LuminoAlert,
  LuminoBadge,
  LuminoSpinner,
  LuminoToast
} from "lumino/adapters/salt";

// Alert
<LuminoAlert status="error" title="Error">
  Something went wrong!
</LuminoAlert>

// Badge
<LuminoBadge value={5} status="info" />

// Spinner
<LuminoSpinner size="medium" />

// Toast (via hook)
import { useToast } from "lumino/react";

const toast = useToast();
toast.show("Saved successfully!", { status: "success" });`}</pre>
      </div>

      <div className="docs-section">
        <h2>Navigation Components</h2>
        <p>
          Additional navigation components not in core interfaces:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Salt Component</th>
              <th>Package</th>
              <th>Use Case</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Menu</code></td>
              <td>NavigationItem</td>
              <td>@salt-ds/core</td>
              <td>Navigation menu</td>
            </tr>
            <tr>
              <td><code>Pagination</code></td>
              <td>Pagination</td>
              <td>@salt-ds/lab</td>
              <td>Page navigation</td>
            </tr>
            <tr>
              <td><code>Stepper</code></td>
              <td>SteppedTracker</td>
              <td>@salt-ds/lab</td>
              <td>Multi-step process</td>
            </tr>
            <tr>
              <td><code>Accordion</code></td>
              <td>Accordion</td>
              <td>@salt-ds/core</td>
              <td>Collapsible sections</td>
            </tr>
          </tbody>
        </table>

        <h3>Usage Example</h3>
        <pre className="docs-code">
{`import {
  LuminoMenu,
  LuminoPagination,
  LuminoStepper
} from "lumino/adapters/salt";

// Menu
<LuminoMenu
  items={[
    { label: "Home", path: "/" },
    { label: "Settings", path: "/settings" }
  ]}
  currentRoute="/settings"
/>

// Pagination
<LuminoPagination
  currentPage={page}
  totalPages={totalPages}
  onPageChange={setPage}
/>

// Stepper
<LuminoStepper
  steps={["Details", "Review", "Confirm"]}
  currentStep={currentStep}
  onStepChange={setCurrentStep}
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Extended Components</h2>
        <p>
          Additional components available in the Salt adapter:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Salt Component</th>
              <th>Package</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>Slider</code></td>
              <td>Slider</td>
              <td>@salt-ds/core</td>
              <td>Range input</td>
            </tr>
            <tr>
              <td><code>FileDropZone</code></td>
              <td>FileDropZone</td>
              <td>@salt-ds/lab</td>
              <td>File upload</td>
            </tr>
            <tr>
              <td><code>Skeleton</code></td>
              <td>Custom skeleton</td>
              <td>Custom implementation</td>
              <td>Loading placeholders</td>
            </tr>
          </tbody>
        </table>

        <h3>Usage Example</h3>
        <pre className="docs-code">
{`import { LuminoSlider, LuminoFileDropZone } from "lumino/adapters/salt";

// Slider
<LuminoSlider
  value={volume}
  onChange={setVolume}
  min={0}
  max={100}
  label="Volume"
/>

// File Drop Zone
<LuminoFileDropZone
  onDrop={handleFileDrop}
  accept=".pdf,.doc,.docx"
  multiple
/>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Typography Components</h2>
        <p>
          Text display components:
        </p>
        <table className="docs-table">
          <thead>
            <tr>
              <th>Component</th>
              <th>Salt Component</th>
              <th>Purpose</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>H1, H2, H3, H4</code></td>
              <td>Text (variant="h1", "h2", etc.)</td>
              <td>Headings</td>
            </tr>
            <tr>
              <td><code>Text</code></td>
              <td>Text</td>
              <td>Body text</td>
            </tr>
            <tr>
              <td><code>Label</code></td>
              <td>Label</td>
              <td>Form labels</td>
            </tr>
          </tbody>
        </table>

        <h3>Usage Example</h3>
        <pre className="docs-code">
{`import { LuminoH1, LuminoH2, LuminoText } from "lumino/adapters/salt";

<LuminoH1>Page Title</LuminoH1>
<LuminoH2>Section Title</LuminoH2>
<LuminoText>Body text content</LuminoText>`}</pre>
      </div>

      <div className="docs-section">
        <h2>Direct Import vs String Reference</h2>
        <p>
          You can use components in two ways:
        </p>

        <h3>1. String Reference (Recommended)</h3>
        <pre className="docs-code">
{`// Resolved by adapter - more portable
this.addField("name")
  .component("TextInput")
  .endField()`}</pre>

        <h3>2. Direct Import</h3>
        <pre className="docs-code">
{`import { LuminoTextInput } from "lumino/adapters/salt";

// Direct reference - more explicit
this.addField("name")
  .component(LuminoTextInput)
  .endField()`}</pre>
      </div>

      <div className="docs-section">
        <h2>Component Props Reference</h2>
        <p>
          All adapter components accept Lumino's standardized props. See individual
          component documentation pages for detailed prop information:
        </p>
        <ul className="docs-list">
          <li><a href="#/fields/text-input">TextInput Props</a></li>
          <li><a href="#/fields/select">Select Props</a></li>
          <li><a href="#/fields/checkbox">Checkbox Props</a></li>
          <li><a href="#/containers/dialog">Dialog Props</a></li>
          <li><a href="#/actions/button">Button Props</a></li>
        </ul>
      </div>

      <div className="docs-section">
        <h2>Next Steps</h2>
        <ul className="docs-list">
          <li>
            <a href="#/adapters/salt-overview">Salt Overview</a> - Architecture and concepts
          </li>
          <li>
            <a href="#/adapters/salt-setup">Salt Setup</a> - Installation guide
          </li>
          <li>
            <a href="https://salt-ds.github.io/salt-ds/" target="_blank" rel="noopener noreferrer">
              Salt DS Docs
            </a> - Official Salt component documentation
          </li>
        </ul>
      </div>
    </div>
  );
}
