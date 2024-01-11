import { getPreferenceValues, List, Icon } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";

interface Preferences {
  apiToken: string;
  siteId: string;
}

type Referrer = {
  pageviews: string;
  device_type: string;
};

type Data = Referrer[];

type TimePeriod = { id: string; title: string; value: string };

function PeriodDropdown(props: { timePeriods: TimePeriod[]; onTimePeriodChange: (newValue: string) => void }) {
  const { timePeriods, onTimePeriodChange } = props;
  return (
    <List.Dropdown
      tooltip="Choose a time period"
      storeValue={true}
      onChange={(newValue) => {
        if (newValue !== "") {
          onTimePeriodChange(newValue);
        }
      }}
    >
      {timePeriods.map((timePeriod) => (
        <List.Dropdown.Item key={timePeriod.id} title={timePeriod.title} value={timePeriod.value} />
      ))}
    </List.Dropdown>
  );
}

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [dateFrom, setDateFrom] = useState<string>("");

  const { data, isLoading } = useFetch<Data>(
    `https://api.usefathom.com/v1/aggregations?entity_id=${
      preferences.siteId
    }&entity=pageview&aggregates=pageviews&field_grouping=device_type&sort_by=pageviews:desc${
      dateFrom ? `&date_from=${dateFrom}` : ""
    }`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${preferences.apiToken}`,
      },
    },
  );

  const timePeriods: TimePeriod[] = [
    { id: "1", title: "Today", value: getCurrentDate() },
    { id: "2", title: "Yesterday", value: getPreviousDate(1) },
    { id: "3", title: "Last 7 Days", value: getPreviousDate(7) },
    { id: "4", title: "Last 30 Days", value: getPreviousDate(30) },
    { id: "5", title: "Last 365 Days", value: getPreviousDate(365) },
    { id: "6", title: "This Month", value: getCurrentMonthStartDate() },
    { id: "7", title: "Last Month", value: getPreviousMonthStartDate() },
    { id: "8", title: "This Year", value: getCurrentYearStartDate() },
    { id: "9", title: "Last Year", value: getPreviousYearStartDate() },
    { id: "10", title: "All Time", value: "" },
  ];

  function getCurrentDate() {
    const currentDate = new Date();
    return formatDate(currentDate);
  }

  function getPreviousDate(days: number) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - days);
    return formatDate(currentDate);
  }

  function getCurrentMonthStartDate() {
    const currentDate = new Date();
    const currentMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    return formatDate(currentMonthStartDate);
  }

  function getPreviousMonthStartDate() {
    const currentDate = new Date();
    const previousMonthStartDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    return formatDate(previousMonthStartDate);
  }

  function getCurrentYearStartDate() {
    const currentDate = new Date();
    const currentYearStartDate = new Date(currentDate.getFullYear(), 0, 1);
    return formatDate(currentYearStartDate);
  }

  function getPreviousYearStartDate() {
    const currentDate = new Date();
    const previousYearStartDate = new Date(currentDate.getFullYear() - 1, 0, 1);
    return formatDate(previousYearStartDate);
  }

  function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const onTimePeriodChange = (newValue: string) => {
    setDateFrom(newValue);
  };

  return (
    <List
      isLoading={isLoading}
      navigationTitle="Change time period"
      searchBarPlaceholder="Search devices"
      searchBarAccessory={<PeriodDropdown timePeriods={timePeriods} onTimePeriodChange={onTimePeriodChange} />}
    >
      {data?.map((referrer) => (
        <List.Item
          key={referrer.device_type}
          title={referrer.device_type}
          accessories={[{ text: referrer.pageviews.toLocaleString() }, { icon: Icon.TwoPeople }]}
        />
      ))}
    </List>
  );
}
