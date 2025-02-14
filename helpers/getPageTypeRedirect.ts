export default function getPageTypeRedirect(value: string, userName?: string | string[]) {
  if (typeof userName !== "string") return "";

  let path = "";

  switch (value) {
    case "about":
      path = `/club/${userName}`;
      break;
    case "diary":
      path = `/club/diary/${userName}`;
      break;
    case "routines":
      path = `/club/routines/${userName}`;
      break;
    case "progress":
      path = `/club/progress/${userName}`;
      break;
    case "proof":
      path = `/club/proof/${userName}`;
      break;
    case "answers":
      path = `/club/answers/${userName}`;
      break;
  }

  return path;
}
