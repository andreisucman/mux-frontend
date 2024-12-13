import { upperFirst } from "@mantine/hooks";

const getPartialScanUploadText = (distinctUploadedParts: string[]) => {
  if (distinctUploadedParts.length === 0) return "";

  let result = "Analyze the ";

  if (distinctUploadedParts.length === 1) {
    result += `${upperFirst(distinctUploadedParts[0])}`;
  } else {
    result += distinctUploadedParts.join(" and ");
  }

  result += ".";

  return result;
};

export default getPartialScanUploadText;
