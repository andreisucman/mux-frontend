import { useEffect, useState } from "react";
import { getFromIndexedDb } from "@/helpers/indexedDb";

type Props = {
  chatCategory?: string;
  chatContentId?: string;
};

export default function useGetConversationId({ chatCategory, chatContentId }: Props) {
  const [conversationId, setConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!chatCategory || !chatContentId) return;

    getFromIndexedDb(`conversationId-${chatContentId || chatCategory}`).then((id) => {
      if (chatContentId || chatCategory) {
        setConversationId(id);
      }
    });
  }, [chatCategory, chatContentId]);

  return { conversationId, setConversationId };
}
