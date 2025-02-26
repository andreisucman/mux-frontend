import { Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import ClubProgressFilterCardContent from "@/app/club/progress/ClubProgressHeader/ClubProgressFilterCardContent";
import ClubProofFilterCardContent from "@/app/club/proof/ClubProofHeader/ClubProofFilterCardContent";
import FilterCardContent from "@/app/GeneralResultsHeader/FilterCardContent";
import ProductsFilterCardContent from "@/app/products/ProductsFilterCardContent";
import RoutinesFilterCardContent from "@/app/routines/RoutinesFilterCardContent";

export enum FilterCardNamesEnum {
  "ClubProofFilterCardContent" = "ClubProofFilterCardContent",
  "ClubProgressFilterCardContent" = "ClubProgressFilterCardContent",
  "FilterCardContent" = "FilterCardContent",
  "ProductsFilterCardContent" = "ProductsFilterCardContent",
  "RoutinesFilterCardContent" = "RoutinesFilterCardContent",
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
