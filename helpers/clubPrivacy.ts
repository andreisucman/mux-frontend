import { ClubDataType, HeadValuePartsBoolean } from "@/types/global";

type UpdateClubPrivacyProps = {
  club: ClubDataType | null;
  category: string;
  type?: string;
  value: boolean;
};

export function updateClubPrivacy({ club, type, category, value }: UpdateClubPrivacyProps) {
  try {
    const { privacy } = club || {};

    if (!privacy) return;

    const relevantCategoryPrivacyIndex = privacy.findIndex((rec) => rec.name === category);

    if (relevantCategoryPrivacyIndex === -1) return club;

    let relevantCategoryPrivacy = privacy[relevantCategoryPrivacyIndex];
    let updatedTypes;

    if (type) {
      const relevantTypePrivacyIndex = relevantCategoryPrivacy.types.findIndex(
        (rec) => rec.name === type
      );

      if (relevantTypePrivacyIndex === -1) return club;

      const updatedPartPrivacy = {
        ...relevantCategoryPrivacy.types[relevantTypePrivacyIndex],
        value,
      };

      updatedTypes = [
        ...relevantCategoryPrivacy.types.slice(0, relevantTypePrivacyIndex),
        updatedPartPrivacy,
        ...relevantCategoryPrivacy.types.slice(relevantTypePrivacyIndex + 1),
      ];

      relevantCategoryPrivacy = {
        ...relevantCategoryPrivacy,
        value: updatedTypes.every((type) => Boolean(type.value)),
      };
    } else {
      updatedTypes = relevantCategoryPrivacy.types.map((obj) => ({
        ...obj,
        value,
      }));
      relevantCategoryPrivacy = {
        ...relevantCategoryPrivacy,
        value: updatedTypes.every((type) => Boolean(type.value)),
      };
    }

    const updatedTypePrivacy = {
      ...relevantCategoryPrivacy,
      types: updatedTypes,
    };

    const newPrivacy = [
      ...privacy.slice(0, relevantCategoryPrivacyIndex),
      updatedTypePrivacy,
      ...privacy.slice(relevantCategoryPrivacyIndex + 1),
    ];

    return newPrivacy;
  } catch (err) {
    console.log("Error in updateClubPrivacy: ", err);
  }
}

type GetPrivacyValueProps = {
  isMain?: boolean;
  privacy?: HeadValuePartsBoolean;
  category: string;
  typeName?: string;
  type?: string;
};

export function getPrivacyValue({ isMain, privacy, category, type }: GetPrivacyValueProps) {
  const relevantCategoryPrivacy = privacy?.find((rec) => rec.name === category);
  if (isMain) return relevantCategoryPrivacy?.value;
  if (!type) return;
  return relevantCategoryPrivacy?.types.find((rec) => rec.name === type)?.value;
}
