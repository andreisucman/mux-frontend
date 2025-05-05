import React from "react";
import { Stack, Text, Title } from "@mantine/core";

type Props = {
  addTitle?: boolean;
};

export default function ClubLegalBody({ addTitle }: Props) {
  return (
    <>
      {addTitle && <Title order={1}>Club Participation Agreement</Title>}
      <Text size="sm" c="dimmed">
        Last updated: 5 May 2025
      </Text>
      <Stack>
        <Text mt={0}>
          The Muxout Club is an optional revenue-sharing program. Joining the Club requires your
          explicit opt-in. By choosing to participate, you acknowledge that membership is entirely.
          If you do not actively join the Club, all of your routines, photos, and diary entries
          remain private. You will only share content with others if you intentionally opt in (for
          example, by joining the Club and publishing your routine).
        </Text>
        <Title order={3}>Club Content</Title>
        <Text>
          When you publish to the Club, you may share personal content that documents your skin or
          hair care journey. This includes before-and-after photos, videos, step-by-step written
          routines (tasks, product lists, tips), progress diary notes (text or audio), and any
          analysis results (such as severity scores) from Muxout&apos;s AI processing. All content
          you share under the Club remains your property. However, by uploading it you grant Muxout
          a license to use and display it for the Club program. In practice, this means Muxout may
          show your uploaded before/after images to all site visitors, and disclose your routine
          details and diary entries to other users who purchase access to your content. Buyers may
          view your content for personal use but may not copy, redistribute, or claim it as their
          own. Your license to Muxout is worldwide, non-exclusive, royalty-free, and sublicensable
          (solely to run the service). You remain responsible for complying with all content
          guidelines (see Terms of Service) when sharing in the Club.
        </Text>
        <Title order={3}>Privacy, Data Handling, and AI Processing</Title>
        <Text>
          The Muxout Privacy Policy governs all collection and use of your personal data, including
          Club content. By uploading images or data, you give Muxout explicit consent to collect,
          analyze, store, and process this information. We use AI to analyze your photos for
          severity scores and to suggest routines, and we only process sensitive data (images,
          voice, etc.) with your consent. If you choose to publish in the Club, that choice itself
          is treated as consent to share your data with other users as described. Your data may be
          stored on Muxout&apos;s secure servers and shared with service providers (such as cloud
          hosts, analytics, and payment processors) only as needed to operate the service. For full
          details on data storage, security, and third party sharing, see our Privacy Policy.
        </Text>
        <Text>
          Under applicable laws, you retain control over your personal data. Per the Privacy Policy,
          you have rights to access, correct, delete, or obtain a copy of your data, restrict or
          withdraw consent for sensitive data processing, and request data portability.
          Participation in the Club does not change these rights. If you withdraw consent or request
          deletion of your data, Muxout will comply as required by law (e.g. deleting or anonymizing
          your images and records). See the Privacy Policy for instructions on exercising these
          rights. (Note: content already sold to others may remain accessible to those buyers until
          the end of their purchase term; see “Content Removal” below.)
        </Text>
        <Title order={3}>Content Publication and Discoverability</Title>
        <Text>
          Content you publish in the Club will be discoverable by other users. Specifically, your
          before/after images will appear publicly to site visitors, and your routine steps and
          diary notes will be viewable by any user who purchases your Club content. Published
          content may also be referenced or aggregated in anonymized form to improve Muxout&apos;s
          services. By sharing content in the Club, you understand it becomes visible to the Muxout
          community as outlined above.
        </Text>
        <Title order={3}>Opt-In / Joining</Title>
        <Text>
          o join the Club, you must have a Muxout account in good standing (and be 18+). You will be
          guided through an onboarding process (e.g. identity verification, payment setup). Joining
          the Club requires agreeing to this Club Agreement (a supplement to the Muxout Terms of
          Service). You will not be added to the Club or begin earning until you explicitly opt in
          through the platform.
        </Text>
        <Title order={3}>Opting Out and Content Removal</Title>
        <Text>
          You may leave the Club or stop offering any piece of content at any time. If you remove
          content or opt out, it will no longer be available for new purchases. However, any user
          who already purchased access retains their access rights until their term ends (typically
          365 days per purchase). As a seller, you should not delete or substantially change content
          that has been paid for until the end of that buyer&apos;s access period. If you need to
          remove content early (for example, for personal reasons), please contact Muxout support;
          early removal may require refunding buyers (which can be deducted from your earnings).
        </Text>
        <Text>
          If you delete your Muxout account or request full data deletion, your Club content is
          “frozen” for existing purchasers: they will retain access for up to 365 days from each
          purchase, after which the content will be permanently removed. In any case, once you leave
          the Club or delete content, it will no longer be presented to new users. When content is
          removed, Muxout will also delete it from active servers and (after a short backup
          retention period) from backups, consistent with our Data Deletion policy.
        </Text>
        <Title order={3}>Earnings, Payments, and Taxes</Title>
        <Text>
          Club members earn a share of the revenue from each sale of their content. The exact
          revenue split (typically a small commission to Muxout, the remainder to you) is detailed
          in the Club Terms you signed when joining. No minimum threshold: we pay out all your
          earnings, no matter how small. Payouts are made in USD (unless otherwise stated) to the
          bank or payment method you provide, usually processed daily. Any banking or
          currency-conversion fees are your responsibility. Muxout will not delay or withhold your
          earned funds (we “won&apos;t hold your earnings hostage”): if you leave the Club or delete
          your account, any unpaid balance will still be paid to you, provided you are not in breach
          of any terms. You are responsible for reporting your income and paying any applicable
          taxes on earnings from the Club.
        </Text>
        <Title order={3}>Termination and Enforcement</Title>
        <Text>
          Muxout reserves the right to remove any Club content or terminate Club membership if
          content guidelines or laws are violated. Serious violations (e.g. posting others&apos;
          content without permission) may result in removal from the Club or the platform, and
          forfeiture of pending earnings. If you are removed for misconduct, any earnings due to you
          may be withheld to cover refunds to buyers.
        </Text>
        <Title order={3}>General Provisions</Title>
        <Text>
          This Club Agreement supplements the Muxout Terms of Service and Privacy Policy (which are
          incorporated by reference). In case of any conflict, these Club terms govern Club-specific
          issues. By participating in the Club, you confirm that you have read, understood, and
          agreed to this Agreement, the Terms of Service, and the Privacy Policy. Muxout may revise
          this Agreement; continued participation after any updates means you accept the revised
          terms. If you have questions or wish to exercise your privacy rights, you may contact us
          at the addresses provided in the Privacy Policy.
        </Text>
        <Title order={3}>Summary</Title>
        <Text>
          The Muxout Club is an optional program. You share your own routines, photos, and notes
          (all of which remain yours) and grant Muxout permission to show them to others for
          purchases. Participation is by explicit opt-in, and you may leave anytime. All
          data-sharing and user rights are governed by Muxout&apos;s Privacy Policy. By agreeing to
          this Club Agreement, you understand how your content will be used, shared, and protected
          within Muxout, and you accept the implications of publishing it (including discoverability
          and licensing).
        </Text>
      </Stack>
    </>
  );
}
