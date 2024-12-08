import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partItems, typeItems } from "@/components/PageHeader/data";
import callTheServer from "./callTheServer";

type GetUsersFiltersProps = {
  followingUserId: string | null;
  collection: string;
  fields?: string[];
};

const getUsersFilters = async ({ followingUserId, collection, fields }: GetUsersFiltersProps) => {
  let result = {
    availableTypes: [] as FilterItemType[],
    availableParts: [] as FilterPartItemType[],
  };
  try {
    if (!collection) throw new Error("Collection is missing");

    let endpoint = "getUsersFilters";

    if (followingUserId) endpoint += `/${followingUserId}`;

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
      if (response.message) {
        const { type: types, part: parts } = response.mesage;
        if (types) {
          result.availableTypes = typeItems.filter((item) => types.includes(item.value));
        }
        if (parts) {
          result.availableParts = partItems.filter(
            (item) => types.includes(item.type) && parts.includes(item.value)
          );
        }
      }
    }
  } catch (err) {
    console.log("Error in getUsersFilters: ", err);
  } finally {
    return result;
  }
};

export default getUsersFilters;
