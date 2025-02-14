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
      const { part } = response.message || {};

      if (response.message) {
        if (part) {
          result.availableParts = partItems.filter((item) => part.includes(item.value));
        }
      }
    }
  } catch (err) {
  } finally {
    return result;
  }
};

export default getUsersFilters;
