import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

export default async function joinClub() {
  const response = await callTheServer({
    endpoint: "joinClub",
    method: "POST",
  });

  if (response.status === 200) {
    if (response.error) {
      openErrorModal({ description: response.error });
      return;
    }

    return response.message;
  }
}
