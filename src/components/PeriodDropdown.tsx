import { List } from "@raycast/api";

interface TimePeriod {
  id: string;
  title: string;
  value: string;
}

interface PeriodDropdownProps {
  timePeriods: TimePeriod[];
  onTimePeriodChange: (newValue: string) => void;
}

export default function PeriodDropdown(props: PeriodDropdownProps) {
  const { timePeriods, onTimePeriodChange } = props;

  const handleTimePeriodChange = (newValue: string) => {
    if (newValue !== "") {
      onTimePeriodChange(newValue);
    }
  };

  return (
    <List.Dropdown tooltip="Choose a time period" storeValue={true} onChange={handleTimePeriodChange}>
      {timePeriods.map((timePeriod) => (
        <List.Dropdown.Item key={timePeriod.id} title={timePeriod.title} value={timePeriod.value} />
      ))}
    </List.Dropdown>
  );
}
