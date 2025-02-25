import React from "react";
import { Skeleton, Stack, Text } from "@mantine/core";
import { ChatCategoryEnum } from "@/app/diary/type";
import ChatWithModal from "@/components/ChatWithModal";
import { SuggestionType } from "@/types/global";
import HorizontalScrollRow from "../ProductModalBody/HorizontalScrollRow";
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
  return (
    <Skeleton className="skeleton" visible={!items}>
      <Stack className={classes.container} style={customStyles ? customStyles : {}}>
        <Stack className={classes.wrapper}>
          {title && (
            <Text c="dimmed" className={classes.title}>
              {title}
            </Text>
          )}
          <HorizontalScrollRow
            customWrapperStyles={rowStyles}
            children={items?.map((item, index) => (
              <ProductCell
                key={index}
                item={item}
                items={items}
                showOnCellAtc={showOnCellAtc || false}
                selectedAsins={selectedAsins}
                setSelectedAsins={setSelectedAsins}
              />
            ))}
          />
        </Stack>
        {!disableLocalChat && (
          <ChatWithModal
            chatCategory={ChatCategoryEnum.PRODUCT}
            openChatKey={taskKey}
            modalTitle={chatTitle}
            chatContentId={chatContentId}
            defaultVisibility="open"
            hideDivider
          />
        )}
      </Stack>
    </Skeleton>
  );
}
