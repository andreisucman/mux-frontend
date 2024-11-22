import callTheServer from "./callTheServer";

type State = {
  redirectTo?: string;
  localUserId?: string;
  trackedUserId?: string;
};

export default async function signIn(state?: State) {
  try {
    let url = "authorize";

    if (state) {
      const encoded = encodeURIComponent(JSON.stringify(state));
      url += `?state=${encoded}`;
    }

    const response = await callTheServer({
      endpoint: url,
      method: "GET",
    });

    if (response?.status === 200) {
      window.location.href = response.message;
    }
  } catch (err) {
    console.log("Error in signIn: ", err);
  }
}
