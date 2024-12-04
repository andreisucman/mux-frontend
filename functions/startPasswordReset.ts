import openErrorModal from "@/helpers/openErrorModal";
import openSuccessModal from "@/helpers/openSuccessModal";
import callTheServer from "./callTheServer";

type SendPasswordResetEmailProps = {
  email: string;
};

const sendPasswordResetEmail = async ({ email }: SendPasswordResetEmailProps) => {
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
      openSuccessModal({ description: response.message });
    }
  } catch (err) {
    console.log("Error in sendPasswordResetEmail: ", err);
  }
};

export default sendPasswordResetEmail;
