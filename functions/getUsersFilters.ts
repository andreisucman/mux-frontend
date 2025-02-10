import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partItems } from "@/components/PageHeader/data";
import callTheServer from "./callTheServer";

type GetUsersFiltersProps = {
  userName?: string | string[];
  collection: string;
  fields?: string[];
};

const getUsersFilters = async ({ userName, collection, fields }: GetUsersFiltersProps) => {
  let result = {
    availableTypes: [] as FilterItemType[],
    availableParts: [] as FilterPartItemType[],
    availableStyleNames: [] as FilterItemType[],
  };
  try {
    if (!collection) throw new Error("Collection is missing");

    let endpoint = "getUsersFilters";

    if (userName) endpoint += `/${userName}`;

    const parts = [];

    if (collection) parts.push(`collection=${collection}`);
    if (fields) parts.push(`fields=${fields.join(",")}`);

    const query = parts.join("&");

    if (query) endpoint += `?${query}`;

    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    if (response.status === 200) {
      const { part, styleName } = response.message || {};

      if (response.message) {
        if (part) {
          result.availableParts = partItems.filter((item) => part.includes(item.value));
        }
        if (styleName) {
          result.availableStyleNames = outlookStyles
            .filter((item) => styleName.includes(item.name))
            .map((rec) => ({ value: rec.name, label: upperFirst(rec.name) }));
        }
      }
    }
  } catch (err) {
  } finally {
    return result;
  }
};

export default getUsersFilters;
