import { upperFirst } from "@mantine/hooks";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import { FilterItemType, FilterPartItemType } from "@/components/FilterDropdown/types";
import { partItems, typeItems } from "@/components/PageHeader/data";
import callTheServer from "./callTheServer";

type GetUsersFiltersProps = {
  followingUserId: string | null;
  collection: string;
  fields?: string[];
  type?: string | null;
};

const getUsersFilters = async ({
  followingUserId,
  type,
  collection,
  fields,
}: GetUsersFiltersProps) => {
  let result = {
    availableTypes: [] as FilterItemType[],
    availableParts: [] as FilterPartItemType[],
    availableStyleNames: [] as FilterItemType[],
  };
  try {
    if (!collection) throw new Error("Collection is missing");

    let endpoint = "getUsersFilters";

    if (followingUserId) endpoint += `/${followingUserId}`;

    const parts = [];

    if (collection) parts.push(`collection=${collection}`);
    if (fields) parts.push(`fields=${fields.join(",")}`);
    if (type) parts.push(`type=${type}`);

    const query = parts.join("&");

    if (query) endpoint += `?${query}`;

    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    if (response.status === 200) {
      const { type, part, styleName } = response.message || {};

      if (response.message) {
        if (type) {
          result.availableTypes = typeItems.filter((item) => type.includes(item.value));
        }
        if (part) {
          result.availableParts = partItems.filter(
            (item) => type.includes(item.type) && part.includes(item.value)
          );
        }
        if (styleName) {
          result.availableStyleNames = outlookStyles
            .filter((item) => styleName.includes(item.name))
            .map((rec) => ({ value: rec.name, label: upperFirst(rec.name) }));
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
