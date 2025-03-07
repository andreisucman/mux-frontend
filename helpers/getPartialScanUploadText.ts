const getPartialScanUploadText = (distinctUploadedParts: string[]) => {
  if (distinctUploadedParts.length === 0) return "";

  let result = "Analyze ";
  const length = distinctUploadedParts.length;

  if (length === 1) {
    result += distinctUploadedParts[0];
  } else if (length === 2) {
    result += distinctUploadedParts.join(" and ");
  } else {
    const firstParts = distinctUploadedParts.slice(0, -1).join(", ");
    const lastPart = distinctUploadedParts[length - 1];
    result += length === 3 ? `${firstParts}, and ${lastPart}` : `${firstParts} and ${lastPart}`;
  }

  return result;
};

export default getPartialScanUploadText;
