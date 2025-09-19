# DatePickerComponent

A lightweight, dependency‑free React date picker used in HRnet. It supports:
- Date selection
- Optional time selection (hours and minutes)
- Minimum and maximum selectable dates
- Keyboard- and mouse-friendly interactions

## Installation
This component is part of the HRnet app. Import and use it directly in your React codebase.

```tsx
import { DatePickerComponent } from "date-picker-module-kihak12";
import 'date-picker-module-kihak12/dist/date-picker-react.css';
```

## Basic Usage
```tsx
const [date, setDate] = useState(new Date());

<DatePickerComponent
  selectedDate={date}
  onChange={setDate}
/>
```

The input is read-only; clicking it toggles the calendar popover. Selecting a day will call `onChange` with a JavaScript Date instance.

## Props
- selectedDate: Date (required)
  The currently selected value shown by the input and calendar.
- onChange: (date: Date) => void (required)
  Callback fired when the user selects a new date or changes time.
- timeSelect?: boolean (optional, default: false)
  When true, the calendar shows hour and minute numeric inputs (24h).
- minDate?: Date (optional)
  Days before this date are disabled and not selectable.
- maxDate?: Date (optional)
  Days after this date are disabled and not selectable.

## Variations and Examples

1) Date only
```tsx
<DatePickerComponent
  selectedDate={date}
  onChange={setDate}
/>
```

2) Date with time selection
```tsx
<DatePickerComponent
  selectedDate={dateTime}
  onChange={setDateTime}
  timeSelect={true}
/>
```
- Changing the day preserves the currently selected hours and minutes.

3) With min and max bounds
```tsx
<DatePickerComponent
  selectedDate={boundedDate}
  onChange={setBoundedDate}
  minDate={new Date("2025-07-07")}
  maxDate={new Date("2025-08-07")}
/>
```
- Days outside the range are disabled and not clickable.

## Formatting and Locale
- The displayed value uses the French locale (fr-FR):
  - Date: DD/MM/YYYY
  - Time (when enabled): HH:MM
- You can format or store the selected date as needed, e.g. `date.toISOString()`.

## Accessibility and Behavior
- The popover closes when clicking outside.
- Today and the selected day are visually highlighted.
- Disabled days are visually distinct and not selectable.

## Styling
- Styles are defined in `DatePickerComponent.module.css`.
- You can override styles by adjusting that file or wrapping the component.

## Assets
- Navigation arrows use `/assets/side-arrow.svg`. Ensure this asset is available in your public/assets folder.

## Example in context
See Home.tsx where two pickers are used:
- A bounded date of birth picker
- A start date picker with time selection

```tsx
<DatePickerComponent
  selectedDate={dateOfBirth}
  onChange={setDateOfBirth}
  minDate={new Date('2025-07-07')}
  maxDate={new Date('2025-08-07')}
/>

<DatePickerComponent
  selectedDate={startDate}
  onChange={setStartDate}
  timeSelect={true}
/>
```

## Utility Tips
- Persist only what you need: date-only fields can be normalized to midnight and saved as YYYY-MM-DD.
- When `timeSelect` is enabled, switching the day keeps the selected time intact.
- To constrain to future dates only: set `minDate={new Date()}`.
