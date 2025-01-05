import { Stack, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import ClubLegalBody from "@/app/legal/club/ClubLegalBody";
import PrivacyLegalBody from "@/app/legal/privacy/PrivacyLegalBody";
import TermsLegalBody from "@/app/legal/terms/TermsLegalBody";

export default function openLegalBody(type: "club" | "terms" | "privacy") {
  let body;
  let title;

  switch (type) {
    case "club":
      body = <ClubLegalBody />;
      title = `Club's terms of service`;
      break;
    case "privacy":
      body = <PrivacyLegalBody />;
      title = `Privacy policy`;
      break;
    default:
      body = <TermsLegalBody />;
      title = `Terms of service`;
  }

  modals.openContextModal({
    centered: true,
    modal: "general",
    size: "lg",
    title: (
      <Title order={5} component={"p"}>
        {title}
      </Title>
    ),
    classNames: { content: "scrollbar" },
    innerProps: <Stack>{body}</Stack>,
  });
}
