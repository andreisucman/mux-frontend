import { IconSearch } from "@tabler/icons-react";
import { SpotlightActionType } from "@/app/solutions/types";
import { normalizeString } from "@/helpers/utils";
import callTheServer from "./callTheServer";

type Props = {
  endpoint: string;
  fields: string[];
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
}: Props): Promise<Response> => {
  const reply: Response = { actions: [], data: [] };

  try {
    const fieldsString = fields.join(",");
    const finalEndpoint = `${endpoint}?fields=${fieldsString}`;

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
    console.log("Error in getAutocompleteData: ", err);
  } finally {
    return reply;
  }
};

export default fetchAutocompleteData;
