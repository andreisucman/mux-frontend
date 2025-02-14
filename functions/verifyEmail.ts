import openErrorModal from "@/helpers/openErrorModal";
import callTheServer from "./callTheServer";

type VerifyEmailProps = { code: string };

const verifyEmail = async ({ code }: VerifyEmailProps) => {
  let status = false;
  try {
   
  } catch (err) {
    throw err;
  } finally {
    return status;
  }
};

export default verifyEmail;
