import { PartEnum } from "@/types/global";
import callTheServer from "./callTheServer";

type Props = { part: PartEnum; concern: string; userName: string; page: string };

const recordView = async (props: Props) => {
  const { part, concern, userName, page } = props;

  if (!part || !concern) return;

  try {
    const { ClientJS } = await import("clientjs");
    const fingerprint = new ClientJS().getFingerprint();

    await callTheServer({
      endpoint: "registerView",
      method: "POST",
      body: { fingerprint, userName, part, concern, page },
    });
  } catch (err) {}
};

export default recordView;
