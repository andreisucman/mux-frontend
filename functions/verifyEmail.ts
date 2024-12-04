import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import callTheServer from "./callTheServer";

type VerifyEmailProps = { code: string };

const verifyEmail = async ({ code }: VerifyEmailProps) => {
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

      openSuccessModal({ description: response.message });
    }
  } catch (err) {
    openErrorModal();
  }
};

export default verifyEmail;
