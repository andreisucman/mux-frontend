import callTheServer from "./callTheServer";

export default async function fetchTaskInfo(taskId: string | null) {
  if (!taskId) return;

  try {
    const response = await callTheServer({
      endpoint: `getTaskInfo/${taskId}`,
      method: "GET",
    });
    

    if (!response.message) {
      window.location.replace("/tasks");
      return;
    }

    return response.message;
  } catch (err: any) {}
}
