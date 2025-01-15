import React from "react";
import { rem, Stack, Text, Title } from "@mantine/core";
import Link from "@/helpers/custom-router/patch-router/link";

type Props = {
  addTitle?: boolean;
};

export default function ClubLegalBody({ addTitle }: Props) {
  return (
    <>
      {addTitle && <Title order={1}>Club Terms</Title>}
      <Text size="sm" c="dimmed">
        Last updated: January 3, 2025
      </Text>
      <Stack>
        <Text mt={0}>
          This terms of service agreement ("Club Terms") outlines the participation terms in our
          revenue sharing program ("Club").
        </Text>
        <Text>
          It complement and expand on {"our platform's"}{" "}
          <Link href={`/legal/terms`}>General Terms of Service</Link> ("General TOS"). Where
          conflicts arise Club Terms take precedence over the General TOS for matters relating
          specifically to the Club.
        </Text>
        <Text>
          Please read Club Terms carefully before joining. By accessing or using the Club, you agree
          to be bound by these terms and all related policies.
        </Text>
        <Text>
          The Club lets you share your progress and other content with other site users to inspire
          them for improvement and get rewarded for doing that. The Club is free to join and you can
          leave at any time.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>1. Eligibility to Join the Club</Title>
        <Text>To join the Club, you must:</Text>
        <ol>
          <li>
            Be a registered user of the platform, in compliance with our{" "}
            <Link href={`/legal/terms`}>General TOS</Link>.
          </li>
          <li>Be at least 18 years old.</li>
          <li>
            Agree to comply with all laws and regulations applicable in your country of residence,
            including those related to online income reporting.
          </li>
        </ol>
      </Stack>
      <Stack>
        <Title order={2}>2. Membership in the Club</Title>
        <Text>By joining the Club, you gain access to the following features:</Text>
        <Title order={3}>1. Profile Visibility & Sharing:</Title>
        <ul>
          <li>
            As a Club member you can share the following content:
            <ul>
              <li>
                <strong>Task completion proof:</strong> The images or videos of you performing
                certain activities, such as using products, eating, or working out and others, as
                described in the relevant tasks of your routine.
              </li>
              <li>
                <strong>Progress images:</strong> The weekly progress images of your head and body.
              </li>
              <li>
                <strong>About description:</strong> The text describing your personality including
                philosophy, style and style tips.
              </li>
              <li>
                <strong>Progress diary:</strong> The audio and text capturing your thoughts on the
                tasks you've completed.
              </li>
            </ul>
          </li>
          <li>
            By default when you join the club all of your existing content is private and not
            accessible by others. You can enable data sharing on the admission page during or on the
            settings page after the registration.
          </li>
        </ul>
        <Title order={3}>2. Interaction with other Club members:</Title>
        <ul>
          <li>Other Club members can follow ("peek") and unfollow you without your consent.</li>
          <li>You cannot block or reject followers.</li>
          <li>You can enable or disable the sharing of any category of content at any time.</li>
        </ul>
        <Title order={3}>3. Income from Followers:</Title>
        <ul>
          <li>
            You earn 50% from the net Peek license subscription revenue amount for each user that follows you
            in the Club, each month.
          </li>
          <li>
            Your rewards are deposited to your balance every day at midnight UTC according to the
            number of users that follow you at that moment.
          </li>
          <li>
            Your withdrawals are subject to applicable processing fees and withholding taxes in
            accordance with your local tax laws.
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>3. Content and Privacy</Title>
        <Title order={3}>1. Ownership of Content:</Title>
        <Text>
          You retain ownership of the content you upload to the platform. However, by uploading
          content, you grant us a non-exclusive, worldwide, royalty-free license to use, distribute,
          display, and modify your content for the purpose of operating and promoting the platform.
          This license is revocable upon your departure from the Club, except for any content
          already shared with the public or followers.
        </Text>
        <Title order={3}>2. Data Security:</Title>
        <Text>
          We employ commercially reasonable security measures, such as encryption, to protect your
          personal data and content. However, we cannot guarantee the complete security of
          information transmitted through the platform. By uploading content, you acknowledge and
          accept the risk of potential unauthorized access or misuse, though we strive to prevent
          this from happening.
        </Text>
        <Title order={3}>3. User-Generated Content:</Title>
        <ul>
          <li>
            As a Club member, you are responsible for the content you upload, ensuring it adheres to
            our <Link href={`/legal/terms`}>General TOS</Link> and does not violate any laws,
            rights, or intellectual property.
          </li>
          <li>
            <strong>Daily Task Completion Proof:</strong> This content, which involves you
            performing daily tasks, will become public immediately upon joining the Club. Any
            platform visitor can view this content.
          </li>
          <li>
            <strong>Progress Images of Head and Body:</strong> These images remain private and are
            only accessible to users who peek (follow) you. Unauthorized sharing or use of these
            images by followers is strictly prohibited and may result in penalties or removal from
            the Club.
          </li>
        </ul>
        <Title order={3}>4. Privacy of Content:</Title>
        <ul>
          <li>
            <strong>Public Content (Daily Task Completion Proof image and videos):</strong> is
            visible to all platform users by default.
          </li>
          <li>
            <strong>Private Content (Images of Head and Body):</strong> is private by default, but
            you can make it accessible to your followers. To manage your data sharing preferences,
            click the club options button at the bottom of the club profile page and then switch the
            corresponding selector. We take precautions to ensure content is secure and viewable
            only by authorized followers, but we do not guarantee absolute privacy. Unauthorized
            sharing of private content is a violation of these terms and may lead to penalties.
          </li>
        </ul>
        <Title order={3}>5. Leaving the Club:</Title>
        <Text>
          You can leave the Club at any time by visiting your Settings page at
          <Link href="/settings" style={{ display: "inline-block" }}>
            www.muxout.com/settings
          </Link>
          and clicking the "Leave Club" button.
        </Text>
        <Text>
          Once you leave the Club, all content you have uploaded will immediately become private.
          Followers will lose access to your private content, and public content will no longer be
          visible to general users.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>4. Payment Terms</Title>
        <Title order={3}>1. Processing Fees:</Title>
        <Text>
          All payments to Club members will be processed through our payment processor - Stripe.
          Stripe may deduct its processing fees from your earnings, in accordance with their terms
          and fee structure. We do not control Stripe&apos;s processing times, and payments may take
          several business days to reflect in your bank account after they are initiated.
        </Text>
        <Title order={3}>2. Earnings from Followers:</Title>
        <ul>
          <li>
            You will receive 50% of the net app&apos;s subscription revenue for each user who follows you.
            The actual amount is calculated based on the Peek license plan cost minus payment processing fee (~3-3.5%).
          </li>
          <li>
            Payments deposited to your bank account are subject to Stripe&apos;s processing times,
            fess, and terms.
          </li>
        </ul>
        <Title order={3}>3. Payment Schedule:</Title>
        <ul>
          <li>
            Payouts are processed on demand. This means you can initiate a payout of your balance to
            your bank account at any time.
          </li>
          <li>
            You are responsible for ensuring your banking information remains current and accurate.
          </li>
        </ul>
        <Title order={3}>4. Taxes and Withholdings:</Title>
        <ul>
          <li>
            You are responsible for reporting and paying any applicable taxes on earnings from the
            Club.
          </li>
          <li>
            We may withhold taxes where required by law, based on the information provided during
            the Stripe Connect onboarding process.
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>5. Termination of Membership</Title>
        <Title order={3}>1. Content Backup and Retention:</Title>
        <Text>
          Upon the termination of your Club membership, any of your content that was previously
          public will be made private. This includes progress and proof images and videos, diary
          audio and text, as well as your "About" description.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>6. Club Participation Guidelines</Title>
        <Title order={3}>1. Prohibited Activities:</Title>
        <ul>
          <li>Uploading misleading, false, or offensive content.</li>
          <li>Engaging in harassment or any form of abusive behavior.</li>
          <li>Engaging in fraudulent activities to increase payouts.</li>
        </ul>
        <Title order={3}>2. Prohibited Content:</Title>
        <Text>
          You may not upload content that includes nudity, sexually explicit material, illegal
          activities, hate speech, or any content that violates the rights of others. For a full
          list of prohibited content, please refer to our{" "}
          <Link href={`/legal/terms`}>General TOS</Link>. We reserve the right to remove content
          that violates these guidelines without prior notice.
        </Text>
        <Title order={3}>3. Reporting Mechanism:</Title>
        <Text>
          If you encounter any inappropriate content or behavior, you may report it by emailing
          info@muxout.com. We will review and take appropriate action, which may include suspending
          or terminating the {"violator's"} account.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>7. Changes to Club Terms</Title>
        <Text>
          We reserve the right to update these Club Terms periodically. Any changes will become
          effective upon posting on our website. Your continued participation in the Club after such
          updates indicates your acceptance of the revised terms.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>8. Limitation of Liability</Title>
        <Text>
          In addition to the limitations outlined in our{" "}
          <Link href={`/legal/terms`}>General TOS</Link>, we are not responsible for any
          unauthorized use or access to your content by third parties, including followers who may
          violate these terms by sharing or misusing your images, videos audio or textual content.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>9. Governing Law</Title>
        <Title order={3}>1. International Compliance:</Title>
        <Text>
          Users are responsible for ensuring that their participation in the Club, including the
          content they upload and the receipt of payment complies with the laws and regulations of
          their country of residence. This includes reporting and paying taxes on earnings where
          applicable.
        </Text>
        <Text>
          These Club Terms are governed by the same laws and dispute resolution provisions as
          outlined in the <Link href={`/legal/terms`}>General TOS</Link>.
        </Text>
      </Stack>
      <Stack style={{ marginBottom: rem(32) }}>
        <Title order={2}>10. Contact Us</Title>
        <Text>
          If you have any questions regarding these Club Terms, please contact us at
          info@muxout.com.
        </Text>
      </Stack>
    </>
  );
}
