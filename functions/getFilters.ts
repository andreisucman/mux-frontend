import { FilterItemType } from "@/components/FilterDropdown/types";
import { normalizeString } from "@/helpers/utils";
import callTheServer from "./callTheServer";

type GetUsersFiltersProps = {
  userName?: string | string[];
  collection: string;
  fields: string[];
  filter?: string[];
};

const getFilters = async ({ userName, filter, collection, fields }: GetUsersFiltersProps) => {
  let result = fields.reduce((a: { [key: string]: FilterItemType[] }, c) => {
    a[c] = [];
    return a;
  }, {});

  try {
    if (!collection) throw new Error("Collection is missing");

    let endpoint = "getFilters";

    if (userName) endpoint += `/${userName}`;

    const parts = [];

    if (filter) parts.push(...filter);
    if (collection) parts.push(`collection=${collection}`);
    parts.push(`fields=${fields.join(",")}`);

    const query = parts.join("&");

    if (query) endpoint += `?${query}`;

    const response = await callTheServer({
      endpoint,
      method: "GET",
    });

    if (response.status === 200) {
      if (response.message) {
        const data: { [key: string]: string[] } = response.message;

        result = Object.fromEntries(
          Object.entries(data)
            .filter((gr) => Boolean(gr[1]))
            .map(([label, value]) => [
              label,
              value.map((v: string) => ({ label: normalizeString(v), value: v })),
            ])
        );
      }
    }
  } catch (err) {
  } finally {
    return result;
  }
};

export default getFilters;
