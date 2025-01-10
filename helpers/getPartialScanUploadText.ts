const getPartialScanUploadText = (distinctUploadedParts: string[]) => {
  if (distinctUploadedParts.length === 0) return "";

  let result = "Analyze ";

  if (distinctUploadedParts.length === 1) {
    result += `${distinctUploadedParts[0]}`;
  } else {
    result += distinctUploadedParts.join(" and ");
  }

  return result;
};

export default getPartialScanUploadText;
