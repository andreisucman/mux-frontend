import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { IconCircleMinus, IconCirclePlus, IconGripVertical } from "@tabler/icons-react";
import cx from "clsx";
import { ActionIcon, Group, rem, Text } from "@mantine/core";
import { useListState, useShallowEffect } from "@mantine/hooks";
import { normalizeString } from "@/helpers/utils";
import { UserConcernType } from "@/types/global";
import classes from "./DragAndDrop.module.css";

type Props = {
  disabled?: boolean;
  data: UserConcernType[];
  onUpdate: (newState: UserConcernType[]) => void;
  handleUpdateConcern: (updatedConcern: UserConcernType) => void;
};

export default function DragAndDrop({ data, disabled, onUpdate, handleUpdateConcern }: Props) {
  const [state, handlers] = useListState(data);

  useShallowEffect(() => {
    handlers.setState(data);
  }, [data]);

  const items = state.map((item, index) => (
    <Draggable key={item.name} index={index} draggableId={item.name} isDragDisabled={disabled}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, {
            [classes.itemDragging]: snapshot.isDragging,
            [classes.disabled]: item.isDisabled,
          })}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          <Group wrap="nowrap" gap={0}>
            <div
              className={cx(classes.handle, {
                [classes.disabled]: item.isDisabled,
              })}
            >
              <IconGripVertical style={{ marginRight: rem(6) }} />
              <Text className={classes.symbol}>{index + 1}</Text>
            </div>
            <div
              className={cx({
                [classes.disabled]: item.isDisabled,
              })}
            >
              <Text>{normalizeString(item.name)}</Text>
              <Text size="sm" c="dimmed" lineClamp={2}>
                {item.explanation}
              </Text>
            </div>
          </Group>

          <ActionIcon
            variant="default"
            disabled={disabled}
            mt={rem(4)}
            onClick={() => {
              handleUpdateConcern({ ...item, isDisabled: !item.isDisabled });
            }}
          >
            {item.isDisabled ? <IconCirclePlus /> : <IconCircleMinus />}
          </ActionIcon>
        </div>
      )}
    </Draggable>
  ));

  return (
    <DragDropContext
      onDragEnd={({ destination, source }) => {
        if (!destination) return;
        const reorderedItems = Array.from(state);
        const [removed] = reorderedItems.splice(source.index, 1);
        reorderedItems.splice(destination.index, 0, removed);

        handlers.setState(reorderedItems);
        onUpdate(
          reorderedItems.map((item, index) => ({
            ...item,
            importance: index + 1,
          }))
        );
      }}
    >
      <Droppable droppableId="dnd-list" direction="vertical" isDropDisabled={disabled}>
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className={classes.container}>
            {items}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
