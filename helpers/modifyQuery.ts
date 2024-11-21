type QueryParam = {
  name: string;
  value?: string | string[] | unknown[] | null;
  action: "add" | "delete" | "deleteByValue" | "replace" | "replaceAll" | any;
};

type ModifyQueryParams = {
  params: QueryParam[];
};

export default function modifyQuery({ params }: ModifyQueryParams) {
  if (typeof window === "undefined") return;

  try {
    const initialParams = new URLSearchParams(window.location.search);
    let resultParams = new URLSearchParams(initialParams);

    params.forEach(({ name, value, action }) => {
      switch (action) {
        case "add":
          if (Array.isArray(value)) {
            value.forEach((val) => {
              if (val) resultParams.append(name, val as string);
            });
          } else {
            resultParams.set(name, value as string);
          }
          break;
        case "delete":
          resultParams.delete(name);
          break;
        case "deleteByValue":
          if (value) {
            resultParams = new URLSearchParams(
              deleteFromQuery(name, value as string, resultParams)
            );
          }
          break;
        case "replace":
          resultParams.delete(name);
          if (Array.isArray(value)) {
            value.forEach((val) => {
              if (val) resultParams.append(name, val as string);
            });
          } else {
            resultParams.set(name, value as string);
          }
          break;
        case "replaceAll":
          resultParams.delete(name);
          if (Array.isArray(value)) {
            value.forEach((val) => {
              if (val) resultParams.append(name, val as string);
            });
          } else if (value) {
            resultParams.append(name, value as string);
          }
          break;
        default:
          break;
      }
    });
    return resultParams.toString();
  } catch (err) {
    console.log("Error in modifyQuery: ", err);
  }
}

function deleteFromQuery(
  nameToDelete: string,
  valueToDelete: string | null,
  searchParams: URLSearchParams
) {
  const params = new URLSearchParams(searchParams.toString());
  const newParams = new URLSearchParams();

  //@ts-ignore
  for (const [name, value] of params) {
    if (!(name === nameToDelete && value === valueToDelete)) {
      newParams.append(name, value);
    }
  }

  return newParams.toString();
}
