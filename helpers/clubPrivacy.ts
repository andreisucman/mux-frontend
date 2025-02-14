import { ClubDataType, HeadValuePartsBoolean } from "@/types/global";

type UpdateClubPrivacyProps = {
  club: ClubDataType | null;
  category: string;
  part?: string;
  value: boolean;
};

export function updateClubPrivacy({ club, part, category, value }: UpdateClubPrivacyProps) {
  try {
    const { privacy } = club || {};

    if (!privacy) return;

    const relevantCategoryPrivacyIndex = privacy.findIndex((rec) => rec.name === category);

    if (relevantCategoryPrivacyIndex === -1) return club;

    let relevantCategoryPrivacy = privacy[relevantCategoryPrivacyIndex];
    let updatedParts;

    if (part) {
      const relevantTypePrivacyIndex = relevantCategoryPrivacy.parts.findIndex(
        (rec) => rec.name === part
      );

      if (relevantTypePrivacyIndex === -1) return club;

      const updatedPartPrivacy = {
        ...relevantCategoryPrivacy.parts[relevantTypePrivacyIndex],
        value,
      };

      updatedParts = [
        ...relevantCategoryPrivacy.parts.slice(0, relevantTypePrivacyIndex),
        updatedPartPrivacy,
        ...relevantCategoryPrivacy.parts.slice(relevantTypePrivacyIndex + 1),
      ];

      relevantCategoryPrivacy = {
        ...relevantCategoryPrivacy,
        value: updatedParts.every((part) => Boolean(part.value)),
      };
    } else {
      updatedParts = relevantCategoryPrivacy.parts.map((obj) => ({
        ...obj,
        value,
      }));
      relevantCategoryPrivacy = {
        ...relevantCategoryPrivacy,
        value: updatedParts.every((part) => Boolean(part.value)),
      };
    }

    const updatedTypePrivacy = {
      ...relevantCategoryPrivacy,
      types: updatedParts,
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
  part?: string;
};

export function getPrivacyValue({ isMain, privacy, category, part }: GetPrivacyValueProps) {
  const relevantCategoryPrivacy = privacy?.find((rec) => rec.name === category);
  if (isMain) return relevantCategoryPrivacy?.value;
  if (!part) return;
  return relevantCategoryPrivacy?.parts.find((rec) => rec.name === part)?.value;
}
