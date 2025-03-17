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
        Last updated: Match 16, 2025
      </Text>
      <Stack>
        <Text mt={0}>
          This terms of service agreement ("Club Terms") outlines the participation terms in our
          revenue sharing program ("Club").
        </Text>
        <Text>
          It complements and expands on our platform&apos;s{" "}
          <Link href={"/legal/terms"} style={{ textDecoration: "underline" }}>
            General Terms of Service
          </Link>{" "}
          ("General TOS"). Where conflicts arise Club Terms take precedence over the General TOS for
          matters relating specifically to the Club.
        </Text>
        <Text>
          Please read Club Terms carefully before joining. By accessing or using the Club, you agree
          to be bound by these terms and all related policies.
        </Text>
        <Text>
          The Club lets you see the content of other site users and share yours with them. The Club
          is free to join and you can leave at any time.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>1. Eligibility to Join the Club</Title>
        <Text>To join the Club, you must:</Text>
        <ol>
          <li>
            Be a registered user of the platform, in compliance with our{" "}
            <Link href={"/legal/terms"} style={{ textDecoration: "underline" }}>
              General TOS
            </Link>
            .
          </li>
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
                <strong>Routines:</strong> The list of activities you have created for improving
                yourself.
              </li>
              <li>
                <strong>Task completion proof:</strong> The images or videos of you performing
                activities outlined in your routines, such as using products, engaging in sport
                activities and others as described in each task.
              </li>
              <li>
                <strong>Progress images:</strong> The weekly progress scans of your body.
              </li>
              <li>
                <strong>Progress diary:</strong> The audio, text, and images capturing your thoughts
                on the tasks you've completed.
              </li>
              <li>
                <strong>About info:</strong> Your demographic data such the approximate age
                interval, ethnicity, skin type, body type, as well as potential concerns and special
                considerations that have been identifed from your scans or added by you.
              </li>
            </ul>
          </li>
          <li>
            <Text>
              By default when you join the Club all of your existing content is private and not
              accessible by others. Your content becomes public when you list a routine for sale, of
              which you are notified during the process of listing. Only the content associated with
              the listed routine becomes public. All other content remains private.
            </Text>
            <Text>
              For example: if you have face and body routines, but you only list the face routine,
              your progress, proof and diary records related to the body will remain private.
            </Text>
          </li>
        </ul>
        <Title order={3}>3. Income from sales:</Title>
        <ul>
          <li>
            You earn 80% minus the applicable processing fees from the price that you list for your
            routines.
          </li>
          <li>
            Your reward is deposited to your balance immedately and is available for withdrawal at
            any time.
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
          As a Club member, you are responsible for the content you display, ensuring it adheres to
          our{" "}
          <Link href={"/legal/terms"} style={{ textDecoration: "underline" }}>
            General TOS
          </Link>{" "}
          and does not violate any laws, rights, or intellectual property.
        </Text>
        <Text>
          You retain ownership of the content you upload to the platform. However, by uploading
          content, you grant us a non-exclusive, worldwide, royalty-free license to use, distribute,
          display, and modify your content for the purpose of operating and promoting the platform.
          This license is revocable upon your departure from the Club, except for any content
          already shared with the public or followers.
        </Text>
        <Title order={3}>2. Data Security:</Title>
        <Text>
          We employ commercially reasonable security measures, such as role based access and
          encryption, to protect your personal data and content. However, we cannot guarantee the
          complete security of information transmitted through the platform. By uploading content,
          you acknowledge and accept the risk of potential unauthorized access or misuse, though we
          strive to prevent this from happening.
        </Text>
        <Title order={3}>3. Privacy of Content:</Title>
        <ul>
          <li>
            <strong>Public Content:</strong> When you list a routine for sale different types of
            data are made available to different types of users as follows:
            <ul>
              <li>
                The progress images become displayed on the home page of the platform and are
                viewable by anyone.
              </li>
              <li>
                The routines, proof, and diary are accessible by users who have purchased your
                routine.
              </li>
              <li>
                The about info is accessible by your customers who have the 'Advisor Coach' addon
                enabled. It's also used in the filters menu on the home page of the site for the
                purpose of filtering the progress images.
              </li>
            </ul>
          </li>
          <li>
            <strong>Private Content:</strong>
            <Text>
              Any content you upload is private by default, unless you choose to list your routine
              for sale. You can revoke your decision for selling a routine on the Manage routine
              page, that you can access by clicking a relevant button on your Club profile page.
            </Text>
            <Text>
              We implement strong security measures to protect your private content, but please note
              that while we take all necessary precautions, no system can guarantee absolute
              privacy.
            </Text>
          </li>
        </ul>
        <Title order={3}>4. Purchasing Content</Title>
        <Text>
          When you purchase data from other Club users, you gain immediate access to it for at least
          365 days. We do not guarantee availability beyond this period.
        </Text>
        <Title order={3}>5. Leaving the Club:</Title>
        <Text>
          You can leave the Club at any time by visiting your Settings page at{" "}
          <Link href="/settings" style={{ display: "inline-block", textDecoration: "underline" }}>
            www.muxout.com/settings
          </Link>{" "}
          and clicking the "Leave Club" button.
        </Text>
        <Text>
          Once you leave the Club, the content you've made public (if any) will be hidden from other
          users, except for the content that has already been purchased, which will be available for
          the users that have bought it even after you have left the Club.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>4. Payment Terms</Title>
        <Title order={3}>1. Processing Fees:</Title>
        <Text>
          All payments to Club members will be processed through our payment processor - Stripe.
          Stripe may deduct its processing fees from your earnings, in accordance with their terms
          and fee structure. We do not control Stripe&apos;s processing fees and times, and payments
          may take several business days to reflect in your bank account after they are initiated.
        </Text>
        <Title order={3}>2. Payment Schedule:</Title>
        <ul>
          <li>
            Payouts are processed on demand. This means you can initiate a payout of your balance to
            your bank account at any time.
          </li>
          <li>
            You are responsible for ensuring your banking information remains current and accurate.
          </li>
        </ul>
        <Title order={3}>3. Taxes and Withholdings:</Title>
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
        <Text>
          Upon the termination of your Club membership, any of your content that was previously
          public will be made private. This includes progress and proof images and videos, diary
          audio and text, as well as other information about you that you have provided.
        </Text>
        <Text>
          The information that has already been purchased by any of your customers will still be
          available for them after you have left the Club.
        </Text>
      </Stack>
      <Stack>
        <Title order={2}>6. Club Participation Guidelines</Title>
        <Title order={3}>1. Prohibited Activities:</Title>
        <ul>
          <li>Uploading misleading, false, or offensive content.</li>
          <li>Engaging in harassment or any form of abusive behavior.</li>
          <li>Engaging in fraudulent activities.</li>
        </ul>
        <Title order={3}>2. Prohibited Content:</Title>
        <Text>
          You may not upload content that includes nudity, sexually explicit material, illegal
          activities, hate speech, or any content that violates the rights of others. For a full
          list of prohibited content, please refer to our{" "}
          <Link href={"/legal/terms"} style={{ textDecoration: "underline" }}>
            General TOS
          </Link>
          . We reserve the right to remove content that violates these guidelines without prior
          notice.
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
          <Link href={"/legal/terms"} style={{ textDecoration: "underline" }}>
            General TOS
          </Link>
          , we are not responsible for any unauthorized use or access to your content by third
          parties, including the purchasers of your content who may violate these terms by sharing
          or misusing your images, videos audio or textual content.
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
          outlined in the{" "}
          <Link href={"/legal/terms"} style={{ textDecoration: "underline" }}>
            General TOS
          </Link>
          .
        </Text>
      </Stack>
      <Stack style={{ marginBottom: rem(48) }}>
        <Title order={2}>10. Contact Us</Title>
        <Text>
          If you have any questions regarding these Club Terms, please contact us at
          info@muxout.com.
        </Text>
      </Stack>
    </>
  );
}
