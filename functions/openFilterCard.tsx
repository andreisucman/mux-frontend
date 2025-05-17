import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import RoutinesFilterCardContent from "@/app/routines/RoutinesFilterCardContent";
import HistoryFilterCardContent from "@/app/tasks/history/HistoryFilterCardContent";
import DiaryFilterCardContent from "@/components/DiaryFilterCardContent";
import FilterCardContent from "@/components/FilterCardContent/FilterCardContent";
import ClubProgressFilterCardContent from "@/components/PageHeader/ClubProgressFilterCardContent";
import ClubProofFilterCardContent from "@/components/PageHeader/ClubProofFilterCardContent";

export enum FilterCardNamesEnum {
  "ClubProofFilterCardContent" = "ClubProofFilterCardContent",
  "ClubProgressFilterCardContent" = "ClubProgressFilterCardContent",
  "FilterCardContent" = "FilterCardContent",
  "RoutinesFilterCardContent" = "RoutinesFilterCardContent",
  "HistoryFilterCardContent" = "HistoryFilterCardContent",
  "DiaryFilterCardContent" = "DiaryFilterCardContent",
}

type Props = {
  cardName: FilterCardNamesEnum;
  childrenProps?: { [key: string]: any };
};

const openFiltersCard = ({ cardName, childrenProps }: Props) => {
  const cardsMap = {
    [FilterCardNamesEnum.ClubProofFilterCardContent]: (
      <ClubProofFilterCardContent {...childrenProps} />
    ),
    [FilterCardNamesEnum.ClubProgressFilterCardContent]: (
      <ClubProgressFilterCardContent {...childrenProps} />
    ),
    [FilterCardNamesEnum.FilterCardContent]: <FilterCardContent {...childrenProps} />,
    [FilterCardNamesEnum.RoutinesFilterCardContent]: (
      <RoutinesFilterCardContent {...childrenProps} />
    ),
    [FilterCardNamesEnum.HistoryFilterCardContent]: <HistoryFilterCardContent {...childrenProps} />,
    [FilterCardNamesEnum.DiaryFilterCardContent]: <DiaryFilterCardContent {...childrenProps} />,
  };

  modals.openContextModal({
    modal: "general",
    classNames: { overlay: "overlay" },
    title: (
      <Title order={5} component="p">
        Filters
      </Title>
    ),
    centered: true,
    size: "xs",
    innerProps: cardsMap[cardName],
  });
};

export default openFiltersCard;
