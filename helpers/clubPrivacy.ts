import { ClubDataType, HeadValuePartsBoolean } from "@/types/global";

type UpdateClubPrivacyProps = {
  club: ClubDataType | null;
  type: string;
  part?: string;
  value: boolean;
};

export function updateClubPrivacy({ club, type, part, value }: UpdateClubPrivacyProps) {
  try {
    const { privacy } = club || {};

    if (!privacy) return;

    const relevantTypePrivacyIndex = privacy.findIndex((rec) => rec.name === type);

    if (relevantTypePrivacyIndex === -1) return club;

    let relevantTypePrivacy = privacy[relevantTypePrivacyIndex];
    let updatedParts;

    if (part) {
      const relevantPartPrivacyIndex = relevantTypePrivacy.parts.findIndex(
        (rec) => rec.name === part
      );

      if (relevantPartPrivacyIndex === -1) return club;

      const updatedPartPrivacy = {
        ...relevantTypePrivacy.parts[relevantPartPrivacyIndex],
        value,
      };

      updatedParts = [
        ...relevantTypePrivacy.parts.slice(0, relevantPartPrivacyIndex),
        updatedPartPrivacy,
        ...relevantTypePrivacy.parts.slice(relevantPartPrivacyIndex + 1),
      ];

      relevantTypePrivacy = {
        ...relevantTypePrivacy,
        value: updatedParts.every((part) => Boolean(part.value)),
      };
    } else {
      updatedParts = relevantTypePrivacy.parts.map((obj) => ({
        ...obj,
        value,
      }));
      relevantTypePrivacy = {
        ...relevantTypePrivacy,
        value: updatedParts.every((part) => Boolean(part.value)),
      };
    }

    const updatedTypePrivacy = {
      ...relevantTypePrivacy,
      parts: updatedParts,
    };

    const newPrivacy = [
      ...privacy.slice(0, relevantTypePrivacyIndex),
      updatedTypePrivacy,
      ...privacy.slice(relevantTypePrivacyIndex + 1),
    ];

    return newPrivacy;
  } catch (err) {
    console.log("Error in updateClubPrivacy: ", err);
  }
}

type GetPrivacyValueProps = {
  isMain?: boolean;
  privacy?: HeadValuePartsBoolean;
  partName?: string;
  type: string;
};

export function getPrivacyValue({ isMain, privacy, partName, type }: GetPrivacyValueProps) {
  const relevantTypePrivacy = privacy?.find((rec) => rec.name === type);
  if (isMain) return relevantTypePrivacy?.value;
  if (!partName) return;
  return relevantTypePrivacy?.parts.find((rec) => rec.name === partName)?.value;
}
