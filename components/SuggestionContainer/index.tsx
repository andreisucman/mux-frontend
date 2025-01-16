import React from "react";
import { Group, Skeleton, Stack, Text } from "@mantine/core";
import ChatWithModal from "@/app/club/ModerationLayout/ChatWithModal";
import { SuggestionType } from "@/types/global";
import ProductCell from "./ProductCell";
import classes from "./SuggestionContainer.module.css";

type Props = {
  chatContentId: string;
  title?: string;
  taskKey?: string;
  chatTitle?: React.ReactNode;
  showOnCellAtc?: boolean;
  selectedAsins?: string[];
  items: SuggestionType[];
  disableLocalChat?: boolean;
  rowStyles?: { [key: string]: any };
  customStyles?: { [key: string]: any };
  setSelectedAsins?: React.Dispatch<React.SetStateAction<string[]>>;
};

export default function SuggestionContainer({
  title,
  taskKey,
  chatTitle,
  items,
  chatContentId,
  rowStyles,
  disableLocalChat,
  showOnCellAtc,
  selectedAsins,
  customStyles,
  setSelectedAsins,
}: Props) {
  const bestItems = items.filter((item) => item.rank === 1);
  const chosenItems = bestItems.length > 1 ? bestItems : items;

  return (
    <Skeleton className="skeleton" visible={!items}>
      <Stack className={classes.container} style={customStyles ? customStyles : {}}>
        <Stack className={classes.wrapper}>
          {title && (
            <Text c="dimmed" className={classes.title}>
              {title}
            </Text>
          )}
          <Group className={classes.content}>
            <Group className={classes.suggestionRow} style={rowStyles ? rowStyles : {}}>
              {chosenItems?.map((item, index) => (
                <ProductCell
                  key={index}
                  item={item}
                  allItems={items}
                  showOnCellAtc={showOnCellAtc || false}
                  selectedAsins={selectedAsins}
                  setSelectedAsins={setSelectedAsins}
                />
              ))}
            </Group>
          </Group>
        </Stack>

        {!disableLocalChat && (
          <ChatWithModal
            chatCategory="product"
            openChatKey={taskKey}
            modalTitle={chatTitle}
            chatContentId={chatContentId}
            dividerLabel={"Choose best for me"}
            defaultVisibility="closed"
          />
        )}
      </Stack>
    </Skeleton>
  );
}
