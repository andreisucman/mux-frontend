import { modals } from "@mantine/modals";
import callTheServer from "./callTheServer";

type Props = {
  subscriptionName: "improvement" | "advisor" | "analyst" | "peek";
  cb?: (...args: any) => void;
};

export default async function startSubscriptionTrial({ subscriptionName, cb }: Props) {
  try {
    const response = await callTheServer({
      endpoint: "startSubscriptionTrial",
      method: "POST",
      body: { subscriptionName },
    });

    if (response.status === 200) {
      modals.closeAll();
      if (cb) cb(true, true);
    }
  } catch (err) {
    console.log("Error in startSubscriptionTrial: ", err);
  }
}
