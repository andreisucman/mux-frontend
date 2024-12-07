import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type VerifyEmailProps = { code: string };

const verifyEmail = async ({ code }: VerifyEmailProps) => {
  let status = false;
  try {
    const response = await callTheServer({
      endpoint: "verifyEmail",
      method: "POST",
      body: { code },
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        return;
      }

      status = response.message;
    }
  } catch (err) {
    openErrorModal();
  } finally {
    return status;
  }
};

export default verifyEmail;
