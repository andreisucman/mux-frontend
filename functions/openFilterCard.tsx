import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import FilterCardContent from "@/app/GeneralResultsHeader/FilterCardContent";
import ProductsFilterCardContent from "@/app/products/ProductsFilterCardContent";
import RoutinesFilterCardContent from "@/app/routines/RoutinesFilterCardContent";
import HistoryFilterCardContent from "@/app/tasks/history/HistoryFilterCardContent";
import DiaryFilterCardContent from "@/components/DiaryFilterCardContent";
import ClubProgressFilterCardContent from "@/components/PageHeaderClub/ClubProgressFilterCardContent";
import ClubProofFilterCardContent from "@/components/PageHeaderClub/ClubProofFilterCardContent";

export enum FilterCardNamesEnum {
  "ClubProofFilterCardContent" = "ClubProofFilterCardContent",
  "ClubProgressFilterCardContent" = "ClubProgressFilterCardContent",
  "FilterCardContent" = "FilterCardContent",
  "ProductsFilterCardContent" = "ProductsFilterCardContent",
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
    [FilterCardNamesEnum.ProductsFilterCardContent]: (
      <ProductsFilterCardContent {...childrenProps} />
    ),
    [FilterCardNamesEnum.RoutinesFilterCardContent]: (
      <RoutinesFilterCardContent {...childrenProps} />
    ),
    [FilterCardNamesEnum.HistoryFilterCardContent]: <HistoryFilterCardContent {...childrenProps} />,
    [FilterCardNamesEnum.DiaryFilterCardContent]: <DiaryFilterCardContent {...childrenProps} />,
  };

  modals.openContextModal({
    modal: "general",
    title: (
      <Title order={5} component="p">
        Filters
      </Title>
    ),
    centered: true,
    innerProps: cardsMap[cardName],
  });
};

export default openFiltersCard;
