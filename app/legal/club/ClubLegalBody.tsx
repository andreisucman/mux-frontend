import React from "react";
import Link from "next/link";
import { rem, Text } from "@mantine/core";

export default function ClubLegalBody() {
  return (
    <>
      <h1>Club Terms</h1>
      <Text size="sm" c="dimmed">
        Last updated: September 12, 2024
      </Text>
      <div>
        <Text mt={0}>
          {`Welcome to the "Club", an optional service available on our platform
          that allows users to interact with others, share content, and earn
          rewards based on the number of followers.`}
        </Text>
        <p>
          {`By joining the Club, you agree to these supplementary Terms of Service
          ("Club Terms"), which complement and expand on our platform's{" "}
          ${(<Link href={`/legal/terms`}>General Terms of Service</Link>)}
          ("General TOS"). Where conflicts arise, these Club Terms take
          precedence over the General TOS for matters relating specifically to
          the Club.`}
        </p>
        <p>
          Please read these Club Terms carefully before joining. By accessing or using the Club
          features, you agree to be bound by these terms and all related policies.
        </p>
      </div>
      <div>
        <h2>1. Eligibility to Join the Club</h2>
        <p>To join the Club, you must:</p>
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
      </div>
      <div>
        <h2>2. Membership in the Club</h2>
        <p>By joining the Club, you gain access to the following features:</p>
        <h3>1. Profile Visibility & Sharing:</h3>
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
        <h3>2. Follower Interaction:</h3>
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
        <h3>3. Income from Followers:</h3>
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
      </div>
      <div>
        <h2>3. Content and Privacy</h2>
        <h3>1. Ownership of Content:</h3>
        <p>
          You retain ownership of the content you upload to the platform, including Daily Task
          Completion Proof data and Progress Images. However, by uploading content, you grant us a
          non-exclusive, worldwide, royalty-free license to use, distribute, display, and modify
          your content for the purpose of operating the platform and promoting Club services. This
          license is revocable upon your departure from the Club, except for any content already
          shared with the public or followers.
        </p>
        <h3>2. Data Security:</h3>
        <p>
          We employ commercially reasonable security measures, such as encryption, to protect your
          personal data and content. However, we cannot guarantee the complete security of
          information transmitted through the platform. By uploading content, you acknowledge and
          accept the risk of potential unauthorized access or misuse, though we strive to prevent
          this from happening.
        </p>
        <h3>3. User-Generated Content:</h3>
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
        <h3>4. Privacy of Content:</h3>
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
        <h3>5. Leaving the Club:</h3>
        <p>
          {`You can leave the Club at any time by visiting your Settings page
          at
          ${(<a href="http://www.maxyouout.com/settings">www.maxyouout.com/settings</a>)}
          and clicking the "Leave Club" button.`}
        </p>
        <p>
          Once you leave the Club, all content you have uploaded will immediately become private.
          Followers will lose access to your private content, and public content will no longer be
          visible to general users.
        </p>
      </div>
      <div>
        <h2>4. Payment Terms</h2>
        <h3>1. Stripe Fees:</h3>
        <p>
          All payments to Club members will be processed through Stripe Connect. Stripe may deduct
          its processing fees from your earnings, in accordance with their terms and fee structure.
          We do not control Stripe&apos;s processing times, and payments may take several business
          days to reflect in your bank account after they are initiated.
        </p>
        <h3>2. Earnings from Followers:</h3>
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
        <h3>3. Payment Schedule:</h3>
        <ul>
          <li>Payouts will be processed on a monthly basis.</li>
          <li>
            You are responsible for ensuring your banking information remains current and accurate.
          </li>
        </ul>
        <h3>4. Taxes and Withholdings:</h3>
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
      </div>
      <div>
        <h2>5. Termination of Membership</h2>
        <h3>1. Content Backup and Retention:</h3>
        <p>
          Upon termination of your Club membership, all of your content will become private. All
          access to your private data (if provided) will be revoked. Your daily task completion
          proof will no longer be visible to general users.
        </p>
      </div>
      <div>
        <h2>6. Club Participation Guidelines</h2>
        <h3>1. Prohibited Activities:</h3>
        <ul>
          <li>Sharing or distributing other members&apos; content.</li>
          <li>Uploading misleading, false, or offensive content.</li>
          <li>Engaging in harassment or any form of abusive behavior.</li>
          <li>Engaging in fraudulent activities to increase payouts.</li>
        </ul>
        <h3>2. Prohibited Content:</h3>
        <p>
          You may not upload content that includes nudity, sexually explicit material, illegal
          activities, hate speech, or any content that violates the rights of others. For a full
          list of prohibited content, please refer to our <a href={`/legal/terms`}>General TOS</a>.
          We reserve the right to remove content that violates these guidelines without prior
          notice.
        </p>
        <h3>3. Reporting Mechanism:</h3>
        <p>
          If you encounter any inappropriate content or behavior, you may report it by emailing
          support@maxyouout.com. We will review and take appropriate action, which may include
          suspending or terminating the violator&apos;s account.
        </p>
      </div>
      <div>
        <h2>7. Changes to Club Terms</h2>
        <p>
          We may revise these Club Terms from time to time. Any changes will be effective when
          posted on our website or sent to you via email. Continued participation in the Club after
          changes are posted constitutes acceptance of those changes.
        </p>
      </div>
      <div>
        <h2>8. Limitation of Liability</h2>
        <p>
          In addition to the limitations outlined in our <a href={`/legal/terms`}>General TOS</a>,
          we are not responsible for any unauthorized use or access to your content by third
          parties, including followers who may violate these terms by sharing or misusing your
          images or videos.
        </p>
      </div>
      <div>
        <h2>9. Governing Law</h2>
        <h3>1. International Compliance:</h3>
        <p>
          Users are responsible for ensuring that their participation in the Club, including the
          sharing of content and receipt of income, complies with the laws and regulations of their
          country of residence. This includes reporting and paying taxes on earnings where
          applicable.
        </p>
        <p>
          These Club Terms are governed by the same laws and dispute resolution provisions as
          outlined in the <a href={`/legal/terms`}>General TOS</a>.
        </p>
      </div>
      <div style={{ marginBottom: rem(32) }}>
        <h2>10. Contact Us</h2>
        <p>
          If you have any questions regarding these Club Terms, please contact us at
          info@maxyouout.com.
        </p>
      </div>
    </>
  );
}
