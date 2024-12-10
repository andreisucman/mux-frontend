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
      const { type, part } = response.message;

      if (response.message) {
        if (type) {
          result.availableTypes = typeItems.filter((item) => type.includes(item.value));
        }
        if (part) {
          result.availableParts = partItems.filter(
            (item) => part.includes(item.type) && part.includes(item.value)
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
