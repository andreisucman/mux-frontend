import { IconSearch } from "@tabler/icons-react";
import { SpotlightActionType } from "@/app/solutions/types";
import { normalizeString } from "@/helpers/utils";
import callTheServer from "./callTheServer";

type Props = {
  endpoint: string;
  fields: string[];
  query?: string;
  handleActionClick: (key: string) => void;
};

type Response = {
  actions: SpotlightActionType[];
  data: { [key: string]: any }[];
};

const fetchAutocompleteData = async ({
  handleActionClick,
  endpoint,
  fields,
  query,
}: Props): Promise<Response> => {
  const reply: Response = { actions: [], data: [] };

  try {
    let finalEndpoint = endpoint;

    const parts = [];

    const fieldsString = fields.join(",");

    if (fieldsString) {
      parts.push(`fields=${fieldsString}`);
    }

    if (query) {
      parts.push(`query=${query}`);
    }

    if (parts.length > 0) {
      const queryString = parts.join("&");
      finalEndpoint += `?${queryString}`;
    }

    const response = await callTheServer({
      endpoint: finalEndpoint,
      method: "GET",
    });

    if (response.status === 200) {
      if (response.message) {
        const uniqueValues = new Set();

        for (const field of fields) {
          for (const obj of response.message) {
            if (obj[field]) {
              const values = Array.isArray(obj[field]) ? obj[field] : [obj[field]];
              values.forEach((value) => uniqueValues.add(value));
            }
          }
        }

        for (const value of uniqueValues) {
          reply.actions.push({
            id: value as string,
            label: normalizeString(value as string).toLowerCase(),
            leftSection: <IconSearch className={"icon"} stroke={1.5} />,
            onClick: () => handleActionClick(value as string),
          });
        }

        reply.data = response.message;
      }
    }
  } catch (err) {
  } finally {
    return reply;
  }
};

export default fetchAutocompleteData;
