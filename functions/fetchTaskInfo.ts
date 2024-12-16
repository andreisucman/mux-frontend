import callTheServer from "./callTheServer";

export default async function fetchTaskInfo(taskId: string | null) {
  if (!taskId) return;

  try {
    const response = await callTheServer({
      endpoint: `getTaskInfo/${taskId}`,
      method: "GET",
    });

    if (response.status !== 200) {
      throw new Error(response.error);
    }

    return response.message;
  } catch (err: any) {
    console.log("Error in fetchTaskInfo: ", err);
  }
}
