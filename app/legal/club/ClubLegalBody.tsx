import React from "react";
import Link from "@/helpers/custom-router/patch-router/link";
import { rem, Stack, Text, Title } from "@mantine/core";

type Props = {
  addTitle?: boolean;
};

export default function ClubLegalBody({ addTitle }: Props) {
  return (
    <>
      {addTitle && <Title order={1}>Club Terms</Title>}
      <Text size="sm" c="dimmed">
        Last updated: September 12, 2024
      </Text>
      <Stack>
        <Text mt={0}>
          {`Welcome to the "Club", an optional service available on our platform
          that allows users to interact with others, share content, and earn
          rewards based on the number of followers.`}
        </Text>
        <Text>
          {`By joining the Club, you agree to these supplementary Terms of Service
          ("Club Terms"), which complement and expand on our platform's{" "}
          ${(<Link href={`/legal/terms`}>General Terms of Service</Link>)}
          ("General TOS"). Where conflicts arise, these Club Terms take
          precedence over the General TOS for matters relating specifically to
          the Club.`}
        </Text>
        <Text>
          Please read these Club Terms carefully before joining. By accessing or using the Club
          features, you agree to be bound by these terms and all related policies.
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
            Successfully complete the Stripe Connect onboarding process to enable payouts, which
            includes:
            <ul>
              <li>Providing accurate and verifiable identity and banking information.</li>
              <li>Connecting a valid bank account for receiving payments.</li>
            </ul>
          </li>
          <li>
            Agree to comply with all laws and regulations applicable in your country of residence,
            including those related to online income reporting.
          </li>
          <li>Purchase the Club or Full plans.</li>
        </ol>
      </Stack>
      <Stack>
        <Title order={2}>2. Membership in the Club</Title>
        <Text>By joining the Club, you gain access to the following features:</Text>
        <Title order={3}>1. Profile Visibility & Sharing:</Title>
        <ul>
          <li>
            As a Club member, you will provide two distinct types of content to the Club members:
            <ul>
              <li>
                <strong>Daily Task Completion Proof:</strong> This includes images or videos of you
                performing daily activities, such as using products, eating, or working out at the
                gym, etc., as described in the tasks of your routine. Once uploaded, this content
                becomes publicly viewable by all visitors of maxyouout.com, regardless of whether
                they are members of the Club or not.
              </li>
              <li>
                <strong>Progress Images:</strong> These are your weekly progress images, which
                include the images of your head and body. This content is private by default, but
                you can make it accessible to your followers.
              </li>
            </ul>
          </li>
        </ul>
        <Title order={3}>2. Follower Interaction:</Title>
        <ul>
          <li>
            Users can follow (a.k.a. peek) and unfollow you freely without your explicit approval.
          </li>
          <li>
            You cannot block or reject followers, but you retain the right to remove yourself from
            the Club at any time.
          </li>
          <li>You can hide from or display your private content to your followers at any time.</li>
        </ul>
        <Title order={3}>3. Income from Followers:</Title>
        <ul>
          <li>
            You will earn 25% of the Peek license subscription fee for each user that follows you in
            the club.
          </li>
          <li>
            Reward payments will be processed via Stripe Connect, and are subject to applicable fees
            and withholding taxes in accordance with your local tax laws.
          </li>
        </ul>
      </Stack>
      <Stack>
        <Title order={2}>3. Content and Privacy</Title>
        <Title order={3}>1. Ownership of Content:</Title>
        <Text>
          You retain ownership of the content you upload to the platform, including Daily Task
          Completion Proof data and Progress Images. However, by uploading content, you grant us a
          non-exclusive, worldwide, royalty-free license to use, distribute, display, and modify
          your content for the purpose of operating the platform and promoting Club services. This
          license is revocable upon your departure from the Club, except for any content already
          shared with the public or followers.
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
            only accessible to users who follow you. Unauthorized sharing or use of these images by
            followers is strictly prohibited and may result in penalties or removal from the Club.
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
            www.maxyouout.com/settings
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
        <Title order={3}>1. Stripe Fees:</Title>
        <Text>
          All payments to Club members will be processed through Stripe Connect. Stripe may deduct
          its processing fees from your earnings, in accordance with their terms and fee structure.
          We do not control Stripe&apos;s processing times, and payments may take several business
          days to reflect in your bank account after they are initiated.
        </Text>
        <Title order={3}>2. Earnings from Followers:</Title>
        <ul>
          <li>
            You will receive 25% of the app&apos;s subscription fee for each user who follows you.
            This percentage is calculated based on the amount collected from the user&apos;s
            subscription.
          </li>
          <li>
            Payments will be distributed via Stripe Connect to your connected bank account, subject
            to Stripe&apos;s processing times and terms.
          </li>
        </ul>
        <Title order={3}>3. Payment Schedule:</Title>
        <ul>
          <li>Payouts will be processed on a monthly basis.</li>
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
          Upon termination of your Club membership, all of your content will become private. All
          access to your private data (if provided) will be revoked. Your daily task completion
          proof will no longer be visible to general users.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>6. Club Participation Guidelines</Title>
        <Title order={3}>1. Prohibited Activities:</Title>
        <ul>
          <li>Sharing or distributing other members&apos; content.</li>
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
          support@maxyouout.com. We will review and take appropriate action, which may include
          suspending or terminating the violator&apos;s account.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>7. Changes to Club Terms</Title>
        <Text>
          We may revise these Club Terms from time to time. Any changes will be effective when
          posted on our website or sent to you via email. Continued participation in the Club after
          changes are posted constitutes acceptance of those changes.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>8. Limitation of Liability</Title>
        <Text>
          In addition to the limitations outlined in our{" "}
          <Link href={`/legal/terms`}>General TOS</Link>, we are not responsible for any
          unauthorized use or access to your content by third parties, including followers who may
          violate these terms by sharing or misusing your images or videos.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>9. Governing Law</Title>
        <Title order={3}>1. International Compliance:</Title>
        <Text>
          Users are responsible for ensuring that their participation in the Club, including the
          sharing of content and receipt of income, complies with the laws and regulations of their
          country of residence. This includes reporting and paying taxes on earnings where
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
          info@maxyouout.com.
        </Text>
      </Stack>
    </>
  );
}
