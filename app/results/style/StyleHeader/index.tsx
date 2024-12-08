import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IconChevronLeft } from "@tabler/icons-react";
import { ActionIcon, Group, Title } from "@mantine/core";
import { upperFirst } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { outlookStyles } from "@/app/analysis/style/SelectStyleGoalModalContent/outlookStyles";
import FilterButton from "@/components/FilterButton";
import FilterDropdown from "@/components/FilterDropdown";
import { FilterItemType } from "@/components/FilterDropdown/types";
import { typeIcons } from "@/components/PageHeader/data";
import callTheServer from "@/functions/callTheServer";
import getUsersFilters from "@/functions/getUsersFilters";
import TitleDropdown from "../../TitleDropdown";
import StyleFilterContent from "./StyleFilterContent";
import classes from "./StyleHeader.module.css";

type Props = {
  titles: { label: string; value: string }[];
  isDisabled?: boolean;
  showReturn?: boolean;
  onSelect?: (item?: string | null) => void;
};

export default function StyleHeader({ showReturn, isDisabled, titles, onSelect }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [availableTypes, setAvailableTypes] = useState<FilterItemType[]>([]);
  const [availableStyleItems, setAvailableStyleItems] = useState<FilterItemType[]>([]);
  const [styleIconsMap, setStyleIconsMap] = useState<{ [key: string]: any }>();

  const followingUserId = searchParams.get("followingUserId");
  const styleName = searchParams.get("styleName");
  const type = searchParams.get("type");

  useEffect(() => {
    getUsersFilters({ followingUserId, collection: "progress", fields: ["type"] }).then(
      (result) => {
        const { availableTypes } = result;
        setAvailableTypes(availableTypes);
      }
    );
  }, [followingUserId]);

  const handleGetUsersStyleNames = useCallback(
    async (type: string | null, followingUserId: string | null) => {
      try {
        let endpoint = "getUsersStyleNames";

        if (followingUserId) endpoint += `/${followingUserId}`;
        if (type) endpoint += `?type=${type}`;

        const response = await callTheServer({
          endpoint,
          method: "GET",
        });

        if (response.status === 200) {
          if (response.message) {
            const { styleNames } = response.message;

            const styleItems = outlookStyles
              .filter((item) => styleNames.includes(item.name))
              .map((item) => ({ label: upperFirst(item.name), value: item.name }));

            setAvailableStyleItems(styleItems);

            const styleIcons = styleItems.reduce((a: { [key: string]: string }, c) => {
              a[c.value] = outlookStyles.find((item) => item.name === c.value)?.name || ""; // Use optional chaining to handle undefined
              return a;
            }, {});

            setStyleIconsMap(styleIcons);
          }
        }
      } catch (err) {
        console.log("Error in handleGetUsersStyleNames: ", err);
      }
    },
    []
  );

  useEffect(() => {
    handleGetUsersStyleNames(type, followingUserId);
  }, [type, followingUserId]);

  const activeFiltersCount = styleName ? 1 : 0;

  const handleOpenStyleFilters = useCallback(() => {
    modals.openContextModal({
      modal: "general",
      title: (
        <Title order={5} component={"p"}>
          Style filters
        </Title>
      ),
      innerProps: <StyleFilterContent />,
      centered: true,
    });
  }, []);

  return (
    <Group className={classes.container}>
      <Group className={classes.left}>
        {showReturn && (
          <ActionIcon variant="default" onClick={() => router.back()}>
            <IconChevronLeft className="icon" />
          </ActionIcon>
        )}
        <TitleDropdown titles={titles} />
      </Group>
      {!isDisabled && (
        <Group className={classes.right}>
          <FilterButton
            onFilterClick={handleOpenStyleFilters}
            activeFiltersCount={activeFiltersCount}
            isDisabled={isDisabled}
          />
          {availableTypes.length > 0 && (
            <FilterDropdown
              filterType="type"
              data={availableTypes}
              icons={typeIcons}
              defaultSelected={availableTypes.find((item) => item.value === type)?.value}
              onSelect={onSelect}
              placeholder="Select type"
              isDisabled={isDisabled}
              addToQuery
            />
          )}
          {availableStyleItems.length > 0 && (
            <FilterDropdown
              data={availableStyleItems}
              filterType="styleName"
              icons={styleIconsMap}
              defaultSelected={availableStyleItems.find((item) => item.value === styleName)?.value}
              onSelect={onSelect}
              placeholder="Select style"
              isDisabled={isDisabled}
              addToQuery
            />
          )}
        </Group>
      )}
    </Group>
  );
}
