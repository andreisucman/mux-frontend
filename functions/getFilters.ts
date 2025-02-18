import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partItems, taskStatuses } from "@/components/PageHeader/data";
import callTheServer from "./callTheServer";

type GetUsersFiltersProps = {
  userName?: string | string[];
  collection: string;
  fields?: string[];
};

const getFilters = async ({ userName, collection, fields }: GetUsersFiltersProps) => {
  let result = {
    availableStatuses: [] as FilterItemType[],
    availableParts: [] as FilterPartItemType[],
  };
  try {
    if (!collection) throw new Error("Collection is missing");

    let endpoint = "getFilters";

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
      const { part, status } = response.message || {};


      if (response.message) {
        if (part) {
          result.availableParts = partItems.filter((item) => part.includes(item.value));
        }

        if (status) {
          result.availableStatuses = taskStatuses.filter((item) => status.includes(item.value));
        }
      }
    }
  } catch (err) {
  } finally {
    return result;
  }
};

export default getFilters;
