/**
 * Lumino Framework - Salt Field Adapter
 *
 * Maps Lumino field interfaces to Salt DS components.
 * All components use "Lumino" prefix for consistency.
 */

import type { IFieldAdapter } from "../../../core/adapters";

// Import field components
import { LuminoTextInput } from "./TextInput";
import { LuminoNumberInput } from "./NumberInput";
import { LuminoTextArea } from "./TextArea";
import { LuminoCheckbox } from "./Checkbox";
import { LuminoCheckboxGroup } from "./CheckboxGroup";
import { LuminoSwitch } from "./Switch";
import { LuminoRadioGroup } from "./RadioGroup";
import { LuminoSelect } from "./Select";
import { LuminoMultiSelect } from "./MultiSelect";
import { LuminoAutocomplete } from "./Autocomplete";
import { LuminoDatePicker } from "./DatePicker";
import { LuminoTimePicker } from "./TimePicker";
import { LuminoSlider } from "./Slider";
import { LuminoFileDropZone } from "./FileDropZone";

/**
 * Salt Field Adapter
 */
export const saltFieldAdapter: IFieldAdapter = {
  TextInput: LuminoTextInput as any,
  NumberInput: LuminoNumberInput as any,
  TextArea: LuminoTextArea as any,
  Checkbox: LuminoCheckbox as any,
  CheckboxGroup: LuminoCheckboxGroup as any,
  Switch: LuminoSwitch as any,
  RadioGroup: LuminoRadioGroup as any,
  Select: LuminoSelect as any,
  MultiSelect: LuminoMultiSelect as any,
  Autocomplete: LuminoAutocomplete as any,
  DatePicker: LuminoDatePicker as any,
  TimePicker: LuminoTimePicker as any,
};

// Re-export individual components
export { LuminoTextInput } from "./TextInput";
export { LuminoNumberInput } from "./NumberInput";
export { LuminoTextArea } from "./TextArea";
export { LuminoCheckbox } from "./Checkbox";
export { LuminoCheckboxGroup } from "./CheckboxGroup";
export { LuminoSwitch } from "./Switch";
export { LuminoRadioGroup } from "./RadioGroup";
export { LuminoSelect } from "./Select";
export { LuminoMultiSelect } from "./MultiSelect";
export { LuminoAutocomplete } from "./Autocomplete";
export { LuminoDatePicker } from "./DatePicker";
export { LuminoTimePicker } from "./TimePicker";
export { LuminoSlider } from "./Slider";
export { LuminoFileDropZone } from "./FileDropZone";

/**
 * Extended field components (not part of IFieldAdapter but available for use)
 */
export const saltExtendedFieldComponents = {
  Slider: LuminoSlider,
  FileDropZone: LuminoFileDropZone,
};

// Legacy aliases for backward compatibility
export { LuminoTextInput as SaltTextInput } from "./TextInput";
export { LuminoNumberInput as SaltNumberInput } from "./NumberInput";
export { LuminoTextArea as SaltTextArea } from "./TextArea";
export { LuminoCheckbox as SaltCheckbox } from "./Checkbox";
export { LuminoCheckboxGroup as SaltCheckboxGroup } from "./CheckboxGroup";
export { LuminoSwitch as SaltSwitch } from "./Switch";
export { LuminoRadioGroup as SaltRadioGroup } from "./RadioGroup";
export { LuminoSelect as SaltSelect } from "./Select";
export { LuminoMultiSelect as SaltMultiSelect } from "./MultiSelect";
export { LuminoAutocomplete as SaltAutocomplete } from "./Autocomplete";
export { LuminoDatePicker as SaltDatePicker } from "./DatePicker";
export { LuminoTimePicker as SaltTimePicker } from "./TimePicker";
export { LuminoSlider as SaltSlider } from "./Slider";
export { LuminoFileDropZone as SaltFileDropZone } from "./FileDropZone";
