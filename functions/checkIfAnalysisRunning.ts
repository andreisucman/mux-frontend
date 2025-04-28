import callTheServer from "./callTheServer";

type Props = {
  userId: string;
  operationKey: string;
  setShowWaitComponent: (verdict?: boolean) => void;
};

export default async function checkIfAnalysisRunning({
  userId,
  operationKey,
  setShowWaitComponent,
}: Props) {
  return callTheServer({
    endpoint: "checkAnalysisCompletion",
    method: "POST",
    body: { userId, operationKey },
  }).then((res) => {
    if (res.status === 200) {
      const { isRunning } = res.message || {};
      setShowWaitComponent(isRunning);
    }
  });
}
