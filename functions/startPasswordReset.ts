import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import callTheServer from "./callTheServer";

type SendPasswordResetEmailProps = {
  email: string;
};

const sendPasswordResetEmail = async ({ email }: SendPasswordResetEmailProps) => {
  let status = false;
  try {
    const response = await callTheServer({
      endpoint: "sendPasswordResetEmail",
      method: "POST",
      body: { email },
    });

    if (response.status === 200) {
      if (response.error) {
        openErrorModal({ description: response.error });
        return;
      }
      status = true;
      openSuccessModal({ title: "✔️ Check your email", description: response.message });
    }
  } catch (err) {
  } finally {
    return status;
  }
};

export default sendPasswordResetEmail;
