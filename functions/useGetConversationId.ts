import { useEffect, useState } from "react";
import { getFromIndexedDb } from "@/helpers/indexedDb";

type Props = {
  chatCategory?: string;
  chatContentId?: string;
};

export default function useGetConversationId({ chatCategory, chatContentId }: Props) {
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    if (!chatCategory || !chatContentId) return;

    getFromIndexedDb("conversationId").then((record) => {
      if (record) {
        setConversationId(record[`${chatCategory}-${chatContentId}`]);
      }
    });
  }, [chatCategory, chatContentId]);

  return conversationId;
}
