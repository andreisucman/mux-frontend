import { ClientJS } from "clientjs";
import callTheServer from "./callTheServer";

const registerView = async (
  part: string | null,
  concern: string | null,
  page: string,
  userName: string | null
) => {
  const fingerprint = new ClientJS().getFingerprint();

  callTheServer({
    endpoint: "registerView",
    method: "POST",
    body: { fingerprint, part, concern, page, userName },
  });
};

export default registerView;
