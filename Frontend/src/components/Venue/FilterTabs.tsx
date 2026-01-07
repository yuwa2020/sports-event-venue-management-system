import React from "react";
import { Tabs, Tab, createTheme, ThemeProvider } from "@mui/material";
import { useTranslation } from "react-i18next";

// The order here defines the tab indices (0 = "all", 1 = "today", etc.)
const filterOptions = ["all", "today", "tomorrow", "weekend", "free"];



interface FilterTabsProps {
  filter: string;
  onChange: (newFilter: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ filter, onChange }) => {
  const { t } = useTranslation();
  // Determine which tab is active based on `filter`
  const currentIndex = filterOptions.indexOf(filter);

  const handleTabChange = (_event: React.SyntheticEvent, newIndex: number) => {
    // Map the tab index back to the filter string
    onChange(filterOptions[newIndex]);
  };

  return (
    <Tabs
      value={currentIndex === -1 ? 0 : currentIndex}
      onChange={handleTabChange}
      textColor="secondary"
      indicatorColor="secondary"
      variant="scrollable" // or "standard" / "fullWidth"
      scrollButtons="auto"
      sx={{
        mb: 4,
        "& .MuiTab-root": {
          textTransform: "none",
          borderRadius: 2,
          transition: "background-color 0.3s ease",
          mr: 2,
        },
      }}
    >
      <Tab label={t("components.filterTabs.all")} />
      <Tab label={t("components.filterTabs.today")} />
      <Tab label={t("components.filterTabs.tomorrow")} />
      <Tab label={t("components.filterTabs.weekend")} />
      <Tab label={t("components.filterTabs.free")} />
    </Tabs>
  );
};

export default FilterTabs;
