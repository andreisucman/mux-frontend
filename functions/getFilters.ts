import { FilterItemType } from "@/components/FilterDropdown/types";
import { partItems, taskStatuses } from "@/components/PageHeader/data";
import { normalizeString } from "@/helpers/utils";
import callTheServer from "./callTheServer";

type GetUsersFiltersProps = {
  userName?: string | string[];
  collection: string;
  fields?: string[];
  filter?: string[];
};

const getFilters = async ({ userName, filter, collection, fields }: GetUsersFiltersProps) => {
  let result = {
    availableStatuses: [] as FilterItemType[],
    availableParts: [] as FilterItemType[],
    availableConcerns: [] as FilterItemType[],
  };
  try {
    if (!collection) throw new Error("Collection is missing");

    let endpoint = "getFilters";

    if (userName) endpoint += `/${userName}`;

    const parts = [];

    if (filter) parts.push(...filter);
    if (collection) parts.push(`collection=${collection}`);
    if (fields) parts.push(`fields=${fields.join(",")}`);

    const query = parts.join("&");

    if (query) endpoint += `?${query}`;

    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    if (response.status === 200) {
      const { concern, part, status } = response.message || {};

      if (response.message) {
        console.log(" response.message", response.message);
        if (part) {
          result.availableParts = partItems.filter((item) => part.includes(item.value));
        }

        console.log("concern 49", concern);
        if (concern) {
          result.availableConcerns = concern.map((c: string) => ({
            value: c,
            label: normalizeString(c),
          }));
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
