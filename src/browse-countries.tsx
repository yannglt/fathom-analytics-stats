import { getPreferenceValues, List, Icon } from "@raycast/api";
import { useFetch } from "@raycast/utils";
import { useState } from "react";
import PeriodDropdown from "./components/PeriodDropdown";
import { countryMapping } from "./countryMapping";

interface Preferences {
  apiToken: string;
  siteId: string;
}

type Referrer = {
  pageviews: string;
  country_code: string;
};

type Data = Referrer[];

export default function Command() {
  const preferences = getPreferenceValues<Preferences>();
  const [dateFrom, setDateFrom] = useState<string>("");

  const { data, isLoading } = useFetch<Data>(
    `https://api.usefathom.com/v1/aggregations?entity_id=${
      preferences.siteId
    }&entity=pageview&aggregates=pageviews&field_grouping=country_code&sort_by=pageviews:desc${
      dateFrom ? `&date_from=${dateFrom}` : ""
    }`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${preferences.apiToken}`,
      },
    },
  );

  return (
    <List
      isLoading={isLoading}
      navigationTitle="Change time period"
      searchBarPlaceholder="Search devices"
      searchBarAccessory={<PeriodDropdown setDateFrom={setDateFrom} />}
    >
      {data?.map((referrer) => (
        <List.Item
          key={referrer.country_code}
          title={countryMapping[referrer.country_code] || referrer.country_code}
          accessories={[{ text: referrer.pageviews.toLocaleString() }, { icon: Icon.TwoPeople }]}
        />
      ))}
    </List>
  );
}
