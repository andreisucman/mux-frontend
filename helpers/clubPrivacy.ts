import { ClubDataType, HeadValuePartsBoolean } from "@/types/global";

type UpdateClubPrivacyProps = {
  club: ClubDataType | null;
  category: string;
  part?: string;
  value: boolean;
};

export function updateClubPrivacy({ club, part, category, value }: UpdateClubPrivacyProps) {
  try {
    console.log("updateClubPrivayc inputs", { club, part, category, value });
    const { privacy } = club || {};

    if (!privacy) return;

    const relevantCategoryPrivacyIndex = privacy.findIndex((rec) => rec.name === category);

    if (relevantCategoryPrivacyIndex === -1) return club;
    console.log("relevantCategoryPrivacyIndex", relevantCategoryPrivacyIndex);

    let relevantCategoryPrivacy = privacy[relevantCategoryPrivacyIndex];
    let updatedParts;

    console.log("relevantCategoryPrivacy", relevantCategoryPrivacy);

    if (part) {
      const relevantPartPrivacyIndex = relevantCategoryPrivacy.parts.findIndex(
        (rec) => rec.name === part
      );

      if (relevantPartPrivacyIndex === -1) return club;

      const updatedPartPrivacy = {
        ...relevantCategoryPrivacy.parts[relevantPartPrivacyIndex],
        value,
      };

      console.log("updatedPartPrivacy", updatedPartPrivacy);

      updatedParts = [
        ...relevantCategoryPrivacy.parts.slice(0, relevantPartPrivacyIndex),
        updatedPartPrivacy,
        ...relevantCategoryPrivacy.parts.slice(relevantPartPrivacyIndex + 1),
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

      console.log("updatedParts", updatedParts);

      relevantCategoryPrivacy = {
        ...relevantCategoryPrivacy,
        value: updatedParts.every((part) => Boolean(part.value)),
      };

      console.log("relevantCategoryPrivacy", relevantCategoryPrivacy);
    }

    const updatedCategoryPrivacy = {
      ...relevantCategoryPrivacy,
      parts: updatedParts,
    };

    const newPrivacy = [
      ...privacy.slice(0, relevantCategoryPrivacyIndex),
      updatedCategoryPrivacy,
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
